import React from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  min?: number;
  onChange: (value: number) => void;
  placeholder?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  min = 1,
  onChange,
  placeholder,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseInt(e.target.value);
    if (!isNaN(inputValue) && inputValue >= min) {
      onChange(inputValue);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="number"
        min={min}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded border text-gray-900 bg-white border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
    </div>
  );
};
