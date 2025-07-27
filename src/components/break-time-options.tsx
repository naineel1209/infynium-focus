import React, { useState } from 'react';

interface BreakTimeOptionsProps {
  breakTime: number;
  onBreakTimeChange: (time: number) => void;
  breakTimeOptions: number[];
}

export const BreakTimeOptions: React.FC<BreakTimeOptionsProps> = ({
  breakTime,
  onBreakTimeChange,
  breakTimeOptions,
}) => {
  const [customBreakTime, setCustomBreakTime] = useState<boolean>(false);
  const [showCustomBreakInput, setShowCustomBreakInput] =
    useState<boolean>(false);

  // Initialize custom break time state if the current break time is not in options
  React.useEffect(() => {
    if (!breakTimeOptions.includes(breakTime)) {
      setCustomBreakTime(true);
      setShowCustomBreakInput(true);
    }
  }, [breakTime, breakTimeOptions]);

  // Handle break time option selection
  const handleBreakTimeOptionChange = (time: number) => {
    onBreakTimeChange(time);
    setCustomBreakTime(false);
  };

  // Handle custom break time input change
  const handleCustomBreakTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      onBreakTimeChange(value);
    }
  };

  // Toggle custom break time input
  const toggleCustomBreakTime = () => {
    setCustomBreakTime(!customBreakTime);
    setShowCustomBreakInput(!showCustomBreakInput);
  };

  return (
    <div className="w-full mb-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Break Time (minutes)
      </label>
      <div className="grid grid-cols-3 gap-2 mb-2">
        {breakTimeOptions.map((time) => (
          <button
            key={time}
            type="button"
            className={`py-2 px-4 rounded-md ${
              breakTime === time && !customBreakTime
                ? 'bg-emerald-500 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            } transition-colors border border-emerald-200`}
            onClick={() => handleBreakTimeOptionChange(time)}
          >
            {time}
          </button>
        ))}
      </div>
      <button
        type="button"
        className={`w-full py-2 px-4 rounded-md mb-2 ${
          customBreakTime
            ? 'bg-emerald-500 text-white'
            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
        } transition-colors border border-emerald-200`}
        onClick={toggleCustomBreakTime}
      >
        Custom
      </button>
      {/* Custom Break Time Input */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          showCustomBreakInput
            ? 'max-h-[100px] opacity-100 mt-2'
            : 'max-h-0 opacity-0'
        }`}
      >
        <input
          type="number"
          min="1"
          value={customBreakTime ? breakTime : ''}
          onChange={handleCustomBreakTimeChange}
          placeholder="Enter custom break time"
          className="w-full px-4 py-2 rounded border text-gray-900 bg-white border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>
    </div>
  );
};
