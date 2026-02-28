import PhoneInputLib from 'react-phone-number-input';
import type { E164Number } from 'libphonenumber-js';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
}

export default function PhoneInput({ value, onChange, onBlur, error }: PhoneInputProps) {
  const handleChange = (val: E164Number | undefined): void => {
    onChange(val || '');
  };

  return (
    <div>
      <PhoneInputLib
        international
        defaultCountry="US"
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder="+1 234 567 8900"
        id="phone-input"
      />
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}
