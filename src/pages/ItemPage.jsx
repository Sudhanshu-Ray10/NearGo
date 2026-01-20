import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryFilter from '../components/filters/CategoryFilter';
import PriceFilter from '../components/filters/PriceFilter';
import DistanceFilter from '../components/filters/DistanceFilter';
import ItemGrid from '../components/items/ItemGrid';
import { useNearbyItems } from '../hooks/useNearbyItems';

const ItemPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [maxDistance, setMaxDistance] = useState(10); // Default 10km

  const { items, loading, error } = useNearbyItems();
  
  // ADD: Search Param Logic
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const handlePriceChange = (type, value) => {
    if (type === 'min') setMinPrice(value);
    else setMaxPrice(value);
  };

  const filteredItems = items.filter(item => {
    // 1. Search Filter (Global)
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        
        if (!matchTitle && !matchDesc && !matchCat) return false;
    }

    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (minPrice && item.price < Number(minPrice)) return false;
    if (maxPrice && item.price > Number(maxPrice)) return false;
    if (item.distance > maxDistance) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Items</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow sticky top-4">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            <PriceFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              onPriceChange={handlePriceChange}
            />
            <DistanceFilter
              maxDistance={maxDistance}
              onDistanceChange={setMaxDistance}
            />
          </div>
        </div>

        {/* Items Grid */}
        <div className="lg:col-span-3">
          {loading ? (
             <div className="flex justify-center py-12">
               <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
             </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
               <h3 className="text-red-700 font-bold mb-2">Location Error</h3>
               <p className="text-gray-600">{typeof error === 'string' ? error : 'Please enable location access.'}</p>
            </div>
          ) : (
            <ItemGrid items={filteredItems} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
