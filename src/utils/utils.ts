/**
 * Utility functions for interacting with Chrome's local storage.
 * @param key - The key under which the data is stored in Chrome's local storage.
 * @param T - The type of the data to be retrieved.
 * @returns {Promise<T | null>} A promise that resolves to the value associated with the given key in Chrome's local storage, or `null` if the key does not exist.
 */
export function getDataFromStorage<T>(key: string): Promise<T | null> {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => {
            resolve(key in result ? result[key] : null);
        });
    });
}