
import React, { useState, useEffect } from 'react';
import { Input } from "../ui/input";

interface AmountInputProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max?: number;
  placeholder: string;
  label: string;
  sublabel: string;
  disabled?: boolean;
  unit?: string;
}

const AmountInput: React.FC<AmountInputProps> = ({
  id,
  value,
  onChange,
  min,
  max,
  placeholder,
  label,
  sublabel,
  disabled = false,
  unit = '€'
}) => {
  // State to track the displayed value as a string (allows for empty input)
  const [displayValue, setDisplayValue] = useState<string>(value.toString());
  
  // State to track error messages
  const [error, setError] = useState<string | null>(null);

  // Update displayValue when the value prop changes (e.g., from parent)
  useEffect(() => {
    setDisplayValue(value.toString());
  }, [value]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Allow empty string or numbers only
    if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
      setDisplayValue(newValue);
      
      // Only update parent if we have a valid number
      if (newValue !== '') {
        onChange(Number(newValue));
      }
      
      // Clear error when user starts typing
      if (error) setError(null);
    }
  };

  // Validate on blur
  const handleBlur = () => {
    // If empty, set to minimum value
    if (displayValue === '') {
      setDisplayValue(min.toString());
      onChange(min);
      return;
    }

    const numValue = Number(displayValue);
    
    // Validate against min
    if (numValue < min) {
      setError(`El valor mínimo permitido es ${min}${unit}`);
      setDisplayValue(min.toString());
      onChange(min);
      return;
    }
    
    // Validate against max (if provided)
    if (max !== undefined && numValue > max) {
      setError(`El valor máximo permitido es ${max}${unit}`);
      setDisplayValue(max.toString());
      onChange(max);
      return;
    }
    
    // Valid value - update parent and clear any errors
    setError(null);
    onChange(numValue);
  };

  return (
    <>
      <label htmlFor={id} className="form-label">
        {label}
        <span className="block text-xs text-muted-foreground">{sublabel}</span>
      </label>
      <div className="relative mb-1">
        <Input
          type="text"
          id={id}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          placeholder={placeholder}
          disabled={disabled}
        />
        <span className="absolute right-3 top-2">{unit}</span>
      </div>
      {error && (
        <div className="text-red-500 text-xs mb-2">{error}</div>
      )}
    </>
  );
};

export default AmountInput;
