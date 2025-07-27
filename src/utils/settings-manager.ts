import type {
  PomodoroSettings,
  PomodoroConfig,
  PomodoroState,
  CompletedPomodoro
} from '../types/pomodoro-types';
import {
  POMODORO_STORAGE_KEY,
  POMODORO_CONFIG_STORAGE_KEY,
  POMODORO_STATE_STORAGE_KEY,
  DEFAULT_POMODORO_CONFIG,
  DEFAULT_POMODORO_STATE,
  COMPLETED_POMODOROS_STORAGE_KEY
} from '../types/pomodoro-types';

/**
 * Load configuration from Chrome storage
 */
export const loadConfig = async (
  defaultConfig: PomodoroConfig = DEFAULT_POMODORO_CONFIG,
  onConfigLoaded: (config: PomodoroConfig) => void
): Promise<void> => {
  try {
    chrome.storage.local.get([POMODORO_CONFIG_STORAGE_KEY], (result) => {
      const storedConfig = result[POMODORO_CONFIG_STORAGE_KEY];
      if (storedConfig) {
        // If blockedSites is present, validate URLs
        if (storedConfig.blockedSites) {
          // Ensure blockedSites contains valid URLs as strings
          storedConfig.blockedSites = storedConfig.blockedSites.filter(
            (site: string) => {
              try {
                // Validate URL but store as string
                new URL(site);
                return true;
              } catch {
                console.warn(`Invalid URL skipped: ${site}`);
                return false;
              }
            }
          );
        }

        // Set the config state with stored config
        onConfigLoaded(storedConfig);
      } else {
        // Attempt to load from legacy storage
        loadLegacySettings(null, (legacySettings) => {
          // Extract config portion from legacy settings
          const configFromLegacy: PomodoroConfig = {
            id: legacySettings.id,
            focusTime: legacySettings.focusTime,
            breakTime: legacySettings.breakTime,
            numSessions: legacySettings.numSessions,
            blockedSites: legacySettings.blockedSites,
          };

          // Save the extracted config for future use
          saveConfig(configFromLegacy);

          // Return the extracted config
          onConfigLoaded(configFromLegacy);
        });
      }
    });
  } catch (error) {
    // Fallback to default config if there's an error
    console.error('Failed to load pomodoro config:', error);
    onConfigLoaded(defaultConfig);
  }
};

/**
 * Load timer state from Chrome storage
 */
export const loadTimerState = async (
  defaultState: PomodoroState = DEFAULT_POMODORO_STATE,
  onStateLoaded: (state: PomodoroState) => void
): Promise<void> => {
  try {
    chrome.storage.local.get([POMODORO_STATE_STORAGE_KEY], (result) => {
      const storedState = result[POMODORO_STATE_STORAGE_KEY];
      if (storedState) {
        // Ensure stored state has correct types
        if (typeof storedState.startedAt === 'string') {
          storedState.startedAt = new Date(storedState.startedAt).getTime();
        }

        // Set the state with stored state
        onStateLoaded(storedState);
      } else {
        // Attempt to load from legacy storage
        loadLegacySettings(null, (legacySettings) => {
          // Extract state portion from legacy settings
          const stateFromLegacy: PomodoroState = {
            isLocked: legacySettings.isLocked,
            startedAt: legacySettings.startedAt,
            isPaused: legacySettings.isPaused || false,
            pausedDuration: legacySettings.pausedDuration || 0,
            pausedStartTimeStamp: legacySettings.pausedStartTimeStamp || null,
            activeConfig: null, // No active config in legacy
            completedAt: null, // No completedAt in legacy
            currentPhase: null, // No currentPhase in legacy
          };

          // Save the extracted state for future use
          saveTimerState(stateFromLegacy);

          // Return the extracted state
          onStateLoaded(stateFromLegacy);
        });
      }
    });
  } catch (error) {
    // Fallback to default state if there's an error
    console.error('Failed to load pomodoro state:', error);
    onStateLoaded(defaultState);
  }
};

/**
 * Save configuration to Chrome storage
 */
export const saveConfig = async (
  config: PomodoroConfig,
  showSuccess = false
): Promise<boolean> => {
  try {
    await chrome.storage.local.set({ [POMODORO_CONFIG_STORAGE_KEY]: config });
    if (showSuccess) {
      alert('Pomodoro configuration saved successfully!');
    }
    return true;
  } catch (error) {
    console.error('Failed to save pomodoro config:', error);
    if (showSuccess) {
      alert('Failed to save configuration. Please try again.');
    }
    return false;
  }
};

/**
 * Save timer state to Chrome storage
 */
export const saveTimerState = async (
  state: PomodoroState,
  showSuccess = false
): Promise<boolean> => {
  try {
    await chrome.storage.local.set({ [POMODORO_STATE_STORAGE_KEY]: state });
    if (showSuccess) {
      alert('Pomodoro state saved successfully!');
    }
    return true;
  } catch (error) {
    console.error('Failed to save pomodoro state:', error);
    if (showSuccess) {
      alert('Failed to save state. Please try again.');
    }
    return false;
  }
};

/**
 * Save completed pomodoro session
 */
export const saveCompletedPomodoro = async (
  completedPomodoro: CompletedPomodoro
): Promise<boolean> => {
  try {
    // Get existing completed pomodoros
    const result = await new Promise<{ [key: string]: CompletedPomodoro[] | undefined }>((resolve) => {
      chrome.storage.local.get([COMPLETED_POMODOROS_STORAGE_KEY], (result) => {
        resolve(result);
      });
    });

    const existingPomodoros: CompletedPomodoro[] =
      result[COMPLETED_POMODOROS_STORAGE_KEY] || [];

    // Add new completed pomodoro
    const updatedPomodoros = [...existingPomodoros, completedPomodoro];

    // Save to storage
    await chrome.storage.local.set({
      [COMPLETED_POMODOROS_STORAGE_KEY]: updatedPomodoros,
    });

    return true;
  } catch (error) {
    console.error('Failed to save completed pomodoro:', error);
    return false;
  }
};

/**
 * Legacy function to load settings from Chrome storage
 * @deprecated Use loadConfig and loadTimerState instead
 */
export const loadSettings = async (
  defaultSettings: PomodoroSettings,
  onSettingsLoaded: (settings: PomodoroSettings) => void
): Promise<void> => {
  try {
    chrome.storage.local.get([POMODORO_STORAGE_KEY], (result) => {
      const storedSettings = result[POMODORO_STORAGE_KEY];
      if (storedSettings) {
        // Ensure stored settings are in the correct format
        if (typeof storedSettings.startedAt === 'string') {
          storedSettings.startedAt = new Date(
            storedSettings.startedAt
          ).getTime();
        }

        // If blockedSites is present, validate URLs
        if (storedSettings.blockedSites) {
          // Ensure blockedSites contains valid URLs as strings
          storedSettings.blockedSites = storedSettings.blockedSites.filter(
            (site: string) => {
              try {
                // Validate URL but store as string
                new URL(site);
                return true;
              } catch {
                console.warn(`Invalid URL skipped: ${site}`);
                return false;
              }
            }
          );
        }

        // Set the settings state with stored settings
        onSettingsLoaded(storedSettings);
      } else {
        // Use default settings if nothing is stored
        onSettingsLoaded(defaultSettings);
      }
    });
  } catch (error) {
    // Fallback to default settings if there's an error
    console.error('Failed to load pomodoro settings:', error);
    onSettingsLoaded(defaultSettings);
  }
};

/**
 * Legacy function to save settings to Chrome storage
 * @deprecated Use saveConfig and saveTimerState instead
 */
export const saveSettings = async (
  settings: PomodoroSettings,
  showSuccess = false
): Promise<boolean> => {
  try {
    await chrome.storage.local.set({ [POMODORO_STORAGE_KEY]: settings });
    if (showSuccess) {
      alert('Pomodoro settings saved successfully!');
    }
    return true;
  } catch (error) {
    console.error('Failed to save pomodoro settings:', error);
    if (showSuccess) {
      alert('Failed to save settings. Please try again.');
    }
    return false;
  }
};

/**
 * Helper function to load legacy settings
 */
const loadLegacySettings = async (
  defaultSettings: PomodoroSettings | null,
  callback: (settings: PomodoroSettings) => void
): Promise<void> => {
  chrome.storage.local.get([POMODORO_STORAGE_KEY], (result) => {
    const storedSettings = result[POMODORO_STORAGE_KEY];
    if (storedSettings) {
      callback(storedSettings);
    } else if (defaultSettings) {
      callback(defaultSettings);
    } else {
      // If no default provided, create minimal default
      callback({
        id: 'legacy-settings',
        focusTime: 25,
        breakTime: 5,
        numSessions: 4,
        startedAt: null,
        isLocked: false,
        isPaused: false,
        pausedDuration: 0,
        pausedStartTimeStamp: null,
      } as PomodoroSettings);
    }
  });
};

/**
 * Validate configuration before saving
 */
export const validateConfig = (config: PomodoroConfig): boolean => {
  if (config.focusTime <= 0) {
    alert('Focus time must be greater than 0');
    return false;
  }
  if (config.breakTime <= 0) {
    alert('Break time must be greater than 0');
    return false;
  }
  if (config.numSessions <= 0) {
    alert('Number of sessions must be greater than 0');
    return false;
  }

  console.log('Configuration validation passed:', config);
  return true;
};

/**
 * Legacy function to validate settings
 * @deprecated Use validateConfig instead
 */
export const validateSettings = (settings: PomodoroSettings): boolean => {
  return validateConfig(settings);
};
