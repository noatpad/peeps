const PORT = process.env.PORT || 8000;
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL || 'http://localhost:3000/callback';
const WEB_URL = process.env.WEB_URL || 'http://localhost:3000';

module.exports = { PORT, API_KEY, API_SECRET, CALLBACK_URL, WEB_URL };
