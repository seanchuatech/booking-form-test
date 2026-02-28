import type { FieldErrors } from '../types/booking';

interface ContactInfoProps {
  isRecognized: boolean;
  customerName: string;
  firstName: string;
  lastName: string;
  email: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  errors: FieldErrors;
}

export default function ContactInfo({
  isRecognized,
  customerName,
  firstName,
  lastName,
  email,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  errors = {},
}: ContactInfoProps) {
  if (isRecognized) {
    return (
      <p className="text-sm text-success font-medium">
        Welcome back, {customerName}! 👋
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        We don't have that phone number on file. Please provide additional
        contact information.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <label className="text-xs text-muted mb-1 block" htmlFor="first-name">
            First name
          </label>
          <div
            className={`flex items-center gap-2 rounded-lg border px-4 py-3 transition-colors focus-within:border-gold focus-within:ring-2 focus-within:ring-gold-light ${
              errors.firstName ? 'border-error' : 'border-border'
            }`}
          >
            <span className="text-muted text-sm">👤</span>
            <input
              id="first-name"
              type="text"
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              placeholder="First name"
              className="flex-1 bg-transparent text-sm text-dark outline-none placeholder-muted"
            />
          </div>
          {errors.firstName && (
            <p className="mt-1 text-xs text-error">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="text-xs text-muted mb-1 block" htmlFor="last-name">
            Last name
          </label>
          <div
            className={`flex items-center gap-2 rounded-lg border px-4 py-3 transition-colors focus-within:border-gold focus-within:ring-2 focus-within:ring-gold-light ${
              errors.lastName ? 'border-error' : 'border-border'
            }`}
          >
            <span className="text-muted text-sm">👤</span>
            <input
              id="last-name"
              type="text"
              value={lastName}
              onChange={(e) => onLastNameChange(e.target.value)}
              placeholder="Last name"
              className="flex-1 bg-transparent text-sm text-dark outline-none placeholder-muted"
            />
          </div>
          {errors.lastName && (
            <p className="mt-1 text-xs text-error">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="text-xs text-muted mb-1 block" htmlFor="email">
          Email
        </label>
        <div
          className={`flex items-center gap-2 rounded-lg border px-4 py-3 transition-colors focus-within:border-gold focus-within:ring-2 focus-within:ring-gold-light ${
            errors.email ? 'border-error' : 'border-border'
          }`}
        >
          <span className="text-muted text-sm">✉️</span>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="name@example.com"
            className="flex-1 bg-transparent text-sm text-dark outline-none placeholder-muted"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-xs text-error">{errors.email}</p>
        )}
      </div>
    </div>
  );
}
