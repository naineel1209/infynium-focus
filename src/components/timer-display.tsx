import React, { useEffect, useRef, useState } from 'react';
import { formatTime } from '../utils/utils';
import './pomodoro-animations.css';

interface TimerDisplayProps {
  isLocked: boolean; // Indicates if the settings are locked
  isPaused?: boolean; // Indicates if the timer is paused
  focusTime: number;
  breakTime: number;
  numSessions: number;
  startedAt: number | null;
  pausedDuration?: number; // Duration in milliseconds the timer was paused
  pausedStartTimeStamp?: number | null; // Timestamp when the timer was last paused
  onStart: () => void;
  onComplete?: () => void; // Optional callback for when timer completes
  onPause: () => void; // Optional callback for pause action
  onReset?: () => void; // Optional callback for reset action
}

// Create the base component
const TimerDisplayComponent: React.FC<TimerDisplayProps> = ({
  isLocked,
  isPaused,
  focusTime,
  breakTime,
  numSessions,
  startedAt,
  pausedDuration = 0,
  onStart,
  onComplete,
  onPause,
  onReset,
}) => {
  // Refs to minimize state updates
  const timerIdRef = useRef<number | undefined>(undefined);

  // State for tracking timer
  const [timeRemaining, setTimeRemaining] = useState<number>(focusTime * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentSession, setCurrentSession] = useState<number>(1);
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [transitionAnimation, setTransitionAnimation] = useState<string | null>(
    null
  );
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const lastUpdateRef = useRef<number>(0);
  const progressAnimationRef = useRef<number | undefined>(undefined);

  // Function to calculate timer state based on elapsed time
  const calculateTimerState = () => {
    if (!startedAt) return;

    // Account for any time the timer was paused
    const elapsedTimestamp = Date.now() - startedAt - pausedDuration;
    const elapsedSeconds = Math.floor(elapsedTimestamp / 1000);

    // Calculate total cycle duration in seconds (focus + break)
    const cycleDuration = focusTime * 60 + breakTime * 60;

    // Calculate how many complete cycles have passed
    const completeCycles = Math.floor(elapsedSeconds / cycleDuration);

    // If we've completed all sessions
    if (completeCycles >= numSessions) {
      setIsRunning(false);
      setTimeRemaining(0);
      setCurrentSession(numSessions);
      setIsBreak(false);

      // Clear the timer interval
      if (timerIdRef.current) {
        window.clearInterval(timerIdRef.current);
        timerIdRef.current = undefined;
      }

      // Call the onComplete callback
      if (onComplete) onComplete();
      return;
    }

    // Calculate which session we're in (1-based)
    const currentSessionNumber = completeCycles + 1;
    setCurrentSession(currentSessionNumber);

    // Calculate seconds into the current cycle
    const secondsIntoCurrentCycle = elapsedSeconds % cycleDuration;

    // Determine if we're in break time
    const inBreakTime = secondsIntoCurrentCycle >= focusTime * 60;

    // When transitioning between phases, add an animation
    if (inBreakTime !== isBreak) {
      // Phase has changed - add animation
      setTransitionAnimation(
        inBreakTime ? 'animate-pulse-blue' : 'animate-pulse-green'
      );

      // Clear animation class after transition
      setTimeout(() => setTransitionAnimation(null), 2000);
    }

    setIsBreak(inBreakTime);

    // Calculate remaining time in current phase
    let remaining;
    if (inBreakTime) {
      // We're in break time - calculate remaining break time
      remaining = cycleDuration - secondsIntoCurrentCycle;
    } else {
      // We're in focus time - calculate remaining focus time
      remaining = focusTime * 60 - secondsIntoCurrentCycle;
    }
    console.log(`Remaining time: ${remaining} seconds`);
    setTimeRemaining(Math.max(0, remaining));
  };

  // Effect to initialize timer and set up interval
  useEffect(() => {
    // Clear any existing interval
    if (timerIdRef.current) {
      window.clearInterval(timerIdRef.current);
      timerIdRef.current = undefined;
    }
    console.log('Timer initialized');

    // Initial calculation
    if (startedAt) {
      setIsRunning(true);
      calculateTimerState();

      // Set up interval to update timer every second only if not paused
      if (!isPaused) {
        timerIdRef.current = window.setInterval(() => {
          calculateTimerState();
          lastUpdateRef.current = Date.now();
        }, 1000);

        // Initialize last update time
        lastUpdateRef.current = Date.now();

        // Set up smooth progress animation
        const updateProgress = () => {
          if (!isPaused && startedAt) {
            // Calculate exact elapsed time including milliseconds
            const elapsedTimestamp = Date.now() - startedAt - pausedDuration;
            const elapsedSeconds = elapsedTimestamp / 1000;

            // Calculate cycle duration
            const cycleDuration = focusTime * 60 + breakTime * 60;

            // Calculate which session we're in
            const completeCycles = Math.floor(elapsedSeconds / cycleDuration);
            if (completeCycles >= numSessions) {
              setProgressPercentage(100);
              return;
            }

            // Calculate seconds into current cycle
            const secondsIntoCurrentCycle = elapsedSeconds % cycleDuration;

            // Determine if in break time
            const inBreakTime = secondsIntoCurrentCycle >= focusTime * 60;

            // Calculate progress percentage
            const currentPhaseSeconds = inBreakTime
              ? secondsIntoCurrentCycle - focusTime * 60
              : secondsIntoCurrentCycle;
            const totalPhaseSeconds = inBreakTime
              ? breakTime * 60
              : focusTime * 60;
            const progress = (currentPhaseSeconds / totalPhaseSeconds) * 100;

            setProgressPercentage(Math.min(100, Math.max(0, progress)));

            // Continue animation loop
            progressAnimationRef.current =
              requestAnimationFrame(updateProgress);
          }
        };

        // Start the animation
        progressAnimationRef.current = requestAnimationFrame(updateProgress);
      }
    } else {
      // Reset timer if not started
      setTimeRemaining(focusTime * 60);
      setIsRunning(false);
      setCurrentSession(1);
      setIsBreak(false);
    }

    // Cleanup function
    return () => {
      if (timerIdRef.current) {
        window.clearInterval(timerIdRef.current);
      }
      if (progressAnimationRef.current) {
        cancelAnimationFrame(progressAnimationRef.current);
      }
    };
  }, [startedAt, isPaused, focusTime, breakTime, numSessions, pausedDuration]);

  // Fallback progress calculation - only used for initial render before animation starts
  useEffect(() => {
    if (!isRunning) {
      // Reset progress when not running
      setProgressPercentage(0);
    }
  }, [isRunning, isBreak]);

  return (
    <div
      className={`border border-gray-200 rounded-2xl shadow p-4 sm:p-6 bg-white flex flex-col gap-4 relative
        ${!isLocked ? 'border-red-400 border-2 animate-pulse' : ''}`}
    >
      {!isLocked && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          Lock settings first!
        </div>
      )}

      <div
        className={`text-center timer-phase ${isBreak ? 'break' : 'focus'} ${transitionAnimation || ''}`}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {isBreak ? 'Break Time' : 'Focus Time'}
        </h2>

        <p
          className={`text-4xl font-bold ${isBreak ? 'text-blue-600' : 'text-emerald-600'}`}
        >
          {formatTime(timeRemaining)}
        </p>

        <div className="mt-4 flex justify-center gap-2">
          <button
            className={`px-6 py-2 rounded shadow text-white ${
              isRunning
                ? 'bg-yellow-600 hover:bg-yellow-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            } focus:outline-none focus:ring-2 focus:ring-emerald-400 ${!isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => {
              if (!isLocked) return;

              if (startedAt) {
                if (!isPaused) {
                  // Pause the timer
                  onPause();
                } else {
                  // Resume the timer
                  onPause(); // Toggle pause state
                }
              } else {
                // Start the timer
                onStart();
              }
            }}
            disabled={!isLocked}
          >
            {startedAt && isPaused ? 'Resume' : startedAt ? 'Pause' : 'Start'}
          </button>

          {startedAt && (
            <button
              className={`px-6 py-2 rounded shadow text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 ${!isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => {
                if (!isLocked) return;

                if (onReset) {
                  onReset();
                }
                if (onComplete) onComplete();
              }}
              disabled={!isLocked}
            >
              Reset
            </button>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>
            Session {currentSession} of {numSessions}
          </p>
          <p>
            {isBreak ? 'Break' : 'Focus'} Time:{' '}
            {isBreak ? breakTime : focusTime} minutes
          </p>
          {startedAt && (
            <p>Started at: {new Date(startedAt).toLocaleTimeString()}</p>
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all ${isBreak ? 'bg-blue-600' : 'bg-emerald-600'}`}
            style={{
              width: `${progressPercentage}%`,
              transition: isPaused ? 'none' : 'width 0.1s linear',
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Apply memo with display name
TimerDisplayComponent.displayName = 'TimerDisplay';
export const TimerDisplay = TimerDisplayComponent;
