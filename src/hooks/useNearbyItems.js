import { useState, useEffect } from 'react';
import { useItems } from '../context/ItemContext';
import { useUserLocation } from '../context/LocationContext';
import { calculateDistance } from '../utils/calculateDistance';
import { useAuth } from '../hooks/useAuth'; // Corrected path based on original

export const useNearbyItems = () => {
  const { items, loading: itemsLoading } = useItems();
  const { location, loading: locationLoading } = useUserLocation();
  const { user } = useAuth();
  const [nearbyItems, setNearbyItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (itemsLoading || locationLoading) return;

    if (!location) {
        console.warn("Location not available for filtering. Showing no items.");
        setNearbyItems([]);
        setLoading(false);
        return;
    }



    const itemsWithDistance = items.map(item => {
        if (!item.location || !location) return { ...item, distance: null };
        const dist = calculateDistance(
            location.latitude,
            location.longitude,
            Number(item.location.latitude),
            Number(item.location.longitude)
        );
        return { ...item, distance: dist };
    });

    const filtered = itemsWithDistance.filter(item => {
      // 1. Exclude own items
      if (user && item.sellerId === user.uid) return false;

      // 2. Check for valid item location & NOT Sold
      if (item.isSold) return false;
      if (item.distance === null) return false;

      // 3. Distance Check (Default 50km hard limit for "Nearby", user can filter further in UI)
      return item.distance <= 50;
    });

    // Sort by distance (nearest first)
    filtered.sort((a, b) => a.distance - b.distance);

    setNearbyItems(filtered);
    setLoading(false);
  }, [items, location, itemsLoading, locationLoading, user]);

  return { items: nearbyItems, loading: loading || itemsLoading || locationLoading };
};
