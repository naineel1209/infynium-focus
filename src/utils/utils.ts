/**
 * Utility functions for interacting with Chrome's local storage.
 * @param key - The key under which the data is stored in Chrome's local storage.
 * @param T - The type of the data to be retrieved.
 * @returns 
 */
export function getDataFromStorage<T>(key: string): Promise<T | null> {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => {
            resolve(result[key] || null);
        });
    });
}