import React, { useEffect, useState } from 'react';
import type { BlockedSite } from '../types/ubs-wrapper';
import { CHROME_STORAGE_KEY, DAYS } from '../utils/constants';
import { getDataFromStorage } from '../utils/utils';
import { HardReload } from './hard-reload';

const UbsWrapper = () => {
  const defaultBlockedSites = [
    {
      id: '6969',
      url: 'https://example.com',
      blockedDays: [0, 1, 2, 3, 4, 5, 6], // Blocked every day for testing
    },
    {
      id: '9696',
      url: 'https://test.com',
      blockedDays: [0, 2, 4], // Blocked on Sunday, Tuesday, and Thursday for testing
    },
    {
      id: '151515',
      url: 'https://x.com',
      blockedDays: [1, 3, 5], // Blocked on Monday, Wednesday, and Friday for testing
    },
  ];
  const [blockedSites, setBlockedSites] = useState<BlockedSite[] | null>(null);
  const [newBlockedSite, setNewBlockedSite] = useState<BlockedSite>({
    id: '',
    url: '',
    blockedDays: [],
  });

  // This effect runs once on component mount to fetch the blocked sites from storage
  // If no data is found, it initializes with default blocked sites

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDataFromStorage<BlockedSite[]>(CHROME_STORAGE_KEY);
      setBlockedSites(() => {
        // If no data is found, initialize with default blocked sites
        if (!data || data.length === 0) {
          return defaultBlockedSites;
        }

        const dataMap = new Map(data.map((site) => [site.id, site]));

        const mergedSites = [...data];

        defaultBlockedSites.forEach((defaultSite) => {
          if (!dataMap.has(defaultSite.id)) {
            mergedSites.push(defaultSite);
          }
        });
        return mergedSites;
      });
    };
    fetchData();
  }, []);

  // Update the storage whenever blockedSites changes
  // This ensures that any changes made to the blocked sites are saved
  useEffect(() => {
    if (blockedSites) {
      chrome.storage.local.set({ [CHROME_STORAGE_KEY]: blockedSites });
    }
  }, [blockedSites]);

  const handleUrlChange = (id: string, newUrl: string) => {
    setBlockedSites(
      (prev) =>
        prev?.map((site) =>
          site.id === id ? { ...site, url: newUrl } : site
        ) || []
    );
  };

  const toggleBlockedDay = (id: string, dayIndex: number) => {
    setBlockedSites(
      (prev) =>
        prev?.map((site) => {
          if (site.id !== id) return site;
          const isBlocked = site.blockedDays.includes(dayIndex);
          const newBlockedDays = isBlocked
            ? site.blockedDays.filter((d) => d !== dayIndex)
            : [...site.blockedDays, dayIndex];
          return { ...site, blockedDays: newBlockedDays };
        }) || []
    );
  };

  if (blockedSites === null) {
    return <div className="p-6 text-gray-600">Loading...</div>;
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold p-2 pb-4">InfiBlock</h1>
        <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-full rounded-md shadow-md">
          {blockedSites.length === 0 && (
            <div className="text-gray-600 text-center">
              No blocked sites found. Add a new one below.
            </div>
          )}
          <div className="border border-gray-200 rounded-2xl shadow p-4 sm:p-6 bg-white flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter new blocked site URL"
              className="w-full px-4 py-2 rounded border text-gray-900 bg-white border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) =>
                setNewBlockedSite((prev) => ({ ...prev, url: e.target.value }))
              }
              value={newBlockedSite.url}
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {DAYS.map((day, index) => (
                <label key={index} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-blue-600"
                    onChange={() =>
                      setNewBlockedSite((prev) => ({
                        ...prev,
                        blockedDays: prev.blockedDays.includes(index)
                          ? prev.blockedDays.filter((d) => d !== index)
                          : [...prev.blockedDays, index],
                      }))
                    }
                    checked={newBlockedSite.blockedDays.includes(index)}
                  />
                  <span className="text-gray-700">{day}</span>
                </label>
              ))}
            </div>
            <button
              className="px-4 py-2 rounded shadow text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              onClick={() => {
                if (!newBlockedSite.url.trim()) {
                  alert('Please enter a valid URL');
                  return;
                }

                if (newBlockedSite.blockedDays.length === 0) {
                  alert('Please select at least one day to block the site');
                  return;
                }

                if (
                  blockedSites.some((site) => site.url === newBlockedSite.url)
                ) {
                  alert('This site is already blocked');
                  return;
                }

                const newSite: BlockedSite = {
                  ...newBlockedSite,
                  id:
                    Date.now().toString() +
                    Math.random().toString(36).substring(2, 9), // Generate a unique ID
                };

                setBlockedSites((prev) => [...(prev || []), newSite]);
                setNewBlockedSite({ id: '', url: '', blockedDays: [] });
                alert('Blocked site added successfully!');
              }}
            >
              Add Blocked Site
            </button>
          </div>
          {blockedSites.map((site) => (
            <div
              key={site.id}
              className="border border-gray-200 rounded-2xl shadow p-4 sm:p-6 bg-white flex flex-col gap-4"
            >
              <input
                type="text"
                value={site.url}
                onChange={(e) => handleUrlChange(site.id, e.target.value)}
                className="w-full px-4 py-2 rounded border text-gray-900 bg-white border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                {DAYS.map((day, index) => {
                  const isChecked = site.blockedDays.includes(index);
                  return (
                    <label
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleBlockedDay(site.id, index)}
                        className="h-4 w-4 accent-blue-600"
                      />
                      <span
                        className={`${isChecked ? 'text-gray-900' : 'text-gray-400'}`}
                      >
                        {day}
                      </span>
                    </label>
                  );
                })}
              </div>
              <div>
                <button
                  className="px-4 py-2 w-full rounded shadow text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 hover:shadow-lg transition duration-200"
                  type="button"
                  onClick={() => {
                    // Alert the user before removing
                    if (
                      !confirm(`Are you sure you want to remove ${site.url}?`)
                    ) {
                      return;
                    }

                    setBlockedSites(
                      (prev) =>
                        prev?.filter(
                          (blockedSite) => blockedSite.id !== site.id
                        ) || []
                    );
                  }}
                >
                  Remove Blocked Site
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <HardReload />
    </>
  );
};

export default UbsWrapper;
