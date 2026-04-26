import { useState, useEffect } from 'react';

const MAX_RECENT_ITEMS = 10;
const STORAGE_KEY = 'nearbuy_recent_items';

export const useRecentlyViewed = () => {
  const [recentItems, setRecentItems] = useState([]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading recent items:", error);
    }
  }, []);

  const addToRecent = (item) => {
    if (!item || !item.id) return;

    setRecentItems(prevItems => {
      // Remove if already exists to move it to the front
      const filtered = prevItems.filter(i => i.id !== item.id);
      
      // Add to front
      const updated = [item, ...filtered].slice(0, MAX_RECENT_ITEMS);
      
      // Save to local storage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving recent items:", error);
      }
      
      return updated;
    });
  };

  const clearRecent = () => {
    setRecentItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { recentItems, addToRecent, clearRecent };
};
