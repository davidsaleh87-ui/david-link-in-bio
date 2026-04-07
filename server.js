const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Admin secret for API edits
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'david-linkinbio-2026';

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ─── WAITLIST ────────────────────────────────────────────────────────────────
const WAITLIST_FILE = path.join(__dirname, 'waitlist.json');

function loadWaitlist() {
  if (!fs.existsSync(WAITLIST_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(WAITLIST_FILE, 'utf8')); } catch { return []; }
}

function saveWaitlist(data) {
  fs.writeFileSync(WAITLIST_FILE, JSON.stringify(data, null, 2));
}

app.post('/waitlist', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });

  const list = loadWaitlist();
  const exists = list.find(e => e.email === email);
  if (exists) return res.json({ ok: true, message: 'Already on the list' });

  list.push({ name, email, date: new Date().toISOString() });
  saveWaitlist(list);
  console.log(`[waitlist] ${name} <${email}>`);
  res.json({ ok: true });
});

// ─── ADMIN: VIEW WAITLIST ────────────────────────────────────────────────────
app.get('/admin/waitlist', (req, res) => {
  if (req.query.secret !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  res.json(loadWaitlist());
});

// ─── ADMIN: UPDATE PAGE CONFIG ON COMMAND ───────────────────────────────────
const CONFIG_FILE = path.join(__dirname, 'config.json');

function loadConfig() {
  if (!fs.existsSync(CONFIG_FILE)) return getDefaultConfig();
  try { return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')); } catch { return getDefaultConfig(); }
}

function getDefaultConfig() {
  return {
    name: 'David Saleh',
    tagline: 'Author • Speaker • The Calm Man',
    bio: 'Author. Behavioural thinker. 7 books.\nExploring the psychology of everyday power.',
    buttons: [
      { label: 'Talk to Astrid — My AI Assistant', url: 'tel:+61259441286', style: 'astrid' },
      { label: 'Get my Books', url: 'https://books.by/davidsaleh', style: 'primary' },
      { label: 'Buy from Amazon', url: 'https://www.amazon.com/author/davidsaleh', style: 'secondary' },
      { label: 'Explore My Published Work', url: 'https://medium.com/@davidsaleh_96035', style: 'secondary' },
      { label: 'Visit my Website', url: 'https://davidcharlessaleh.com', style: 'outline' }
    ]
  };
}

app.get('/config', (req, res) => {
  res.json(loadConfig());
});

// Update any field: POST /admin/update?secret=xxx  body: { field, value }
app.post('/admin/update', (req, res) => {
  if (req.query.secret !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  const { field, value } = req.body;
  if (!field) return res.status(400).json({ error: 'field required' });

  const config = loadConfig();
  config[field] = value;
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  console.log(`[admin] updated: ${field}`);
  res.json({ ok: true, config });
});

// ─── ADMIN: PUSH INDEX.HTML REMOTELY ────────────────────────────────────────
app.post('/admin/push-html', (req, res) => {
  if (req.query.secret !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  const { html } = req.body;
  if (!html) return res.status(400).json({ error: 'html field required' });
  fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
  console.log(`[admin] index.html updated remotely (${html.length} bytes)`);
  res.json({ ok: true, bytes: html.length });
});

// ─── SERVE INDEX ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Link-in-bio running on port ${PORT}`);
});
