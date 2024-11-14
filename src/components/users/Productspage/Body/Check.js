import React, { useState } from 'react';
import './Check.css';

const Check = () => {
  const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(2000);

  // Handle changes for the minimum value
  const handleMinChange = (event) => {
    const value = Math.min(Number(event.target.value), maxValue - 50);
    setMinValue(value);
  };

  // Handle changes for the maximum value
  const handleMaxChange = (event) => {
    const value = Math.max(Number(event.target.value), minValue + 50);
    setMaxValue(value);
  };

  return (
    <div className="range-slider">
      {/* Track background */}
      <div className="slider-track" style={{ left: `${(minValue / 2000) * 100}%`, width: `${((maxValue - minValue) / 2000) * 100}%` }}></div>

      {/* Min value slider */}
      <input
        type="range"
        min={0}
        max={2000}
        step={50}
        value={minValue}
        onChange={handleMinChange}
        className="thumb thumb--left"
      />

      {/* Max value slider */}
      <input
        type="range"
        min={0}
        max={2000}
        step={50}
        value={maxValue}
        onChange={handleMaxChange}
        className="thumb thumb--right"
      />

      {/* Display the selected range */}
      <div className="slider-values">
        <span>Min: {minValue}</span> - <span>Max: {maxValue}</span>
      </div>
    </div>
  );
};

export default Check;
