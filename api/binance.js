import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const API_KEY = process.env.BINANCE_API_KEY;
  const SECRET_KEY = process.env.BINANCE_SECRET_KEY;

  if (!API_KEY || !SECRET_KEY) {
    return res.status(500).json({ error: 'API keys no configuradas en Vercel' });
  }

  try {
    const startTime = new Date('2026-04-09T00:00:00Z').getTime();
    const timestamp = Date.now();
    const recvWindow = 10000;

    const queryString = `startTime=${startTime}&limit=100&recvWindow=${recvWindow}&timestamp=${timestamp}`;
    const signature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(queryString)
      .digest('hex');

    const url = `https://fapi.binance.com/fapi/v1/userTrades?${queryString}&signature=${signature}`;

    const response = await fetch(url, {
      headers: {
        'X-MBX-APIKEY': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); }
    catch(e) { return res.status(500).json({ error: 'Respuesta inválida de Binance', raw: text }); }

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Binance error', details: data });
    }

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
