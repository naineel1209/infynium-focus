import React, { useEffect, useState } from 'react';
import { HardReload } from './hard-reload';

// Define types for our Pomodoro settings
interface PomodoroSettings {
  id: string;
  focusTime: number; // in minutes
  breakTime: number; // in minutes
  numSessions: number;
}

const POMODORO_STORAGE_KEY = 'infipomodoroSettings';
const BREAK_TIME_OPTIONS = [5, 10, 25];

export function PomodoroWrapper() {
  // Default settings
  const defaultSettings: PomodoroSettings = {
    id: 'default-settings',
    focusTime: 25,
    breakTime: 5,
    numSessions: 4,
  };

  // State variables
  const [settings, setSettings] = useState<PomodoroSettings | null>(null);
  const [customBreakTime, setCustomBreakTime] = useState<boolean>(false);
  const [showCustomBreakInput, setShowCustomBreakInput] =
    useState<boolean>(false);

  // Load settings from storage on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Try to get settings from chrome.storage
        chrome.storage.local.get([POMODORO_STORAGE_KEY], (result) => {
          const storedSettings = result[POMODORO_STORAGE_KEY];
          if (storedSettings) {
            setSettings(storedSettings);
            // If break time is not in preset options, set customBreakTime to true
            if (!BREAK_TIME_OPTIONS.includes(storedSettings.breakTime)) {
              setCustomBreakTime(true);
              setShowCustomBreakInput(true);
            }
          } else {
            // Use default settings if nothing is stored
            setSettings(defaultSettings);
          }
        });
      } catch (error) {
        // Fallback to default settings if there's an error
        console.error('Failed to load pomodoro settings:', error);
        setSettings(defaultSettings);
      }
    };
    fetchSettings();
  }, []);

  // Save settings to storage when they change
  useEffect(() => {
    if (settings) {
      try {
        chrome.storage.local.set({ [POMODORO_STORAGE_KEY]: settings });
      } catch (error) {
        console.error('Failed to save pomodoro settings:', error);
      }
    }
  }, [settings]);

  // Handle focus time input change
  const handleFocusTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setSettings((prev) =>
        prev ? { ...prev, focusTime: value } : defaultSettings
      );
    }
  };

  // Handle break time option selection
  const handleBreakTimeOptionChange = (breakTime: number) => {
    setSettings((prev) => (prev ? { ...prev, breakTime } : defaultSettings));
    setCustomBreakTime(false);
  };

  // Handle custom break time input change
  const handleCustomBreakTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setSettings((prev) =>
        prev ? { ...prev, breakTime: value } : defaultSettings
      );
    }
  };

  // Handle number of sessions input change
  const handleNumSessionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setSettings((prev) =>
        prev ? { ...prev, numSessions: value } : defaultSettings
      );
    }
  };

  // Toggle custom break time input
  const toggleCustomBreakTime = () => {
    setCustomBreakTime(!customBreakTime);
    setShowCustomBreakInput(!showCustomBreakInput);
  };

  // Handle save settings button click
  const handleSaveSettings = () => {
    if (!settings) return;

    // Validate settings
    if (settings.focusTime <= 0) {
      alert('Focus time must be greater than 0');
      return;
    }
    if (settings.breakTime <= 0) {
      alert('Break time must be greater than 0');
      return;
    }
    if (settings.numSessions <= 0) {
      alert('Number of sessions must be greater than 0');
      return;
    }

    // Save settings to storage
    try {
      chrome.storage.local.set({ [POMODORO_STORAGE_KEY]: settings });
      alert('Pomodoro settings saved successfully!');
    } catch (error) {
      console.error('Failed to save pomodoro settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  if (settings === null) {
    return <div className="p-6 text-gray-600">Loading...</div>;
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold p-2 pb-4">InfiPomodoro</h1>
        <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-full rounded-md shadow-md">
          <div className="border border-gray-200 rounded-2xl shadow p-4 sm:p-6 bg-white flex flex-col gap-4">
            {/* Focus Time Input */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Focus Session Time (minutes)
              </label>
              <input
                type="number"
                min="1"
                value={settings.focusTime}
                onChange={handleFocusTimeChange}
                className="w-full px-4 py-2 rounded border text-gray-900 bg-white border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            {/* Break Time Options */}
            <div className="w-full mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Break Time (minutes)
              </label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {BREAK_TIME_OPTIONS.map((time) => (
                  <button
                    key={time}
                    type="button"
                    className={`py-2 px-4 rounded-md ${
                      settings.breakTime === time && !customBreakTime
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
                  value={customBreakTime ? settings.breakTime : ''}
                  onChange={handleCustomBreakTimeChange}
                  placeholder="Enter custom break time"
                  className="w-full px-4 py-2 rounded border text-gray-900 bg-white border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            {/* Number of Sessions Input */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Sessions
              </label>
              <input
                type="number"
                min="1"
                value={settings.numSessions}
                onChange={handleNumSessionsChange}
                className="w-full px-4 py-2 rounded border text-gray-900 bg-white border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            {/* Save Button */}
            <button
              className="px-4 py-2 rounded shadow text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              onClick={handleSaveSettings}
            >
              Save Settings
            </button>
          </div>

          {/* Timer Display Section - Placeholder for future implementation */}
          <div className="border border-gray-200 rounded-2xl shadow p-4 sm:p-6 bg-white flex flex-col gap-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Timer</h2>
              <p className="text-4xl font-bold text-emerald-600">
                {settings.focusTime}:00
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <button className="px-6 py-2 rounded shadow text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                  Start
                </button>
                <button className="px-6 py-2 rounded shadow text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400">
                  Reset
                </button>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Session 1 of {settings.numSessions}</p>
                <p>Focus Time: {settings.focusTime} minutes</p>
                <p>Break Time: {settings.breakTime} minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HardReload />
    </>
  );
}
