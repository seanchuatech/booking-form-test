import { useState, useCallback, type FormEvent } from 'react';
import { LoadScript } from '@react-google-maps/api';
import { bookingSchema } from './schemas/bookingSchema';
import { lookupCustomer } from './data/mockCustomers';
import { submitBooking } from './utils/api';
import type { FormState, FieldErrors, Location, TripInfo } from './types/booking';

import TripTypeToggle from './components/TripTypeToggle';
import LocationTypeToggle from './components/LocationTypeToggle';
import DateTimeInputs from './components/DateTimeInputs';
import PlacesAutocomplete from './components/PlacesAutocomplete';
import PhoneInput from './components/PhoneInput';
import ContactInfo from './components/ContactInfo';
import PassengerCount from './components/PassengerCount';
import TripSummary from './components/TripSummary';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const LIBRARIES: ('places')[] = ['places'];

const initialForm: FormState = {
  tripType: 'one-way',
  pickupDate: '',
  pickupTime: '',
  pickupLocationType: 'location',
  pickupLocation: null,
  stops: [],
  dropoffLocationType: 'location',
  dropoffLocation: null,
  phone: '',
  isRecognized: false,
  firstName: '',
  lastName: '',
  email: '',
  passengers: '',
};

type SubmitStatus = 'success' | 'error' | null;

export default function App() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [customerName, setCustomerName] = useState('');
  const [phoneLookedUp, setPhoneLookedUp] = useState(false);
  const [tripInfo, setTripInfo] = useState<TripInfo>({ distance: '', duration: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);

  // ── Field updater ──────────────────────────
  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]): void => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  // ── Phone lookup ───────────────────────────
  const handlePhoneBlur = (): void => {
    if (!form.phone) return;
    const customer = lookupCustomer(form.phone);
    if (customer) {
      setForm((prev) => ({
        ...prev,
        isRecognized: true,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
      }));
      setCustomerName(customer.firstName);
    } else {
      setForm((prev) => ({
        ...prev,
        isRecognized: false,
        firstName: '',
        lastName: '',
        email: '',
      }));
      setCustomerName('');
    }
    setPhoneLookedUp(true);
  };

  // ── Distance Matrix ────────────────────────
  const calculateDistance = useCallback(
    (pickup: Location, dropoff: Location): void => {
      if (!window.google) return;

      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [{ lat: pickup.lat, lng: pickup.lng }],
          destinations: [{ lat: dropoff.lat, lng: dropoff.lng }],
          travelMode: 'DRIVING',
        },
        (response, status) => {
          if (
            status === 'OK' &&
            response?.rows[0]?.elements[0]?.status === 'OK'
          ) {
            const element = response.rows[0].elements[0];
            setTripInfo({
              distance: element.distance.text,
              duration: element.duration.text,
            });
          }
        }
      );
    },
    []
  );

  // ── Location handlers ──────────────────────
  const handlePickupSelect = (location: Location): void => {
    updateField('pickupLocation', location);
    if (form.dropoffLocation) calculateDistance(location, form.dropoffLocation);
  };

  const handleDropoffSelect = (location: Location): void => {
    updateField('dropoffLocation', location);
    if (form.pickupLocation) calculateDistance(form.pickupLocation, location);
  };

  // ── Add a stop ─────────────────────────────
  const addStop = (): void => {
    setForm((prev) => ({
      ...prev,
      stops: [...prev.stops, { address: '', lat: 0, lng: 0 }],
    }));
  };

  const updateStop = (index: number, location: Location): void => {
    setForm((prev) => {
      const stops = [...prev.stops];
      stops[index] = location;
      return { ...prev, stops };
    });
  };

  const removeStop = (index: number): void => {
    setForm((prev) => ({
      ...prev,
      stops: prev.stops.filter((_, i) => i !== index),
    }));
  };

  // ── Submit ─────────────────────────────────
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSubmitStatus(null);

    const data = {
      ...form,
      pickupLocation: form.pickupLocation || { address: '', lat: 0, lng: 0 },
      dropoffLocation: form.dropoffLocation || { address: '', lat: 0, lng: 0 },
      passengers: typeof form.passengers === 'number' ? form.passengers : NaN,
    };

    const result = bookingSchema.safeParse(data);

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path.join('.');
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      await submitBooking(result.data);
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={LIBRARIES}>
      <div className="min-h-screen bg-bg flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[640px]">
          {/* ── Form ───────────────────────── */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-card rounded-2xl shadow-lg border border-border/50 p-6 sm:p-8 space-y-8"
          >
            {/* ── Header ─────────────────────── */}
            <header className="text-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="text-3xl">🚘</span>
                <h1 className="text-2xl font-bold text-dark tracking-tight">
                  ExampleIQ
                </h1>
              </div>
              <h2 className="text-left text-xl sm:text-2xl text-dark">
                Let's get you on your way!
              </h2>
            </header>

            {/* Trip Type */}
            <TripTypeToggle
              value={form.tripType}
              onChange={(v) => updateField('tripType', v)}
            />

            {/* ── Pickup Section ────────── */}
            <section>
              <h3 className="text-base font-bold text-dark mb-4">Pickup</h3>

              <DateTimeInputs
                date={form.pickupDate}
                time={form.pickupTime}
                onDateChange={(v) => updateField('pickupDate', v)}
                onTimeChange={(v) => updateField('pickupTime', v)}
                dateError={errors.pickupDate}
                timeError={errors.pickupTime}
              />

              <div className="mt-4 mb-3">
                <LocationTypeToggle
                  value={form.pickupLocationType}
                  onChange={(v) => updateField('pickupLocationType', v)}
                />
              </div>

              <div className="mt-2">
                <label className="text-xs text-muted mb-1 block">
                  Location
                </label>
                <PlacesAutocomplete
                  value={form.pickupLocation}
                  onSelect={handlePickupSelect}
                  placeholder="Enter pickup location"
                  error={errors['pickupLocation.address']}
                  locationType={form.pickupLocationType}
                />
              </div>

              {/* Stops */}
              {form.stops.map((stop, i) => (
                <div key={i} className="mt-3 flex items-start gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-muted mb-1 block">
                      Stop {i + 1}
                    </label>
                    <PlacesAutocomplete
                      value={stop}
                      onSelect={(loc) => updateStop(i, loc)}
                      placeholder="Enter stop location"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStop(i)}
                    className="mt-6 text-muted hover:text-error transition-colors text-lg cursor-pointer"
                    title="Remove stop"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addStop}
                className="mt-3 text-sm text-gold hover:text-gold-dark font-medium transition-colors cursor-pointer"
              >
                + Add a stop
              </button>
            </section>

            {/* ── Dropoff Section ───────── */}
            <section className="border-t border-border pt-6">
              <h3 className="text-base font-bold text-dark mb-4">Drop off</h3>

              <div className="mb-3">
                <LocationTypeToggle
                  value={form.dropoffLocationType}
                  onChange={(v) => updateField('dropoffLocationType', v)}
                />
              </div>

              <div className="mt-2">
                <label className="text-xs text-muted mb-1 block">
                  Location
                </label>
                <PlacesAutocomplete
                  value={form.dropoffLocation}
                  onSelect={handleDropoffSelect}
                  placeholder="Enter drop off location"
                  error={errors['dropoffLocation.address']}
                  locationType={form.dropoffLocationType}
                />
              </div>
            </section>

            {/* ── Trip Summary ──────────── */}
            <TripSummary
              distance={tripInfo.distance}
              duration={tripInfo.duration}
            />

            {/* ── Contact Information ──── */}
            <section className="border-t border-border pt-6">
              <h3 className="text-base font-bold text-dark mb-4">
                Contact Information
              </h3>

              <PhoneInput
                value={form.phone}
                onChange={(v) => {
                  updateField('phone', v);
                  setPhoneLookedUp(false);
                }}
                onBlur={handlePhoneBlur}
                error={errors.phone}
              />

              {phoneLookedUp && (
                <div className="mt-4">
                  <ContactInfo
                    isRecognized={form.isRecognized}
                    customerName={customerName}
                    firstName={form.firstName}
                    lastName={form.lastName}
                    email={form.email}
                    onFirstNameChange={(v) => updateField('firstName', v)}
                    onLastNameChange={(v) => updateField('lastName', v)}
                    onEmailChange={(v) => updateField('email', v)}
                    errors={{
                      firstName: errors.firstName,
                      lastName: errors.lastName,
                      email: errors.email,
                    }}
                  />
                </div>
              )}
            </section>

            {/* ── Passengers ───────────── */}
            <section className="border-t border-border pt-6">
              <PassengerCount
                value={form.passengers}
                onChange={(v) => updateField('passengers', v)}
                error={errors.passengers}
              />
            </section>

            {/* ── Submit ───────────────── */}
            {submitStatus === 'success' && (
              <div className="rounded-lg bg-success/10 border border-success/30 px-4 py-3 text-sm text-success font-medium">
                ✅ Booking submitted successfully!
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="rounded-lg bg-error/10 border border-error/30 px-4 py-3 text-sm text-error font-medium">
                ❌ Something went wrong. Please try again.
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-lg bg-gold text-white font-semibold text-base
                         hover:bg-gold-dark active:scale-[0.98] transition-all shadow-md
                         hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? 'Submitting...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </LoadScript>
  );
}
