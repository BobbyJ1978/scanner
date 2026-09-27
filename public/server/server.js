/**
 * سرور بک‌اند تحلیل SMC و Dow Theory
 * این سرور مسئولیت اتصال به APIهای خارجی و ارسال نوتیفیکیشن‌ها را دارد
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Load config
let config = {};
try {
  config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.json'), 'utf8'));
} catch (e) {
  console.log('Config file not found, using defaults');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..', 'dist')));

// Proxy endpoint for API calls (Extension Bridge alternative)
app.get('/api/proxy', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SMC-Analyzer/1.0',
        'Accept': 'application/json',
      },
      timeout: 30000,
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: 'Failed to fetch data', details: error.message });
  }
});

// CoinGecko endpoint
app.get('/api/coins/markets', async (req, res) => {
  const baseUrl = config.api?.coingecko?.baseUrl || 'https://api.coingecko.com/api/v3';
  const url = `${baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h,7d`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Coin OHLC endpoint
app.get('/api/coins/:id/ohlc', async (req, res) => {
  const { id } = req.params;
  const days = req.query.days || 7;
  const baseUrl = config.api?.coingecko?.baseUrl || 'https://api.coingecko.com/api/v3';
  const url = `${baseUrl}/coins/${id}/ohlc?vs_currency=usd&days=${days}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Notification endpoints
app.post('/api/notify/telegram', async (req, res) => {
  const { botToken, chatId, message } = req.body;
  
  if (!botToken || !chatId || !message) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/notify/discord', async (req, res) => {
  const { webhookUrl, message } = req.body;
  
  if (!webhookUrl || !message) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message }),
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/notify/email', async (req, res) => {
  const { smtp, to, subject, body } = req.body;
  
  try {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: { user: smtp.user, pass: smtp.pass },
    });

    await transporter.sendMail({
      from: smtp.user,
      to: to,
      subject: subject,
      html: body,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime()
  });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║   SMC Analyzer Server v1.0.0                ║
  ║   سرور تحلیل پول هوشمند و داو تئوری         ║
  ║                                              ║
  ║   🌐 http://localhost:${PORT}                  ║
  ║   📡 API: http://localhost:${PORT}/api         ║
  ╚══════════════════════════════════════════════╝
  `);
});
