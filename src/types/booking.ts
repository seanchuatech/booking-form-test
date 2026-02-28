import { z } from 'zod';
import { bookingSchema } from '../schemas/bookingSchema';

/** Validated booking data — inferred from Zod schema */
export type BookingFormData = z.infer<typeof bookingSchema>;

/** A geographic location with address and coordinates */
export type Location = {
  address: string;
  lat: number;
  lng: number;
};

export type TripType = 'one-way' | 'hourly';
export type LocationType = 'location' | 'airport';

/**
 * Form state before validation.
 * `passengers` can be an empty string before user input.
 * Locations can be null before selection.
 */
export type FormState = {
  tripType: TripType;
  pickupDate: string;
  pickupTime: string;
  pickupLocationType: LocationType;
  pickupLocation: Location | null;
  stops: Location[];
  dropoffLocationType: LocationType;
  dropoffLocation: Location | null;
  phone: string;
  isRecognized: boolean;
  firstName: string;
  lastName: string;
  email: string;
  passengers: number | '';
};

/** Field-level validation errors keyed by dot-path */
export type FieldErrors = Partial<Record<string, string>>;

/** A known customer record */
export type Customer = {
  firstName: string;
  lastName: string;
  email: string;
};

/** Distance Matrix result */
export type TripInfo = {
  distance: string;
  duration: string;
};
