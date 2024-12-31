import { API_BASE_URL } from '../config/constants';
import { ApiResponse } from '../types';

export async function fetchDOMData(url: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/get_dom_data/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch DOM data');
  }

  return response.json();
}

export async function fetchGeneratedData(prompt: string): Promise<ApiResponse> {
  const response = await fetch(`${API_BASE_URL}/get_generated_data/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Prompt: prompt }),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch generated data');
  }

  return response.json();
}