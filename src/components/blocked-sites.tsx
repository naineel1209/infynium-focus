import React from 'react';

interface BlockedSitesProps {
  blockedSites: string[];
  onAddSite: (site: string) => void;
  onRemoveSite?: (site: string) => void;
}

export const BlockedSites: React.FC<BlockedSitesProps> = ({
  blockedSites,
  onAddSite,
  onRemoveSite,
}) => {
  const [showBlockSitesInput, setShowBlockSitesInput] = React.useState(true);

  const handleAddSite = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      try {
        // Validate input as URL
        const newSite = e.currentTarget.value.trim();
        // Validate the URL format but store as string
        const url = new URL(newSite);
        const urlString = url.toString();

        // Call the onAddSite prop with the validated URL string
        onAddSite(urlString);

        // Clear the input
        e.currentTarget.value = '';
      } catch {
        // Show error for invalid URL
        alert('Please enter a valid URL (include http:// or https://)');
      }
    }
  };

  return (
    <>
      <button
        className="w-full py-2 px-4 rounded-md mb-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200 cursor-pointer"
        onClick={() => setShowBlockSitesInput(!showBlockSitesInput)}
      >
        <label className="text-sm font-medium text-emerald-600 mb-1 cursor-pointer">
          {!showBlockSitesInput ? 'Show' : 'Hide'} block sites
        </label>
      </button>
      <div
        className={`overflow-visible transition-all duration-300 ${
          showBlockSitesInput
            ? 'max-h-[500px] opacity-100'
            : 'max-h-0 opacity-0'
        }`}
      >
        <input
          type="text"
          placeholder="Enter site to block (Press Enter to add)"
          className="w-full px-4 py-2 rounded border text-gray-900 bg-white border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          onKeyDown={handleAddSite}
        />
        {blockedSites && blockedSites.length > 0 ? (
          <div className="my-2 text-sm text-gray-600">
            <p>Blocked Sites:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              {blockedSites.map((site, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between px-3 py-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden text-sm"
                >
                  <div className="flex items-center overflow-hidden flex-grow">
                    <span className="w-4 h-4 bg-emerald-500 rounded-full mr-2 flex-shrink-0"></span>
                    <span className="truncate w-full" title={site}>{site}</span>
                  </div>
                  {onRemoveSite && (
                    <button
                      onClick={() => onRemoveSite(site)}
                      className="ml-2 p-0.5 text-emerald-700 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors flex-shrink-0"
                      aria-label="Remove site"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-600">No sites blocked.</p>
        )}
      </div>
    </>
  );
};
