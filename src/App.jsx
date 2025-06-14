import React, { useState } from 'react';
import './App.css';

function App() {
  const [array, setArray] = useState([]);
  const [mode, setMode] = useState('auto');
  const [manualInput, setManualInput] = useState('');
  const [target, setTarget] = useState('');
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [foundIndex, setFoundIndex] = useState(null);
  const [searching, setSearching] = useState(false);

  const generateArray = () => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 90 + 10)).sort((a, b) => a - b);
    setArray(newArray);
    resetSearch();
  };

  const handleManualInput = () => {
    const parsed = manualInput
      .split(',')
      .map(Number)
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);
    setArray(parsed);
    resetSearch();
  };

  const resetSearch = () => {
    setSteps([]);
    setCurrentStepIndex(0);
    setFoundIndex(null);
    setSearching(false);
  };

  const performSearch = () => {
  const tgt = Number(target);
  if (isNaN(tgt) || array.length === 0) return;

  const recordedSteps = [];
  let low = 0;
  let high = array.length - 1;
  let resultIndex = -1;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    recordedSteps.push({ low, mid, high });

    if (array[mid] === tgt) {
      resultIndex = mid;
      high = mid - 1; // keep searching left for first occurrence
    } else if (array[mid] < tgt) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  if (resultIndex !== -1) {
    recordedSteps.push({ found: resultIndex });
  } else {
    recordedSteps.push({ notFound: true });
  }

  setSteps(recordedSteps);
  setCurrentStepIndex(0);
  setFoundIndex(null);
  setSearching(true);
  stepThrough(recordedSteps);
};


  const stepThrough = (steps) => {
  let index = 0;
  const interval = setInterval(() => {
    setCurrentStepIndex(index);

    if (steps[index]?.found !== undefined) {
      setFoundIndex(steps[index].found);
      clearInterval(interval);
      setSearching(false);
    } else if (steps[index]?.notFound) {
      setFoundIndex(null);
      clearInterval(interval);
      setSearching(false);
    }

    index++;
    if (index >= steps.length) {
      clearInterval(interval);
      setSearching(false);
    }
  }, 1000);
};


  const current = steps[currentStepIndex] || {};

  return (
    <div className="app-container">
      <div className="title">Binary Search Visualizer</div>

      <div className="mode-toggle">
        <label>
          <input
            type="radio"
            name="mode"
            value="auto"
            checked={mode === 'auto'}
            onChange={() => setMode('auto')}
          />
          Auto Generate
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="manual"
            checked={mode === 'manual'}
            onChange={() => setMode('manual')}
          />
          Manual Input
        </label>
      </div>

      {mode === 'manual' && (
        <div className="manual-input">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Enter numbers (e.g. 5,10,3)"
          />
          <button onClick={handleManualInput}>Set Array</button>
        </div>
      )}

      {mode === 'auto' && (
        <button onClick={generateArray}>Generate Sorted Array</button>
      )}

      <div className="search-section">
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Target"
        />
        <button onClick={performSearch} disabled={searching}>
          Search
        </button>
      </div>

      <div className="array-container">
        {array.map((num, idx) => {
          let className = 'array-item';
          if (idx === current.low) className += ' low';
          if (idx === current.mid) className += ' mid';
          if (idx === current.high) className += ' high';
          if (idx === foundIndex) className += ' found';
          return (
            <div key={idx} className={className}>
              {num}
              <div className="index-label">{idx}</div>
            </div>
          );
        })}
      </div>

      {searching && current.low !== undefined && (
        <div className="step-info">
          🔍 Step {currentStepIndex + 1} - Low: {current.low}, Mid: {current.mid}, High: {current.high}
        </div>
      )}

      {foundIndex !== null && (
  <div className="result-info">
    🎯 Target found at index {foundIndex}
  </div>
)}

{!searching && steps.length > 0 && foundIndex === null && steps[steps.length - 1]?.notFound && (
  <div className="result-info" style={{ color: 'red' }}>
    ❌ Target not found in the array
  </div>
)}

    </div>
  );
}

export default App;
