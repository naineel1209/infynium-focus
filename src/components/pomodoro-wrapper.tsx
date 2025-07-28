import React, { useEffect, useState, useRef } from 'react';
import { HardReload } from './hard-reload';
import { BlockedSites } from './blocked-sites';
import { BreakTimeOptions } from './break-time-options';
import { NumberInput } from './number-input';
import { TimerDisplay } from './timer-display';
import type { PomodoroConfig, PomodoroState } from '../types/pomodoro-types';
import {
  DEFAULT_POMODORO_CONFIG,
  DEFAULT_POMODORO_STATE,
  BREAK_TIME_OPTIONS,
} from '../types/pomodoro-types';
import {
  loadConfig,
  loadTimerState,
  saveConfig,
  saveTimerState,
  validateConfig,
} from '../utils/settings-manager';

// No toast notification component - notifications are handled by background script

// Alert component for configuration changes during active session
const ConfigChangedAlert = ({ onApplyNow }: { onApplyNow: () => void }) => (
  <div className="p-2 mb-3 bg-amber-100 text-amber-800 rounded-md text-sm flex items-center justify-between">
    <span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 inline mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      Settings changes will apply after current session
    </span>
    <button
      className="px-2 py-1 bg-amber-200 hover:bg-amber-300 text-amber-800 rounded-md text-xs font-medium transition-colors"
      onClick={onApplyNow}
    >
      Apply Now
    </button>
  </div>
);

export function PomodoroWrapper() {
  // Separate state for configuration and timer state
  const [config, setConfig] = useState<PomodoroConfig | null>(null);
  const [timerState, setTimerState] = useState<PomodoroState | null>(null);

  // Flag to indicate if configuration changed during active session
  const [configChangedDuringSession, setConfigChangedDuringSession] =
    useState<boolean>(false);

  // Ref to track changes and prevent infinite loops
  const configRef = useRef<PomodoroConfig | null>(null);
  const timerStateRef = useRef<PomodoroState | null>(null);

  // Load configuration and state from storage on component mount
  useEffect(() => {
    loadConfig(DEFAULT_POMODORO_CONFIG, (loadedConfig) => {
      setConfig(loadedConfig);
      configRef.current = loadedConfig;

      loadTimerState(DEFAULT_POMODORO_STATE, (loadedState) => {
        setTimerState(loadedState);
        timerStateRef.current = loadedState;

        // Check if there was an active session before refresh
        if (
          loadedState.startedAt &&
          loadedState.isLocked &&
          loadedState.activeConfig
        ) {
          // Session was active, check if it's still valid
          const elapsedMs =
            Date.now() -
            loadedState.startedAt -
            (loadedState.pausedDuration || 0);
          const activeConfig = loadedState.activeConfig;
          const totalSessionTimeMs =
            activeConfig.numSessions *
            (activeConfig.focusTime + activeConfig.breakTime) *
            60 *
            1000;

          if (elapsedMs >= totalSessionTimeMs) {
            // Session has expired, reset with a message
            const resetState: PomodoroState = {
              ...DEFAULT_POMODORO_STATE,
              isLocked: true,
              activeConfig: loadedState.activeConfig,
            };

            setTimerState(resetState);
            timerStateRef.current = resetState;
            // Previous session expired
          }
        }
      });
    });
  }, []);

  // Save configuration to storage
  const persistConfig = (configToSave: PomodoroConfig, showSuccess = false) => {
    saveConfig(configToSave, showSuccess);
    configRef.current = configToSave;
  };

  // Save timer state to storage
  const persistTimerState = (
    stateToSave: PomodoroState,
    showSuccess = false
  ) => {
    saveTimerState(stateToSave, showSuccess);
    timerStateRef.current = stateToSave;
  };

  // Handle configuration changes
  const handleConfigChange = (changes: Partial<PomodoroConfig>) => {
    if (!config) return;

    const updatedConfig = { ...config, ...changes };

    // Store the updated configuration
    setConfig(updatedConfig);
    persistConfig(updatedConfig);

    // Check if there's an active timer session
    if (timerState?.isLocked && timerState?.startedAt) {
      // Configuration changed during active session
      setConfigChangedDuringSession(true);
    }
  };

  // Handle adding a new blocked site
  const handleAddBlockedSite = (siteUrl: string) => {
    if (!config) return;

    const blockedSites = config.blockedSites
      ? [...config.blockedSites, siteUrl]
      : [siteUrl];

    handleConfigChange({ blockedSites });
  };

  // Handle removing a blocked site
  const handleRemoveBlockedSite = (siteUrl: string) => {
    if (!config || !config.blockedSites) return;

    const blockedSites = config.blockedSites.filter((site) => site !== siteUrl);

    handleConfigChange({ blockedSites });
  };

  // Handle focus time change
  const handleFocusTimeChange = (focusTime: number) => {
    handleConfigChange({ focusTime });
  };

  // Handle break time change
  const handleBreakTimeChange = (breakTime: number) => {
    handleConfigChange({ breakTime });
  };

  // Handle number of sessions change
  const handleNumSessionsChange = (numSessions: number) => {
    handleConfigChange({ numSessions });
  };

  // Handle save settings button click
  const handleSaveSettings = () => {
    if (!config || !timerState) return;

    // Validate config first
    if (validateConfig(config)) {
      // Reset the timer with the current configuration (same as handleApplyNow)
      const updatedState: PomodoroState = {
        ...DEFAULT_POMODORO_STATE,
        isLocked: true,
        activeConfig: { ...config }, // Store a frozen copy of the current configuration
        currentPhase: null,
        completedAt: null,
      };

      // Update state and persist
      setTimerState(updatedState);
      persistTimerState(updatedState, true); // Show success message
      setConfigChangedDuringSession(false);
    }
  };

  // Apply configuration changes immediately
  const handleApplyNow = () => {
    if (!config || !timerState) return;

    // Reset the timer with the current configuration
    const updatedState: PomodoroState = {
      ...DEFAULT_POMODORO_STATE,
      isLocked: true,
      activeConfig: { ...config },
      currentPhase: null,
      completedAt: null,
    };

    setTimerState(updatedState);
    persistTimerState(updatedState);
    setConfigChangedDuringSession(false);
  };

  // Handle timer start
  const handleTimerStart = () => {
    if (!config || !timerState || !timerState.isLocked) return;

    const currentTimeStamp = Date.now();
    const updatedState: PomodoroState = {
      ...timerState,
      startedAt: timerState.startedAt ? null : currentTimeStamp, // Toggle start time
      pausedDuration: 0,
      isPaused: false,
      pausedStartTimeStamp: null,
      activeConfig: timerState.activeConfig || { ...config }, // Use existing active config or create new one
      completedAt: null, // Reset completion timestamp
      currentPhase: 'focus', // Starting with focus phase
    };

    setTimerState(updatedState);
    persistTimerState(updatedState);
  };

  // Handle timer pause/resume
  const handleTimerPause = () => {
    if (!timerState) return;
    let updatedState: PomodoroState;

    if (timerState.isPaused) {
      // If currently paused, resume the timer
      const pauseDuration = timerState.pausedStartTimeStamp
        ? Date.now() - timerState.pausedStartTimeStamp
        : 0;

      updatedState = {
        ...timerState,
        isPaused: false,
        pausedDuration: (timerState.pausedDuration || 0) + pauseDuration,
        pausedStartTimeStamp: null, // Clear the pause start timestamp
        // Keep the current phase
      };
    } else {
      // If running, pause the timer
      updatedState = {
        ...timerState,
        isPaused: true,
        pausedStartTimeStamp: Date.now(), // Record when we paused
        // Keep the current phase
      };
    }

    setTimerState(updatedState);
    persistTimerState(updatedState);
  };

  // Calculate current phase of the timer
  const calculateCurrentPhase = (
    state: PomodoroState
  ): 'focus' | 'break' | null => {
    if (!state.startedAt || !state.activeConfig) return null;

    const elapsedMs =
      Date.now() - state.startedAt - (state.pausedDuration || 0);
    const elapsedSeconds = Math.floor(elapsedMs / 1000);

    const { focusTime, breakTime } = state.activeConfig;
    const cycleDuration = (focusTime + breakTime) * 60;

    const secondsIntoCurrentCycle = elapsedSeconds % cycleDuration;
    const inBreakTime = secondsIntoCurrentCycle >= focusTime * 60;

    return inBreakTime ? 'break' : 'focus';
  };

  // Check and update phase if needed
  useEffect(() => {
    if (!timerState || !timerState.startedAt || timerState.isPaused) return;

    // Calculate current phase
    const currentPhase = calculateCurrentPhase(timerState);

    // If phase has changed, update it
    if (currentPhase && currentPhase !== timerState.currentPhase) {
      const updatedState: PomodoroState = {
        ...timerState,
        currentPhase,
      };
      setTimerState(updatedState);
      persistTimerState(updatedState);
    }

    // Run this check every second when timer is active
    const interval = setInterval(() => {
      if (timerState.startedAt && !timerState.isPaused) {
        const newPhase = calculateCurrentPhase(timerState);
        if (newPhase && newPhase !== timerState.currentPhase) {
          const updatedState: PomodoroState = {
            ...timerState,
            currentPhase: newPhase,
          };
          setTimerState(updatedState);
          persistTimerState(updatedState);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState]);

  // Handle timer completion
  const handleTimerComplete = () => {
    if (!config || !timerState) return;

    // Mark current session as completed
    const completionTime = Date.now();
    const completedState: PomodoroState = {
      ...timerState,
      completedAt: completionTime,
    };

    // Save completion state before resetting
    setTimerState(completedState);
    persistTimerState(completedState);

    // Then reset the timer and apply any pending configuration changes
    setTimeout(() => {
      const updatedState: PomodoroState = {
        ...DEFAULT_POMODORO_STATE,
        isLocked: true,
        activeConfig: { ...config }, // Apply the current configuration
        currentPhase: null,
      };

      setTimerState(updatedState);
      persistTimerState(updatedState);
      setConfigChangedDuringSession(false);

      // Notifications are handled by the background script
    }, 1000); // Small delay for better UX
  };

  if (!config || !timerState) {
    return <div className="p-6 text-xl text-gray-50">Loading...</div>;
  }

  // Determine which configuration to use for the timer
  const activeConfig = timerState.activeConfig || config;

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold p-2 pb-4">InfyDoro</h1>
        <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-full rounded-md shadow-md">
          {/* Configuration Panel */}
          <div
            className={`border ${configChangedDuringSession ? 'border-amber-400' : 'border-gray-200'} rounded-2xl shadow p-4 sm:p-6 bg-white flex flex-col gap-4`}
          >
            {configChangedDuringSession && (
              <ConfigChangedAlert onApplyNow={handleApplyNow} />
            )}

            {/* Focus Time Input */}
            <NumberInput
              label="Focus Session Time (minutes)"
              value={config.focusTime}
              onChange={handleFocusTimeChange}
            />

            {/* Break Time Options */}
            <BreakTimeOptions
              breakTime={config.breakTime}
              onBreakTimeChange={handleBreakTimeChange}
              breakTimeOptions={BREAK_TIME_OPTIONS}
            />

            {/* Block Sites */}
            <BlockedSites
              blockedSites={config.blockedSites || []}
              onAddSite={handleAddBlockedSite}
              onRemoveSite={handleRemoveBlockedSite}
            />

            {/* Number of Sessions Input */}
            <NumberInput
              label="Number of Sessions"
              value={config.numSessions}
              onChange={handleNumSessionsChange}
            />

            {/* Save Button */}
            <button
              className="px-4 py-2 rounded shadow text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              onClick={handleSaveSettings}
            >
              Save Settings
            </button>
          </div>

          {/* Timer Display Section - uses activeConfig */}
          <TimerDisplay
            isLocked={timerState.isLocked}
            isPaused={timerState.isPaused}
            focusTime={activeConfig.focusTime}
            breakTime={activeConfig.breakTime}
            numSessions={activeConfig.numSessions}
            startedAt={timerState.startedAt}
            pausedDuration={timerState.pausedDuration}
            onStart={handleTimerStart}
            onPause={handleTimerPause}
            onComplete={handleTimerComplete}
            onReset={() => {
              const resetState: PomodoroState = {
                ...DEFAULT_POMODORO_STATE,
                isLocked: true,
                activeConfig: { ...activeConfig },
              };
              setTimerState(resetState);
              persistTimerState(resetState);
            }}
          />
        </div>
      </div>

      <HardReload />
    </>
  );
}
