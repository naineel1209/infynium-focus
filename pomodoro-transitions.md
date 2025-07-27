# Pomodoro Timer: Smooth Transitions Strategy

## Challenges with Transitions

When implementing our separated configuration and state approach, we need to handle several transition scenarios gracefully:

1. Transitioning between focus and break sessions
2. Applying new configuration settings mid-session
3. Completing all sessions and resetting the timer
4. Handling page refreshes during active sessions

## Transition Implementation

### 1. Focus to Break Session Transitions

The timer needs to smoothly transition between focus and break periods without jarring UI changes:

```javascript
// Inside the calculateTimerState function in TimerDisplay
const calculateTimerState = () => {
  // ...existing calculation logic

  // When transitioning from focus to break or vice versa, add a visual indicator
  if (inBreakTime !== isBreak) {
    // Phase has changed
    setIsBreak(inBreakTime);

    // Optional: Add a subtle animation or sound cue
    if (inBreakTime) {
      // Just transitioned to break time
      playTransitionSound('break');
      setTransitionAnimation('to-break');
    } else {
      // Just transitioned to focus time
      playTransitionSound('focus');
      setTransitionAnimation('to-focus');
    }

    // Clear animation class after transition
    setTimeout(() => setTransitionAnimation(null), 1000);
  }

  // ...rest of the function
};

// UI Animation Classes
const animationClasses = {
  'to-break': 'animate-pulse-blue transition-colors duration-1000',
  'to-focus': 'animate-pulse-green transition-colors duration-1000',
  null: ''
};
```

### 2. Applying New Configuration During a Session

When the user clicks "Apply Now" to apply new settings:

```javascript
// Apply configuration changes immediately
const handleApplyNow = () => {
  // Store current timer phase information
  const wasInBreak = timerState.activeConfig &&
    calculateCurrentPhase(timerState) === 'break';
  const currentSessionNumber = timerState.activeConfig &&
    calculateCurrentSession(timerState);

  // Determine if we should try to maintain the current phase
  const maintainPhase = wasInBreak && config.breakTime > 0 &&
    config.focusTime > 0 && currentSessionNumber <= config.numSessions;

  // Apply new configuration but try to maintain state
  const updatedState = {
    ...timerState,
    activeConfig: { ...config },
    // If we're trying to maintain phase, keep the timer running
    startedAt: maintainPhase ? recalculateStartTime(config, wasInBreak, currentSessionNumber) : null,
    isPaused: maintainPhase ? false : true
  };

  // Helper function to recalculate the virtual start time that would put us
  // at the beginning of the same phase with the new configuration
  function recalculateStartTime(newConfig, isBreak, sessionNum) {
    const now = Date.now();
    const cycleLength = (newConfig.focusTime + newConfig.breakTime) * 60 * 1000;

    // Calculate how far into the current cycle we should be
    let msIntoCurrentCycle;
    if (isBreak) {
      // Should be at the start of a break
      msIntoCurrentCycle = newConfig.focusTime * 60 * 1000;
    } else {
      // Should be at the start of a focus period
      msIntoCurrentCycle = 0;
    }

    // Calculate how many complete cycles should have passed
    const completeCycles = sessionNum - 1;
    const msOfCompleteCycles = completeCycles * cycleLength;

    // Calculate virtual start time
    return now - (msOfCompleteCycles + msIntoCurrentCycle);
  }

  // Update state and reset flag
  setTimerState(updatedState);
  persistTimerState(updatedState);
  setConfigChangedDuringSession(false);

  // Show feedback toast
  showToast("Settings applied successfully!");
};
```

### 3. Completing All Sessions

When all sessions are complete:

```javascript
// Handle session completion
const handleTimerComplete = () => {
  // Add a celebratory animation/sound
  playCelebrationSound();
  setCompletionAnimation(true);

  // Reset timer state with a slight delay for better UX
  setTimeout(() => {
    const updatedState = {
      ...DEFAULT_POMODORO_STATE,
      isLocked: true,
      activeConfig: { ...config }
    };

    setTimerState(updatedState);
    persistTimerState(updatedState);
    setConfigChangedDuringSession(false);
    setCompletionAnimation(false);

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Complete', {
        body: 'Great job! All your pomodoro sessions are complete!',
      });
    }
  }, 1500); // Small delay for better UX
};
```

### 4. Handling Page Refreshes

When the page is refreshed during an active session:

```javascript
// In useEffect when component mounts
useEffect(() => {
  // Load configuration and state from storage
  loadConfig(DEFAULT_POMODORO_CONFIG, (loadedConfig) => {
    setConfig(loadedConfig);
    configRef.current = loadedConfig;

    loadTimerState(DEFAULT_POMODORO_STATE, (loadedState) => {
      // Check if there was an active session before refresh
      if (loadedState.startedAt && loadedState.isLocked && loadedState.activeConfig) {
        // Session was active, check if it's still valid
        const elapsedMs = Date.now() - loadedState.startedAt - (loadedState.pausedDuration || 0);
        const totalSessionTimeMs = calculateTotalSessionTime(loadedState.activeConfig);

        if (elapsedMs < totalSessionTimeMs) {
          // Session is still valid, restore it
          setTimerState(loadedState);
          timerStateRef.current = loadedState;
        } else {
          // Session has expired, reset with a message
          const resetState = {
            ...DEFAULT_POMODORO_STATE,
            isLocked: true,
            activeConfig: loadedState.activeConfig
          };

          setTimerState(resetState);
          timerStateRef.current = resetState;
          showToast("Your previous session expired while you were away");
        }
      } else {
        // No active session or not locked
        setTimerState(loadedState);
        timerStateRef.current = loadedState;
      }
    });
  });
}, []);

function calculateTotalSessionTime(config) {
  return config.numSessions * (config.focusTime + config.breakTime) * 60 * 1000;
}
```

## Transition UI Components

### Phase Transition Animation

```jsx
<div
  className={`${
    transitionAnimation ? animationClasses[transitionAnimation] : ''
  } rounded-lg p-4 text-center`}
>
  <h2 className="text-xl font-bold text-gray-800 mb-2">
    {isBreak ? 'Break Time' : 'Focus Time'}
  </h2>

  <p className={`text-4xl font-bold ${isBreak ? 'text-blue-600' : 'text-emerald-600'}`}>
    {formatTime(timeRemaining)}
  </p>
</div>
```

### Session Completion Animation

```jsx
{completionAnimation && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-xl p-8 shadow-2xl animate-bounce-in text-center">
      <h2 className="text-2xl font-bold text-emerald-600 mb-3">
        Pomodoro Complete!
      </h2>
      <p className="text-gray-700 mb-4">
        Congratulations! You've completed all your sessions.
      </p>
      <button
        className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
        onClick={() => setCompletionAnimation(false)}
      >
        Start a New Session
      </button>
    </div>
  </div>
)}
```

### Toast Notification Component

```jsx
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in">
      {message}
    </div>
  );
};

// In main component
const [toast, setToast] = useState(null);

const showToast = (message) => {
  setToast(message);
  setTimeout(() => setToast(null), 3000);
};

// In render
{toast && <Toast message={toast} onClose={() => setToast(null)} />}
```

## CSS Animation Classes

Add these to your CSS file:

```css
@keyframes pulse-blue {
  0%, 100% { background-color: white; }
  50% { background-color: rgba(59, 130, 246, 0.1); }
}

@keyframes pulse-green {
  0%, 100% { background-color: white; }
  50% { background-color: rgba(16, 185, 129, 0.1); }
}

@keyframes bounce-in {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.05); }
  70% { transform: scale(0.95); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-pulse-blue {
  animation: pulse-blue 2s ease-in-out;
}

.animate-pulse-green {
  animation: pulse-green 2s ease-in-out;
}

.animate-bounce-in {
  animation: bounce-in 0.5s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}
```

## Implementation Benefits

1. **Smooth Phase Transitions**: Visual cues help users understand when the timer transitions between focus and break periods.

2. **Maintainable Session State**: When applying new settings, we attempt to maintain the current phase and session number when possible.

3. **Celebratory Completion**: Provide positive reinforcement when users complete all sessions.

4. **Resilient to Refreshes**: Handle page refreshes gracefully by restoring the previous session state if valid.

5. **Feedback Through Toasts**: Provide non-intrusive feedback about state changes through toast notifications.

These transition enhancements ensure a smoother, more engaging user experience while maintaining the functional benefits of our separated configuration and state approach.
