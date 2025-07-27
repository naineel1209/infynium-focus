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
  completedAt: number | null; // Timestamp when the session was completed
  currentPhase: 'focus' | 'break' | null; // Current phase for transition detection
}

/**
 * Combined type for backward compatibility during transition
 */
export interface PomodoroSettings
  extends PomodoroConfig,
    Omit<PomodoroState, 'activeConfig'> {
  // This type combines both for backward compatibility
}

/**
 * Default configuration
 */
export const DEFAULT_POMODORO_CONFIG: PomodoroConfig = {
  id: 'default-config',
  focusTime: 25,
  breakTime: 5,
  numSessions: 4,
  blockedSites: [],
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
  activeConfig: null,
  completedAt: null,
  currentPhase: null,
};

/**
 * Default settings for backward compatibility
 */
export const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
  ...DEFAULT_POMODORO_CONFIG,
  ...DEFAULT_POMODORO_STATE,
};

/**
 * Common break time options
 */
export const BREAK_TIME_OPTIONS = [5, 10, 25];

/**
 * Storage keys
 */
export const POMODORO_CONFIG_STORAGE_KEY = 'infipomodoroConfig';
export const POMODORO_STATE_STORAGE_KEY = 'infipomodoroState';
export const POMODORO_STORAGE_KEY = 'infipomodoroSettings'; // Legacy key

/**
 * Storage key for completed pomodoro sessions
 */
export const COMPLETED_POMODOROS_STORAGE_KEY = 'completedPomodoros';

/**
 * Interface for completed pomodoro sessions
 */
export interface CompletedPomodoro {
  id: string; // Unique identifier (timestamp)
  startTime: number; // When the session started
  endTime: number; // When the session completed
  focusTime: number; // Focus period in minutes
  breakTime: number; // Break period in minutes
  numSessions: number; // Number of sessions completed
  totalDuration: number; // Total duration in milliseconds
  totalPausedTime: number; // Total time spent paused
}
