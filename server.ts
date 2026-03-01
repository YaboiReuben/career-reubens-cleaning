import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // Get Application Status (Default to open)
  app.get('/api/status', (req, res) => {
    res.json({ status: 'open' });
  });

  // Submit Application (Discord Only)
  app.post('/api/submit', async (req, res) => {
    const formData = req.body;
    
    // Send to Discord
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
      
      res.json({ success: true });
    } catch (e) {
      console.error('Discord Webhook Error:', e);
      res.status(500).json({ error: 'Failed to send application' });
    }
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
