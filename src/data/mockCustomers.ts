import type { Customer } from '../types/booking';

/**
 * Mock customer database.
 * Keys are E.164 phone numbers.
 */
export const mockCustomers: Record<string, Customer> = {
  '+17744153244': {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
  },
  '+12125551234': {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@example.com',
  },
  '+14155559876': {
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'mchen@example.com',
  },
};

/**
 * Look up a customer by phone number.
 * Returns the customer object or null.
 */
export function lookupCustomer(phone: string): Customer | null {
  return mockCustomers[phone] ?? null;
}
