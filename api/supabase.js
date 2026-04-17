export default async function handler(req, res) {
  const SUPA_URL = 'https://xfpsirprehkxqutuqude.supabase.co';
  const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmcHNpcnByZWhreHF1dHVxdWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MjY1NTcsImV4cCI6MjA5MTUwMjU1N30.JDV8OvpHtH0zYIEaOR0IkHOem1rkKrgr1tF3PGQxwsI';

  const path = req.query.path || '';
  const url = `${SUPA_URL}/rest/v1/${path}`;

  const headers = {
    'apikey': SUPA_KEY,
    'Authorization': `Bearer ${SUPA_KEY}`,
    'Content-Type': 'application/json',
  };

  if (req.method === 'POST') {
    headers['Prefer'] = req.headers['prefer'] || 'return=representation';
  }
  if (req.headers['on_conflict']) {
    headers['on_conflict'] = req.headers['on_conflict'];
  }

  try {
    const response = await fetch(url, {
      method: req.method,
      headers,
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
