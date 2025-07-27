import React from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import type { Tabs } from '../types/base_types';

export function Switcher({
  currentTab,
  setCurrentTab,
  tabs,
}: {
  currentTab: number;
  setCurrentTab: React.Dispatch<React.SetStateAction<number>>;
  tabs: Tabs[];
}) {
  const [showTabsList, setShowTabsList] = React.useState<boolean>(false);
  // Define the icon to display based on the current state
  const TabsIcon = showTabsList ? FiChevronDown : FiChevronUp;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 rounded-t-md">
      {/* Tab Switcher Buttons */}
      <div
        className={`tabs-list flex justify-center gap-4 mb-0 overflow-hidden transition-all duration-300 ease-in-out ${showTabsList ? 'max-h-[100px] opacity-100 mb-4' : 'max-h-0 opacity-0'}`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button py-2 px-4 rounded-md transition-colors ${
              currentTab === tab.id
                ? 'bg-blue-100 text-emerald-700 font-medium'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={() => {
              setCurrentTab(tab.id);
              setShowTabsList(false);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Current Tab Indicator */}
      <div className="tab-indicator w-full flex items-center justify-between">
        <span className="text-lg font-semibold text-black w-[70%] text-center">
          {tabs[currentTab].label}
        </span>
        <button
          className="toggle-tabs w-[30%] flex items-center justify-center text-emerald-600 hover:text-emerald-800 focus:outline-none transition-all duration-300 py-2 rounded-md hover:bg-blue-50"
          onClick={() => setShowTabsList(!showTabsList)}
          aria-label={showTabsList ? 'Hide tabs' : 'Show tabs'}
        >
          <TabsIcon
            size={20}
            className="transition-transform duration-300"
            style={{
              transform: showTabsList ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </button>
      </div>
    </div>
  );
}
