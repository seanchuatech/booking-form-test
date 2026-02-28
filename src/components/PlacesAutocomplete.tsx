import { useRef, useEffect, useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import type { Location, LocationType } from '../types/booking';

interface PlacesAutocompleteProps {
  value: Location | null;
  onChange?: (text: string) => void;
  onSelect: (location: Location) => void;
  placeholder?: string;
  error?: string;
  locationType?: LocationType;
}

export default function PlacesAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = 'Enter a location',
  error,
  locationType = 'location',
}: PlacesAutocompleteProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const autocompleteRef = useRef<any>(null);
  const [inputValue, setInputValue] = useState(value?.address || '');

  useEffect(() => {
    setInputValue(value?.address || '');
  }, [value?.address]);

  const handlePlaceChanged = (): void => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const location: Location = {
        address: place.formatted_address || place.name || '',
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setInputValue(location.address);
      onSelect(location);
    }
  };

  const options = {
    types: locationType === 'airport' ? ['airport'] : ['establishment', 'geocode'],
    componentRestrictions: { country: 'us' },
  };

  return (
    <div>
      <div
        className={`relative flex items-center gap-2 rounded-lg border px-4 py-3 transition-colors focus-within:border-gold focus-within:ring-2 focus-within:ring-gold-light ${
          error ? 'border-error' : 'border-border'
        }`}
      >
        <span className="text-gold">📍</span>
        <Autocomplete
          onLoad={(ac) => (autocompleteRef.current = ac)}
          onPlaceChanged={handlePlaceChanged}
          options={options}
          className="flex-1"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (onChange) onChange(e.target.value);
            }}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm text-dark outline-none placeholder-muted truncate"
          />
        </Autocomplete>
        <span className="text-muted text-xs">▼</span>
      </div>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}
