interface DateTimeInputsProps {
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  dateError?: string;
  timeError?: string;
}

export default function DateTimeInputs({
  date,
  time,
  onDateChange,
  onTimeChange,
  dateError,
  timeError,
}: DateTimeInputsProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Date */}
      <div>
        <div
          className={`flex items-center gap-2 rounded-lg border px-4 py-3 transition-colors focus-within:border-gold focus-within:ring-2 focus-within:ring-gold-light ${
            dateError ? 'border-error' : 'border-border'
          }`}
        >
          <span className="text-muted">📅</span>
          <input
            type="date"
            value={date}
            min={today}
            onChange={(e) => onDateChange(e.target.value)}
            className="flex-1 bg-transparent text-sm text-dark outline-none"
            id="pickup-date"
          />
        </div>
        {dateError && (
          <p className="mt-1 text-xs text-error">{dateError}</p>
        )}
      </div>

      {/* Time */}
      <div>
        <div
          className={`flex items-center gap-2 rounded-lg border px-4 py-3 transition-colors focus-within:border-gold focus-within:ring-2 focus-within:ring-gold-light ${
            timeError ? 'border-error' : 'border-border'
          }`}
        >
          <span className="text-muted">🕐</span>
          <input
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            className="flex-1 bg-transparent text-sm text-dark outline-none"
            id="pickup-time"
          />
        </div>
        {timeError && (
          <p className="mt-1 text-xs text-error">{timeError}</p>
        )}
      </div>
    </div>
  );
}
