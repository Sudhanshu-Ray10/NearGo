import { useState, useEffect } from 'react';
import { useUserLocation } from '../context/LocationContext';
import { calculateDistance } from '../utils/calculateDistance';

// Helper to generate random coords near a point
const getRandomCoords = (lat, lng, radiusInKm = 5) => {
  const r = radiusInKm / 111.32; // Rough conversion to degrees
  const u = Math.random();
  const v = Math.random();
  const w = r * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);
  
  // Adjust the x-coordinate for the shrinking of the east-west distances
  const newLat = lat + y;
  const newLng = lng + x / Math.cos(lat * (Math.PI / 180));
  
  return { latitude: newLat, longitude: newLng };
};

const CATEGORIES = ['Electronics', 'Furniture', 'Books', 'Sports', 'Clothing', 'Kitchen', 'Other'];

export const useNearbyItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { location, error: locationError, loading: locationLoading } = useUserLocation();

  useEffect(() => {
    if (locationLoading) return;

    if (locationError) {
      setError(locationError);
      setLoading(false);
      return;
    }

    if (!location) {
      // No location yet (maybe permission denied or prompting)
      // For Demo: We could show items from a default location or nothing.
      // The requirement says: "Users must allow location access"
      // So we show nothing or an error.
      setLoading(false);
      return;
    }

    // Simulate API fetch with Geo-query
    const fetchItems = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Generate mock items around the user
        const mockItems = Array.from({ length: 12 }).map((_, i) => {
          const coords = getRandomCoords(location.latitude, location.longitude, 4.5); // Within 4.5km
          const dist = calculateDistance(
            location.latitude, 
            location.longitude, 
            coords.latitude, 
            coords.longitude
          );

          return {
            id: String(i + 1),
            title: `Used Item ${i + 1}`,
            price: Math.floor(Math.random() * 200) + 10,
            description: 'This is a great item in good condition. Daily use object.',
            category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
            distance: dist,
            latitude: coords.latitude,
            longitude: coords.longitude,
            image: `https://picsum.photos/seed/${i + 1}/300/200`,
            sellerId: `user${i}`,
            postedDate: new Date().toLocaleDateString()
          };
        }).sort((a, b) => a.distance - b.distance);

        setItems(mockItems);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [location, locationError, locationLoading]);

  return { items, loading: loading || locationLoading, error };
};
