// Serverless API URL
const WEB_URL = process.env.WEB_URL || 'http://localhost:3000';
export const API_URL = `${WEB_URL}/api`

// Limits for list creation & display
export const LIST_COUNT_LIMIT = 1000;
export const LIST_NAME_LIMIT = 25;
export const LIST_DESCRIPTION_LIMIT = 100;
export const RESULTS_PER_PAGE = 10;
