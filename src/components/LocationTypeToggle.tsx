import type { LocationType } from '../types/booking';

interface LocationTypeToggleProps {
  value: LocationType;
  onChange: (value: LocationType) => void;
}

const TYPES: LocationType[] = ['location', 'airport'];

export default function LocationTypeToggle({ value, onChange }: LocationTypeToggleProps) {
  return (
    <div className="inline-flex rounded-md border border-border overflow-hidden text-sm">
      {TYPES.map((type) => {
        const active = value === type;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={`
              px-4 py-1.5 font-medium transition-all capitalize cursor-pointer
              ${active
                ? 'bg-gold-light/30 text-gold-dark border border-gold'
                : 'bg-white text-muted hover:bg-gray-50'
              }
            `}
          >
            {type === 'location' ? 'Location' : 'Airport'}
          </button>
        );
      })}
    </div>
  );
}
