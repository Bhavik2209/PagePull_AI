// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://pagepull.vercel.app';

// API Endpoints
export const API_ENDPOINTS = {
  DOM_DATA: '/get_dom_data',
  GENERATED_DATA: '/scrape_data'
} as const;