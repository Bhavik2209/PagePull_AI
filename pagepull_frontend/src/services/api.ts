import { API_BASE_URL, API_ENDPOINTS } from '../config/constants';
import { ApiResponse } from '../types';

// General API error handler
const handleApiError = (error: any): never => {
  const message = error?.message || 'An unexpected error occurred';
  console.error('API Error:', message);
  throw new Error(message);  // Re-throws the error to be handled by the caller
};

// Fetch DOM data
export async function fetchDOMData(url: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/${API_ENDPOINTS.DOM_DATA}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    // Check if the response is okay
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.error || 'Failed to fetch DOM data');
    }

    // Ensure response is parsed correctly
    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error);
  }
}

// Fetch Generated data
export async function fetchGeneratedData(prompt: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/${API_ENDPOINTS.GENERATED_DATA}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Prompt: prompt }),
    });

    // Check if the response is okay
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.error || 'Failed to fetch generated data');
    }

    // Ensure response is parsed correctly
    const data = await response.json();
    return data;
  } catch (error) {
    return handleApiError(error);
  }
}
