import React from 'react';

const PriceFilter = ({ minPrice, maxPrice, onPriceChange }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Price Range</h3>
      <div className="flex gap-4 items-center">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Min</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => onPriceChange('min', e.target.value)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="₹0"
          />
        </div>
        <span className="text-gray-500 mt-6">-</span>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Max</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => onPriceChange('max', e.target.value)}
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Any"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
