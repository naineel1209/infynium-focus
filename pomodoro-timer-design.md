# Pomodoro Timer Design: Handling Settings Changes During Active Sessions

## Current Issue

Currently, all settings (configuration values and timer state) are in a single state object. When the user changes any setting during an active pomodoro session, it triggers:

1. An update to the settings object
2. Setting `isLocked: false` which disrupts the timer
3. Re-rendering the TimerDisplay with new configuration values
4. Unexpected behavior in the timer's state

## Proposed Solution

### 1. Separate Timer Configuration from Timer State

We need to split the current `settings` state into two separate concepts:

```typescript
// Timer configuration (user-editable settings)
interface PomodoroConfig {
  id: string;
  focusTime: number;
  breakTime: number;
  numSessions: number;
  blockedSites?: string[];
}

// Timer state (runtime state)
interface PomodoroState {
  isLocked: boolean;
  startedAt: number | null;
  isPaused: boolean;
  pausedDuration: number;
  pausedStartTimeStamp: number | null;
  activeConfig: PomodoroConfig | null; // The "frozen" configuration when timer is active
}
```

This separation allows the user to modify configuration settings without disrupting an active timer session.

### 2. Implementation Changes

#### A. Update PomodoroTypes.ts

```typescript
/**
 * Pomodoro configuration interface - user-editable settings
 */
export interface PomodoroConfig {
  id: string;
  focusTime: number; // in minutes
  breakTime: number; // in minutes
  numSessions: number;
  blockedSites?: string[];
}

/**
 * Pomodoro state interface - runtime state
 */
export interface PomodoroState {
  isLocked: boolean; // Indicates if the settings are locked
  startedAt: number | null; // timestamp of when the timer started
  isPaused: boolean; // Indicates if the timer is paused
  pausedDuration: number; // Duration in milliseconds the timer was paused
  pausedStartTimeStamp: number | null; // timestamp when the timer was last paused
  activeConfig: PomodoroConfig | null; // Frozen configuration for active session
}

/**
 * Default configuration
 */
export const DEFAULT_POMODORO_CONFIG: PomodoroConfig = {
  id: 'default-config',
  focusTime: 25,
  breakTime: 5,
  numSessions: 4,
  blockedSites: []
};

/**
 * Default state
 */
export const DEFAULT_POMODORO_STATE: PomodoroState = {
  isLocked: false,
  startedAt: null,
  isPaused: false,
  pausedDuration: 0,
  pausedStartTimeStamp: null,
  activeConfig: null
};
```

#### B. Modify PomodoroWrapper Component

```typescript
export function PomodoroWrapper() {
  // Separate state for configuration and timer state
  const [config, setConfig] = useState<PomodoroConfig>(DEFAULT_POMODORO_CONFIG);
  const [timerState, setTimerState] = useState<PomodoroState>(DEFAULT_POMODORO_STATE);

  // Refs to track changes and prevent infinite loops
  const configRef = useRef<PomodoroConfig>(DEFAULT_POMODORO_CONFIG);
  const timerStateRef = useRef<PomodoroState>(DEFAULT_POMODORO_STATE);

  // Flag to indicate if configuration changed during active session
  const [configChangedDuringSession, setConfigChangedDuringSession] = useState<boolean>(false);

  // Handle configuration changes separately
  const handleConfigChange = (newConfig: Partial<PomodoroConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    configRef.current = updatedConfig;
    persistConfig(updatedConfig);

    // If timer is active, set the flag to indicate changes pending
    if (timerState.isLocked && timerState.startedAt) {
      setConfigChangedDuringSession(true);
    }
  };

  // Handle timer state changes separately
  const handleTimerStateChange = (newState: Partial<PomodoroState>) => {
    const updatedState = { ...timerState, ...newState };
    setTimerState(updatedState);
    timerStateRef.current = updatedState;
    persistTimerState(updatedState);
  };

  // Save settings button now locks the configuration
  const handleSaveSettings = () => {
    // If configuration is valid
    if (validateConfig(config)) {
      // Create a frozen copy of the current configuration
      const updatedState = {
        ...timerState,
        isLocked: true,
        activeConfig: { ...config } // Store a frozen copy
      };

      // Reset config changed flag
      setConfigChangedDuringSession(false);

      setTimerState(updatedState);
      persistTimerState(updatedState);
    }
  };

  // Apply new configuration during active session
  const handleApplyNewConfig = () => {
    // Reset timer with new configuration
    const updatedState = {
      ...DEFAULT_POMODORO_STATE,
      isLocked: true,
      activeConfig: { ...config }
    };

    setConfigChangedDuringSession(false);
    setTimerState(updatedState);
    persistTimerState(updatedState);
  };
}
```

### 3. Visual Feedback and UX Improvements

#### Configuration Panel UI

```jsx
{/* Configuration Panel */}
<div className={`border ${configChangedDuringSession ? 'border-amber-400' : 'border-gray-200'} rounded-2xl shadow p-4 sm:p-6 bg-white flex flex-col gap-4`}>
  {configChangedDuringSession && (
    <div className="p-2 mb-2 bg-amber-100 text-amber-800 rounded-md text-sm">
      Settings changes will apply after the current session completes
      <button
        className="ml-2 underline text-amber-700 hover:text-amber-900"
        onClick={handleApplyNewConfig}
      >
        Apply Now
      </button>
    </div>
  )}

  {/* Configuration inputs */}
</div>
```

#### TimerDisplay Component

Update the TimerDisplay component to use the active configuration from the timer state:

```jsx
<TimerDisplay
  isLocked={timerState.isLocked}
  isPaused={timerState.isPaused}
  focusTime={timerState.activeConfig?.focusTime || config.focusTime}
  breakTime={timerState.activeConfig?.breakTime || config.breakTime}
  numSessions={timerState.activeConfig?.numSessions || config.numSessions}
  startedAt={timerState.startedAt}
  pausedDuration={timerState.pausedDuration}
  onStart={handleTimerStart}
  onPause={handleTimerPause}
  onComplete={handleTimerComplete}
/>
```

### 4. Storage Strategy

We need to modify the storage mechanism to handle the split between configuration and state:

```typescript
// Storage keys
export const POMODORO_CONFIG_STORAGE_KEY = 'infipomodoroConfig';
export const POMODORO_STATE_STORAGE_KEY = 'infipomodoroState';

// Load and save functions
export function loadConfig(defaultConfig: PomodoroConfig, callback: (config: PomodoroConfig) => void) {
  // Load from storage
}

export function loadTimerState(defaultState: PomodoroState, callback: (state: PomodoroState) => void) {
  // Load from storage
}

export function saveConfig(config: PomodoroConfig) {
  // Save to storage
}

export function saveTimerState(state: PomodoroState) {
  // Save to storage
}
```

## Implementation Plan

1. Update the types file to separate PomodoroConfig from PomodoroState
2. Modify the storage functions to handle both config and state separately
3. Update the PomodoroWrapper component to use separate state variables
4. Add visual feedback for configuration changes during active sessions
5. Update the TimerDisplay component to use the correct active configuration
6. Ensure smooth transitions between sessions and settings changes

## Benefits

- User can change settings during an active session without disrupting the timer
- Clear visual feedback about pending configuration changes
- Improved user experience with option to apply changes immediately or wait
- More robust separation of concerns in the codebase
- Better state management and predictability
