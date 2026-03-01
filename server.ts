import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Database Setup
const db = new Database('app.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Initialize default status if not exists
const initStatus = db.prepare('SELECT value FROM settings WHERE key = ?').get('appStatus');
if (!initStatus) {
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('appStatus', 'open');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // Get Application Status
  app.get('/api/status', (req, res) => {
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('appStatus') as { value: string } | undefined;
    res.json({ status: row?.value || 'open' });
  });

  // Update Application Status
  app.post('/api/status', (req, res) => {
    const { status } = req.body;
    if (['open', 'closing-soon', 'closed'].includes(status)) {
      db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run('appStatus', status);
      res.json({ success: true, status });
    } else {
      res.status(400).json({ error: 'Invalid status' });
    }
  });

  // Submit Application
  app.post('/api/submit', async (req, res) => {
    const formData = req.body;
    
    // 1. Save to DB
    try {
      db.prepare('INSERT INTO submissions (data) VALUES (?)').run(JSON.stringify(formData));
    } catch (e) {
      console.error('DB Error:', e);
      return res.status(500).json({ error: 'Failed to save application' });
    }

    // 2. Send to Discord
    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1477532820946686146/sOMw4aJV92Rtxl83Ug03e7ABsJGKLNQI7-116fQNy4UolsJDAoVqTahwoFr3ITll-wUp';
    
    try {
      // Format message for Discord
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
      // We don't fail the request if Discord fails, as long as we saved it locally
    }

    res.json({ success: true });
  });

  // Get Submissions (Admin)
  app.get('/api/submissions', (req, res) => {
    const rows = db.prepare('SELECT * FROM submissions ORDER BY created_at DESC').all();
    const submissions = rows.map((row: any) => ({
      id: row.id,
      ...JSON.parse(row.data),
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
