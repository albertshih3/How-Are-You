"use client";

import { useState, useEffect } from "react";
import { Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle, CloudFog, CloudLightning, Edit2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { WeatherData } from "@/lib/types/location";

interface WeatherDisplayProps {
  value: WeatherData | null;
  onChange: (weather: WeatherData | null) => void;
  editable?: boolean;
  onCancel?: () => void;
}

// Weather icon mapping based on icon code
const WEATHER_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  '01d': Sun,           // Clear
  '02d': Cloud,         // Partly cloudy
  '03d': Cloud,         // Cloudy
  '09d': CloudDrizzle,  // Drizzle/Showers
  '10d': CloudRain,     // Rain
  '11d': CloudLightning, // Thunderstorm
  '13d': CloudSnow,     // Snow
  '50d': CloudFog,      // Fog
};

export function WeatherDisplay({ value, onChange, editable = false, onCancel }: WeatherDisplayProps) {
  // Start in editing mode if there's no value (for adding new weather)
  const [isEditing, setIsEditing] = useState(!value);
  const [editCondition, setEditCondition] = useState("");
  const [editTemp, setEditTemp] = useState("");
  const [editUnit, setEditUnit] = useState<'F' | 'C'>('F');

  // Exit editing mode when weather data is auto-fetched
  useEffect(() => {
    if (value && isEditing) {
      setIsEditing(false);
    }
  }, [value, isEditing]);

  const handleStartEdit = () => {
    if (value) {
      setEditCondition(value.condition);
      setEditTemp(value.temp.toString());
      setEditUnit(value.unit);
    } else {
      setEditCondition("");
      setEditTemp("");
      setEditUnit('F');
    }
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const temp = parseInt(editTemp);
    if (editCondition.trim() && !isNaN(temp)) {
      onChange({
        condition: editCondition.trim(),
        temp,
        unit: editUnit,
        icon: '01d', // Default icon for manual entries
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    if (!value && onCancel) {
      // If there's no value (adding new weather), call onCancel to hide the component
      onCancel();
    } else {
      // If there's an existing value, just exit edit mode
      setIsEditing(false);
    }
  };

  const handleClear = () => {
    onChange(null);
    setIsEditing(false);
  };

  const toggleUnit = () => {
    if (!value) return;

    const newUnit: 'F' | 'C' = value.unit === 'F' ? 'C' : 'F';
    let newTemp: number;

    if (newUnit === 'C') {
      // F to C: (F - 32) * 5/9
      newTemp = Math.round((value.temp - 32) * 5 / 9);
    } else {
      // C to F: (C * 9/5) + 32
      newTemp = Math.round((value.temp * 9 / 5) + 32);
    }

    onChange({
      ...value,
      temp: newTemp,
      unit: newUnit,
    });
  };

  if (!value && !isEditing) {
    return null;
  }

  const WeatherIcon = value ? WEATHER_ICONS[value.icon] || Sun : Sun;

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="space-y-3"
      >
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Condition (e.g., Sunny, Rainy)"
            value={editCondition}
            onChange={(e) => setEditCondition(e.target.value)}
            className="flex-1"
            aria-label="Weather condition"
          />
          <Input
            type="number"
            placeholder="Temp"
            value={editTemp}
            onChange={(e) => setEditTemp(e.target.value)}
            className="w-20"
            aria-label="Temperature"
          />
          <select
            value={editUnit}
            onChange={(e) => setEditUnit(e.target.value as 'F' | 'C')}
            className="px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            aria-label="Temperature unit"
          >
            <option value="F">°F</option>
            <option value="C">°C</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleSaveEdit}
            className="flex-1"
          >
            <Check className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleCancelEdit}
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
    >
      <div className="flex items-center gap-3">
        <WeatherIcon className="h-6 w-6 text-blue-500" />
        <div>
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {value?.condition}
          </div>
          <button
            onClick={toggleUnit}
            className="text-lg font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            aria-label={`Toggle temperature unit. Currently ${value?.unit === 'F' ? 'Fahrenheit' : 'Celsius'}`}
            type="button"
          >
            {value?.temp}°{value?.unit}
          </button>
        </div>
      </div>
      {editable && (
        <div className="flex gap-1">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleStartEdit}
            className="h-8 w-8 p-0"
            aria-label="Edit weather"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleClear}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            aria-label="Remove weather"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}
