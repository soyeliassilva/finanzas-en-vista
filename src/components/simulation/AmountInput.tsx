
import React from 'react';

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
  return (
    <>
      <label htmlFor={id} className="form-label">
        {label}
        <span className="block text-xs text-muted-foreground">{sublabel}</span>
      </label>
      <div className="relative mb-3">
        <input
          type="number"
          id={id}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="form-input w-full"
          placeholder={placeholder}
          min={min}
          max={max}
          disabled={disabled}
        />
        <span className="absolute right-3 top-2">{unit}</span>
      </div>
    </>
  );
};

export default AmountInput;
