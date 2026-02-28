import { z } from 'zod';
import { isValidPhoneNumber } from 'react-phone-number-input';

const locationSchema = z.object({
  address: z.string().min(1, 'Location is required'),
  lat: z.number(),
  lng: z.number(),
});

export const bookingSchema = z
  .object({
    tripType: z.enum(['one-way', 'hourly'], {
      required_error: 'Please select a trip type',
    }),
    pickupDate: z
      .string()
      .min(1, 'Pickup date is required')
      .refine(
        (val) => {
          const today = new Date().toISOString().split('T')[0];
          return val >= today;
        },
        { message: 'Pickup date cannot be in the past' }
      ),
    pickupTime: z.string().min(1, 'Pickup time is required'),
    pickupLocationType: z.enum(['location', 'airport']),
    pickupLocation: locationSchema,
    stops: z.array(locationSchema).optional().default([]),
    dropoffLocationType: z.enum(['location', 'airport']),
    dropoffLocation: locationSchema,
    phone: z
      .string()
      .min(1, 'Phone number is required')
      .refine((val) => isValidPhoneNumber(val), {
        message: 'Please enter a valid phone number',
      }),
    isRecognized: z.boolean(),
    firstName: z.string().optional().default(''),
    lastName: z.string().optional().default(''),
    email: z.string().optional().default(''),
    passengers: z
      .number({ invalid_type_error: 'Enter number of passengers' })
      .min(1, 'At least 1 passenger is required'),
  })
  .superRefine((data, ctx) => {
    if (!data.isRecognized) {
      if (!data.firstName || data.firstName.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'First name is required',
          path: ['firstName'],
        });
      }
      if (!data.lastName || data.lastName.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Last name is required',
          path: ['lastName'],
        });
      }
      if (!data.email || data.email.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email is required',
          path: ['email'],
        });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter a valid email',
          path: ['email'],
        });
      }
    }
  });
