import React from 'react';

const DistanceFilter = ({ maxDistance, onDistanceChange }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Distance</h3>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min="1"
          max="50"
          value={maxDistance}
          onChange={(e) => onDistanceChange(e.target.value)}
          className="flex-1"
        />
        <span className="text-gray-700 font-medium w-20">{maxDistance} km</span>
      </div>
    </div>
  );
};

export default DistanceFilter;
