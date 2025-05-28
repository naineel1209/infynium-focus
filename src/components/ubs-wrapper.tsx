import { useEffect, useState } from 'react';
import type { BlockedSite } from '../types/ubs-wrapper';
import { CHROME_STORAGE_KEY, DAYS } from '../utils/constants';
import { getDataFromStorage } from '../utils/utils';

const UbsWrapper = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [blockedSites, setBlockedSites] = useState<BlockedSite[] | null>(null);
    const [newBlockedSite, setNewBlockedSite] = useState<BlockedSite>({
        id: '',
        url: '',
        blockedDays: [],
    });

    // Load from Chrome storage
    useEffect(() => {
        const fetchData = async () => {
            const data = await getDataFromStorage<BlockedSite[]>(CHROME_STORAGE_KEY);

            setBlockedSites(data || []);
        };
        fetchData();
    }, []);

    // Save to Chrome storage on change
    useEffect(() => {
        if (blockedSites) {
            chrome.storage.local.set({ [CHROME_STORAGE_KEY]: blockedSites });
        }
    }, [blockedSites]);

    const handleUrlChange = (id: string, newUrl: string) => {
        setBlockedSites((prev) =>
            prev?.map((site) => (site.id === id ? { ...site, url: newUrl } : site)) || []
        );
    };

    const toggleBlockedDay = (id: string, dayIndex: number) => {
        setBlockedSites((prev) =>
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

    if (blockedSites.length === 0) {
        return (
            <div className="p-6 bg-gray-50 min-h-full space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">No Blocked Sites</h2>
                <p className="text-gray-600">You have not blocked any sites yet.</p>

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

                            const newSite: BlockedSite = {
                                ...newBlockedSite,
                                id: Date.now().toString(),
                            };

                            setBlockedSites((prev) => [...(prev || []), newSite]);
                            setNewBlockedSite({ id: '', url: '', blockedDays: [] });
                            alert('Blocked site added successfully!');
                        }}
                    >
                        Add Blocked Site
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-full">
            <div className="flex justify-end">
                <button
                    onClick={() => setIsEditing((prev) => !prev)}
                    className="px-4 py-2 mb-4 rounded shadow text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    {isEditing ? 'Lock' : 'Edit'}
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
                        disabled={!isEditing}
                        className={`w-full px-4 py-2 rounded border text-gray-900 ${isEditing
                            ? 'bg-white border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400'
                            : 'bg-gray-100 border-gray-300 text-gray-700'
                            }`}
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                        {DAYS.map((day, index) => {
                            const isChecked = site.blockedDays.includes(index);
                            return (
                                <label key={index} className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        disabled={!isEditing}
                                        onChange={() => toggleBlockedDay(site.id, index)}
                                        className={`h-4 w-4 accent-blue-600 ${!isEditing ? 'opacity-70' : ''}`}
                                    />
                                    <span className={`${isChecked ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {day}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            ))}

            {isEditing && (
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

                            if (blockedSites.some((site) => site.url === newBlockedSite.url)) {
                                alert('This site is already blocked');
                                return;
                            }

                            const newSite: BlockedSite = {
                                ...newBlockedSite,
                                id: Date.now().toString(),
                            };

                            setBlockedSites((prev) => [...(prev || []), newSite]);
                            setNewBlockedSite({ id: '', url: '', blockedDays: [] });
                            setIsEditing(false);
                            alert('Blocked site added successfully!');
                        }}
                    >
                        Add Blocked Site
                    </button>
                </div>
            )}
        </div>
    );
};

export default UbsWrapper;
