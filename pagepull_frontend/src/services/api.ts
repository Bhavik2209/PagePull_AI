import { API_BASE_URL, API_ENDPOINTS } from '../config/constants';
import { ApiResponse } from '../types';

const handleApiError = (error: any): never => {
  const message = error?.message || 'An unexpected error occurred';
  console.error('API Error:', error);
  throw new Error(message);
};

export async function fetchDOMData(url: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.DOM_DATA}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch DOM data');
    }

    return response.json();
  } catch (error) {
    return handleApiError(error);
  }
}

export async function fetchGeneratedData(prompt: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GENERATED_DATA}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Prompt: prompt }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch generated data');
    }

    return response.json();
  } catch (error) {
    return handleApiError(error);
  }
}