# Pomodoro Implementation Plan for Frozen Configuration

## Storing Frozen Configuration

The key to a stable timer experience is to "freeze" the configuration when a timer session starts. This ensures that any subsequent configuration changes won't affect the active timer until a new session begins.

### 1. Store Active Configuration When Timer Starts

```typescript
// Handle timer start
const handleTimerStart = () => {
  if (!timerState.isLocked) return;

  const currentTimeStamp = Date.now();
  const updatedState = {
    ...timerState,
    startedAt: timerState.startedAt ? null : currentTimeStamp,
    pausedDuration: 0,
    isPaused: false,
    pausedStartTimeStamp: null,
    activeConfig: { ...config } // Store a frozen copy of the current configuration
  };

  setTimerState(updatedState);
  persistTimerState(updatedState);
};
```

### 2. Use Active Configuration in Timer Display

The TimerDisplay component should use the active configuration (if available) instead of the current configuration:

```typescript
// Determine which configuration to use
const activeConfig = timerState.activeConfig || config;

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
/>
```

### 3. Track Configuration Changes During Active Sessions

```typescript
// Handle configuration changes
const handleConfigChange = (changes: Partial<PomodoroConfig>) => {
  const updatedConfig = { ...config, ...changes };

  // Store the updated configuration
  setConfig(updatedConfig);
  persistConfig(updatedConfig);

  // Check if there's an active timer session
  if (timerState.isLocked && timerState.startedAt) {
    // Configuration changed during active session
    setConfigChangedDuringSession(true);
  }
};
```

### 4. Reset Active Configuration on Timer Completion

```typescript
// Handle timer completion
const handleTimerComplete = () => {
  // Reset timer state and apply any pending configuration changes
  const updatedState = {
    ...DEFAULT_POMODORO_STATE,
    isLocked: true,
    activeConfig: { ...config } // Apply the current configuration
  };

  setTimerState(updatedState);
  persistTimerState(updatedState);
  setConfigChangedDuringSession(false);

  // Show notification if supported
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Pomodoro Complete', {
      body: 'All your pomodoro sessions are complete!',
    });
  }
};
```

## Handling Configuration Changes

### 1. Update Focus Time Handler

```typescript
const handleFocusTimeChange = (focusTime: number) => {
  handleConfigChange({ focusTime });
};
```

### 2. Update Break Time Handler

```typescript
const handleBreakTimeChange = (breakTime: number) => {
  handleConfigChange({ breakTime });
};
```

### 3. Update Number of Sessions Handler

```typescript
const handleNumSessionsChange = (numSessions: number) => {
  handleConfigChange({ numSessions });
};
```

### 4. Update Blocked Sites Handler

```typescript
const handleAddBlockedSite = (siteUrl: string) => {
  const blockedSites = config.blockedSites
    ? [...config.blockedSites, siteUrl]
    : [siteUrl];

  handleConfigChange({ blockedSites });
};
```

## Apply Now Feature

We need to implement an "Apply Now" feature that allows users to apply configuration changes immediately:

```typescript
// Apply configuration changes immediately
const handleApplyNow = () => {
  // Reset the timer with the current configuration
  const updatedState = {
    ...DEFAULT_POMODORO_STATE,
    isLocked: true,
    activeConfig: { ...config }
  };

  setTimerState(updatedState);
  persistTimerState(updatedState);
  setConfigChangedDuringSession(false);
};
```

## Visual Feedback Component

```jsx
const ConfigChangedAlert = ({ onApplyNow }) => (
  <div className="p-2 mb-3 bg-amber-100 text-amber-800 rounded-md text-sm flex items-center justify-between">
    <span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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
```

## Integration with PomodoroWrapper

```jsx
return (
  <>
    <div>
      <h1 className="text-2xl font-bold p-2 pb-4">InfyDoro</h1>
      <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-full rounded-md shadow-md">
        {/* Configuration Panel */}
        <div className={`border ${configChangedDuringSession ? 'border-amber-400' : 'border-gray-200'} rounded-2xl shadow p-4 sm:p-6 bg-white flex flex-col gap-4`}>
          {configChangedDuringSession && (
            <ConfigChangedAlert onApplyNow={handleApplyNow} />
          )}

          {/* Configuration inputs */}
          <NumberInput
            label="Focus Session Time (minutes)"
            value={config.focusTime}
            onChange={handleFocusTimeChange}
          />

          {/* Other configuration inputs */}

          {/* Save Button */}
          <button
            className="px-4 py-2 rounded shadow text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            onClick={handleSaveSettings}
          >
            Save Settings
          </button>
        </div>

        {/* Timer Display - uses activeConfig */}
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
      </div>
    </div>
    <HardReload />
  </>
);
```

## Important Considerations

1. **Persistence**: Both configuration and timer state need to be persisted separately.
2. **Initialization**: When loading from storage, make sure to initialize both properly.
3. **Edge Cases**: Handle edge cases like what happens if the app is refreshed during an active session.
4. **User Experience**: Make the visual feedback clear but not intrusive.
5. **Performance**: Minimize re-renders by only updating the necessary state.
