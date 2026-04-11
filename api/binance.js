import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const API_KEY = process.env.BINANCE_API_KEY;
  const SECRET_KEY = process.env.BINANCE_SECRET_KEY;
  const startTime = new Date('2026-04-09T00:00:00Z').getTime();

  try {
    const params = `limit=100&startTime=${startTime}&timestamp=${Date.now()}`;
    const signature = crypto.createHmac('sha256', SECRET_KEY).update(params).digest('hex');
    const url = `https://fapi.binance.com/fapi/v1/userTrades?${params}&signature=${signature}`;

    const response = await fetch(url, {
      headers: { 'X-MBX-APIKEY': API_KEY }
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
