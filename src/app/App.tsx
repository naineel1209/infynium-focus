import React, { useState } from 'react';
import { PomodoroWrapper } from '../components/pomodoro-wrapper';
import { Switcher } from '../components/switcher';
import UbsWrapper from '../components/ubs-wrapper';
import type { Tabs } from '../types/base_types';
import './App.css';

const tabs: Tabs[] = [
  {
    id: 0,
    label: 'InfiBlock',
    content: <UbsWrapper />,
  },
  {
    id: 1,
    label: 'Pomodoro',
    content: <PomodoroWrapper />, // Placeholder for Pomodoro functionality
  },
];

function App() {
  const [currentTab, setCurrentTab] = useState<number>(1);

  return (
    <>
      <div className="p-[2rem]">
        {/**
         * This is where the main content of the app will be rendered
         */}
        {tabs[currentTab].content}
        {/**
         * The PomodoroWrapper component is a placeholder for the Pomodoro timer functionality.
         */}
      </div>
      <Switcher
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        tabs={tabs}
      />
    </>
  );
}

export default App;
