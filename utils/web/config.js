// Serverless API URL
const WEB_URL = process.env.WEB_URL || 'http://localhost:3000';
export const API_URL = `${WEB_URL}/api`

// Char limits for list creation
export const LIST_NAME_LIMIT = 25;
export const LIST_DESCRIPTION_LIMIT = 100;
