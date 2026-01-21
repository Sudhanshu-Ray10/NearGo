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



    const filtered = items.filter(item => {
      // 1. Exclude own items
      if (user && item.sellerId === user.uid) {
          return false;
      }

      // 2. Check for valid item location & NOT Sold
    if (item.isSold) return false;

    if (
  !item.location ||
  item.location.latitude == null ||
  item.location.longitude == null
) {
  return false;
}


      // 3. Distance Check
      const dist = calculateDistance(
          location.latitude,
          location.longitude,
          Number(item.location.latitude),
          Number(item.location.longitude)
      );

      const isNearby = dist <= 50;

      return isNearby;
    });

    setNearbyItems(filtered);
    setLoading(false);
  }, [items, location, itemsLoading, locationLoading, user]);

  return { items: nearbyItems, loading: loading || itemsLoading || locationLoading };
};
