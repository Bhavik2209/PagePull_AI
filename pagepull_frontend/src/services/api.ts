import { ApiResponse } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000'; // Replace with your actual backend URL

export async function fetchDOMData(url: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/get_dom_data/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
    credentials: 'include', // Important for session handling
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch DOM data');
  }

  return response.json();
}

export async function fetchGeneratedData(prompt: string, domContent: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/scrape_data/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Prompt: prompt, DOM_content: domContent }),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch generated data');
    }
  
    return response.json();
  }
  