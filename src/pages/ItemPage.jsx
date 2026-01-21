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

  // Scroll to top on mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sync Category with Search Query if it matches
  React.useEffect(() => {
    if (searchQuery) {
        // Simple heuristic: if query is a simple word, try setting it as category
        // In a real app, check against validCategories list
        const formatted = searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1).toLowerCase();
        // Assuming "Mobiles", "Furniture" etc. 
        // We might want to just set it if it matches known ones, or keep it as text search
        // For now, let's treat the search param as a potential category trigger
        // The user specifically asked for "filter category that option be automatically opted"
        
        // Let's rely on the CategoryFilter to likely have these options. 
        // We'll set it, but we need to match the case.
        // For now, let's just use the query directly if we want to force it, 
        // OR distinct logic: Only set category if it was explicitly passed as a category intent?
        // But the previous page sends `?search=categoryID`.
        
        // Let's map IDs to display names if needed, or just set raw.
        // The previous code sent IDs like 'mobiles'. The Filter likely expects 'Mobiles'.
        
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
    // If selectedCategory is SET (and not All), we rely on that.
    // But if the user typed "iPhone", we want text search.
    // The previous page sends ?search=mobiles.
    // So if we mapped it to a category, we DON'T do text search on "mobiles" string, 
    // we just use the category filter.
    
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
