import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryFilter from '../components/filters/CategoryFilter';
import PriceFilter from '../components/filters/PriceFilter';
import DistanceFilter from '../components/filters/DistanceFilter';
import ItemGrid from '../components/items/ItemGrid';
import ItemsMap from '../components/items/ItemsMap'; // Import Map
import { useNearbyItems } from '../hooks/useNearbyItems';
import { Map, Grid } from 'lucide-react'; // Import Icons

const ItemPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [maxDistance, setMaxDistance] = useState(10); // Default 10km
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  const { items, loading, error } = useNearbyItems();
  
  // ADD: Search Param Logic
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // Scroll to top on mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sync Category with Search Query if it matches
  React.useEffect(() => {
    if (searchQuery) {
        const categoryMap = {
            'mobiles': 'Mobiles',
            'furniture': 'Furniture',
            'bikes': 'Bikes',
            'electronics': 'Electronics',
            'books': 'Books',
            'fashion': 'Fashion',
            'gaming': 'Gaming',
            'services': 'Services',
            'sports': 'Sports',
            'cars': 'Cars',
            'properties': 'Properties',
            'computers': 'Computers',
            'appliances': 'Appliances'
        };

        if (categoryMap[searchQuery.toLowerCase()]) {
            setSelectedCategory(categoryMap[searchQuery.toLowerCase()]);
        }
    }
  }, [searchQuery]);

  const handlePriceChange = (type, value) => {
    if (type === 'min') setMinPrice(value);
    else setMaxPrice(value);
  };

  const filteredItems = items.filter(item => {
    // 1. Search Filter (Global) - ONLY apply if we didn't turn it into a Category selection
    
    // Check if current search query matches the selected category (meaning it was a category nav)
    const isCategoryNav = selectedCategory !== 'All' && 
                          selectedCategory.toLowerCase() === searchQuery.toLowerCase();

    if (searchQuery && !isCategoryNav) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        
        if (!matchTitle && !matchDesc && !matchCat) return false;
    }

    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (minPrice && item.price < Number(minPrice)) return false;
    if (maxPrice && item.price > Number(maxPrice)) return false;
    if (item.distance !== null && item.distance > Number(maxDistance)) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Browse Items</h1>
        
        {/* Toggle Grid / Map */}
        <div className="bg-gray-100 p-1 rounded-lg flex gap-1 mt-4 md:mt-0 dark:bg-slate-800">
            <button 
                onClick={() => setViewMode('grid')} 
                className={`p-2 rounded-md flex items-center gap-2 transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600 font-semibold dark:bg-slate-700 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            >
               <Grid size={18} /> <span className="text-sm">Grid</span>
            </button>
            <button 
                onClick={() => setViewMode('map')} 
                className={`p-2 rounded-md flex items-center gap-2 transition-all ${viewMode === 'map' ? 'bg-white shadow-sm text-blue-600 font-semibold dark:bg-slate-700 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            >
               <Map size={18} /> <span className="text-sm">Map</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar - Hide on Map Mode mostly? OR keep it? Keep it. */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow sticky top-4 dark:bg-slate-800 dark:shadow-none dark:border dark:border-slate-700">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Filters</h2>
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

        {/* Items Grid or Map */}
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
            <>
                <p className="mb-4 text-gray-500 font-medium dark:text-gray-400">Found {filteredItems.length} items nearby</p>
                {viewMode === 'grid' ? (
                    <ItemGrid items={filteredItems} />
                ) : (
                    <ItemsMap items={filteredItems} />
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
