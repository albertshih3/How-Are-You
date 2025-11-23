"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentPosition, GeolocationError } from "@/lib/location/geolocation";
import { searchLocations, reverseGeocode } from "@/lib/location/geocoding";
import type { LocationData } from "@/lib/types/location";

interface LocationInputProps {
  value: LocationData | null;
  onChange: (location: LocationData | null) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

export function LocationInput({ value, onChange, onError, onCancel }: LocationInputProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Update query when value changes externally
  useEffect(() => {
    if (value) {
      setQuery(value.name);
    } else {
      setQuery("");
    }
  }, [value]);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || value?.name === query) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchLocations(query, 5);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to search locations";
        onError?.(message);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, value, onError]);

  const handleUseCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const position = await getCurrentPosition();
      const location = await reverseGeocode(position.latitude, position.longitude);
      onChange(location);
      setQuery(location.name);
      setShowSuggestions(false);
    } catch (error) {
      let message = "Failed to get your location";
      if (error instanceof GeolocationError) {
        message = error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      onError?.(message);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleSelectSuggestion = (location: LocationData) => {
    onChange(location);
    setQuery(location.name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleClear = () => {
    onChange(null);
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (!newQuery.trim()) {
      onChange(null);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow click events
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for a city or location..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={handleInputBlur}
            disabled={isGettingLocation}
            className="pr-8"
            aria-label="Location search"
            aria-autocomplete="list"
            aria-controls="location-suggestions"
            aria-expanded={showSuggestions}
          />
          {isSearching && (
            <Loader2 className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
          )}
          {value && !isSearching && (
            <button
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              aria-label="Clear location"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Autocomplete Suggestions */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                id="location-suggestions"
                role="listbox"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg overflow-hidden"
              >
                {suggestions.map((location, index) => (
                  <button
                    key={`${location.lat}-${location.lon}`}
                    role="option"
                    aria-selected={value?.name === location.name}
                    onClick={() => handleSelectSuggestion(location)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-start gap-2 border-b last:border-b-0 border-slate-100 dark:border-slate-700"
                    type="button"
                  >
                    <MapPin className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {location.name}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isGettingLocation}
          variant="outline"
          className="flex-shrink-0"
          aria-label="Use current location"
        >
          {isGettingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
          <span className="ml-2 hidden sm:inline">Current</span>
        </Button>

        {!value && onCancel && (
          <Button
            type="button"
            size="sm"
            onClick={onCancel}
            variant="outline"
            className="flex-shrink-0"
            aria-label="Cancel"
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        )}
      </div>

      {value && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
        >
          <MapPin className="h-3.5 w-3.5 text-blue-500" />
          <span>{value.name}</span>
        </motion.div>
      )}
    </div>
  );
}
