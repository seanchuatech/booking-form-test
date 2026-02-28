import type { TripType } from '../types/booking';

interface TripTypeOption {
  value: TripType;
  label: string;
  icon: string;
}

const options: TripTypeOption[] = [
  { value: 'one-way', label: 'One-way', icon: '➤' },
  { value: 'hourly', label: 'Hourly', icon: '⏱' },
];

interface TripTypeToggleProps {
  value: TripType;
  onChange: (value: TripType) => void;
}

export default function TripTypeToggle({ value, onChange }: TripTypeToggleProps) {
  return (
    <div className="flex rounded-lg border border-border overflow-hidden">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-3 px-6 text-sm font-semibold transition-all cursor-pointer
              ${active
                ? 'bg-gold text-white shadow-md'
                : 'bg-white text-muted hover:bg-gold-light/20'
              }
            `}
          >
            <span>{opt.icon}</span>
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
