import React, { useState, useEffect } from 'react';
import { Input } from "../ui/input";
import { formatNumber } from "../../utils/calculator";

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
  customValidation?: (value: number) => { isValid: boolean; errorMessage: string | null };
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
  unit = '€',
  customValidation
}) => {
  // State to track the displayed value as a string (allows for empty input)
  const [displayValue, setDisplayValue] = useState<string>(
    unit === '€' && value > 0 ? formatNumber(value) : value.toString()
  );
  
  // State to track error messages
  const [error, setError] = useState<string | null>(null);

  // Update displayValue when the value prop changes (e.g., from parent)
  useEffect(() => {
    setDisplayValue(unit === '€' && value > 0 ? formatNumber(value) : value.toString());
  }, [value, unit]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Allow empty string or valid characters (numbers and Spanish separators)
    if (newValue === '' || /^[\d.,]*$/.test(newValue)) {
      setDisplayValue(newValue);
      
      // Only update parent if we have a valid number
      if (newValue !== '') {
        // Convert from Spanish format to number
        const numericValue = parseFloat(newValue.replace(/\./g, '').replace(',', '.'));
        if (!isNaN(numericValue)) {
          onChange(numericValue);
        }
      }
      
      // Clear error when user starts typing
      if (error) setError(null);
    }
  };

  // Validate on blur
  const handleBlur = () => {
    // If empty, set to minimum value
    if (displayValue === '') {
      const formattedMin = unit === '€' ? formatNumber(min) : min.toString();
      setDisplayValue(formattedMin);
      onChange(min);
      return;
    }

    // Convert from Spanish format to number
    const numValue = parseFloat(displayValue.replace(/\./g, '').replace(',', '.'));
    
    if (isNaN(numValue)) {
      setError(`Valor inválido`);
      setDisplayValue(unit === '€' ? formatNumber(min) : min.toString());
      onChange(min);
      return;
    }
    
    // Apply custom validation if provided
    if (customValidation) {
      const validationResult = customValidation(numValue);
      if (!validationResult.isValid) {
        setError(validationResult.errorMessage);
        // For custom validation, let's reset to the current value to avoid ui/ux confusion
        return;
      }
    } else {
      // Standard min/max validation
      // Validate against min
      if (numValue < min) {
        setError(`El valor mínimo permitido es ${formatNumber(min)}${unit}`);
        setDisplayValue(unit === '€' ? formatNumber(min) : min.toString());
        onChange(min);
        return;
      }
      
      // Validate against max (if provided)
      if (max !== undefined && numValue > max) {
        setError(`El valor máximo permitido es ${formatNumber(max)}${unit}`);
        setDisplayValue(unit === '€' ? formatNumber(max) : max.toString());
        onChange(max);
        return;
      }
    }
    
    // Format value for display
    const formattedValue = unit === '€' ? formatNumber(numValue) : numValue.toString();
    setDisplayValue(formattedValue);
    
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
