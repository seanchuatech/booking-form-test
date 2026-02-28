interface PassengerCountProps {
  value: number | '';
  onChange: (value: number | '') => void;
  error?: string;
}

export default function PassengerCount({ value, onChange, error }: PassengerCountProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-dark mb-2">
        How many passengers are expected for the trip?
      </p>
      <div>
        <label className="text-xs text-muted mb-1 block" htmlFor="passengers">
          # Passengers
        </label>
        <div
          className={`inline-flex items-center gap-2 rounded-lg border px-4 py-3 transition-colors focus-within:border-gold focus-within:ring-2 focus-within:ring-gold-light ${
            error ? 'border-error' : 'border-border'
          }`}
        >
          <span className="text-gold font-bold">#</span>
          <input
            id="passengers"
            type="number"
            min="1"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10) || '')}
            className="w-16 bg-transparent text-sm text-dark outline-none"
            placeholder="#"
          />
        </div>
        {error && <p className="mt-1 text-xs text-error">{error}</p>}
      </div>
    </div>
  );
}
