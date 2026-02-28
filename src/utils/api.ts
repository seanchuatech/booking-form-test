import type { BookingFormData } from '../types/booking';

const MOCK_API_URL = 'https://jsonplaceholder.typicode.com/posts';

interface MockApiResponse {
  id: number;
  [key: string]: unknown;
}

/**
 * Submit booking data to the mock API.
 * Returns the parsed JSON response.
 */
export async function submitBooking(data: BookingFormData): Promise<MockApiResponse> {
  const response = await fetch(MOCK_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Submission failed: ${response.status}`);
  }

  return response.json() as Promise<MockApiResponse>;
}
