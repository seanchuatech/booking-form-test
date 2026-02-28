import type { TripInfo } from '../types/booking';

type TripSummaryProps = TripInfo;

export default function TripSummary({ distance, duration }: TripSummaryProps) {
  if (!distance && !duration) return null;

  return (
    <div className="flex items-center gap-6 rounded-lg bg-gold-light/15 border border-gold-light px-5 py-4">
      {distance && (
        <div className="flex items-center gap-2">
          <span className="text-gold text-lg">🛣️</span>
          <div>
            <p className="text-xs text-muted uppercase tracking-wide">Distance</p>
            <p className="text-sm font-semibold text-dark">{distance}</p>
          </div>
        </div>
      )}
      {duration && (
        <div className="flex items-center gap-2">
          <span className="text-gold text-lg">⏱</span>
          <div>
            <p className="text-xs text-muted uppercase tracking-wide">Est. Travel Time</p>
            <p className="text-sm font-semibold text-dark">{duration}</p>
          </div>
        </div>
      )}
    </div>
  );
}
