import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Supabase Setup
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // Get Application Status
  app.get('/api/status', async (req, res) => {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'appStatus')
      .single();
    
    if (error) {
      // Ignore "Row not found" error for single()
      if (error.code === 'PGRST116') {
        return res.json({ status: 'open' });
      }
      
      console.error('Supabase Error in /api/status:', JSON.stringify(error, null, 2));
      
      // Check for missing table error
      if (error.code === '42P01') {
        console.error('----------------------------------------------------------------');
        console.error('CRITICAL: Database tables not found.');
        console.error('You MUST run the SQL setup script in your Supabase Dashboard.');
        console.error('See the instructions in the chat.');
        console.error('----------------------------------------------------------------');
      }
    }
    
    res.json({ status: data?.value || 'open' });
  });

  // Update Application Status
  app.post('/api/status', async (req, res) => {
    const { status } = req.body;
    if (['open', 'closing-soon', 'closed'].includes(status)) {
      const { error } = await supabase
        .from('settings')
        .upsert({ key: 'appStatus', value: status });
        
      if (error) {
        console.error('Supabase Error:', error);
        return res.status(500).json({ error: 'Failed to update status' });
      }
      
      res.json({ success: true, status });
    } else {
      res.status(400).json({ error: 'Invalid status' });
    }
  });

  // Submit Application
  app.post('/api/submit', async (req, res) => {
    const formData = req.body;
    
    // 1. Save to Supabase
    const { error } = await supabase
      .from('submissions')
      .insert([{ data: formData }]);

    if (error) {
      console.error('Supabase Error in /api/submit:', JSON.stringify(error, null, 2));
      if (error.code === '42P01') {
        return res.status(500).json({ error: 'Database tables missing. Please run SQL setup.' });
      }
      return res.status(500).json({ error: 'Failed to save application' });
    }

    // 2. Send to Discord
    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1477532820946686146/sOMw4aJV92Rtxl83Ug03e7ABsJGKLNQI7-116fQNy4UolsJDAoVqTahwoFr3ITll-wUp';
    
    try {
      const embed = {
        title: "New Staff Application",
        color: 3447003, // Blue
        fields: [
          { name: "Name", value: formData.fullName || 'N/A', inline: true },
          { name: "Phone", value: formData.phone || 'N/A', inline: true },
          { name: "Suburb", value: formData.suburb || 'N/A', inline: true },
          { name: "Availability", value: formData.availability || 'N/A' },
          { name: "Experience", value: (formData.experience || '').substring(0, 1024) },
        ],
        footer: { text: "Reuben's Cleaning Service Portal" },
        timestamp: new Date().toISOString()
      };

      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] })
      });
    } catch (e) {
      console.error('Discord Webhook Error:', e);
    }

    res.json({ success: true });
  });

  // Get Submissions (Admin)
  app.get('/api/submissions', async (req, res) => {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Error in /api/submissions:', JSON.stringify(error, null, 2));
      return res.status(500).json({ error: 'Failed to fetch submissions' });
    }

    const submissions = data.map((row: any) => ({
      id: row.id,
      ...row.data,
      createdAt: row.created_at
    }));
    res.json(submissions);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
