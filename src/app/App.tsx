import { useState } from 'react';
import './App.css';
import UbsWrapper from '../components/ubs-wrapper';

function App() {
  const [count, setCount] = useState(0);

  /**
   * Handle button click event - This button will hard reload the current tab
   * @returns {void}
   */
  const handleButtonClick = async (): Promise<void> => {
    const currentTab = await chrome.tabs.query({ active: true, currentWindow: true });

    // Empty Cache and Hard Reload
    await chrome.browsingData.removeCache({
      origins: [currentTab[0].url!],
    });

    // Hard Reload
    await chrome.tabs.reload(currentTab[0].id!, {
      bypassCache: true,
    });

    // Increment the count
    setCount((prevCount) => prevCount + 1);
  }

  return (
    <>
      <h1>Unlimited Block Sites</h1>
      <UbsWrapper />
      <div className="card">
        <button onClick={handleButtonClick}>
          <span>Hard Reload</span>
          <br />
          <span className="counter">{count}</span>
          <span className="counter"> times</span>
        </button>
      </div>
    </>
  )
}

export default App
