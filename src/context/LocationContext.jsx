import React, { createContext, useState, useContext, useEffect } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null); // { latitude, longitude }
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Manual Update: For when user selects a city manually
  const updateLocation = (newLocation) => {
      // newLocation should be { latitude, longitude, name: "City Name" }
      setLocation(newLocation);
      localStorage.setItem('nearbuy_location', JSON.stringify(newLocation));
      localStorage.setItem('nearbuy_manual_override', 'true'); // Flag to prefer this over GPS
  };

  // Reset/Detect: For when user clicks "Detect my location"
  const detectLocation = () => {
      setLoading(true);
      localStorage.removeItem('nearbuy_manual_override'); // Remove override flag
      
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLoc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setLocation(newLoc);
          // Save valid GPS location as fallback
          localStorage.setItem('nearbuy_location', JSON.stringify(newLoc)); 
          setError(null);
          setLoading(false);
        },
        (err) => {
          console.warn("Geolocation failed", err);
          setError("Failed to detect location.");
          setLoading(false);
        }
      );
  };

  const getLocation = () => {
    setLoading(true);
    
    // 1. Check for Manual Override FIRST
    const isManual = localStorage.getItem('nearbuy_manual_override');
    const savedLoc = localStorage.getItem('nearbuy_location');

    if (isManual && savedLoc) {
        try {
            const parsed = JSON.parse(savedLoc);
            setLocation(parsed);
            setLoading(false);
            
            return;
        } catch (e) {
            console.error("Failed to parse saved location", e);
        }
    }

    // 2. If no manual override, try GPS
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      // Fallback to saved if exists (even if not manual)
      if (savedLoc) {
          try {
             setLocation(JSON.parse(savedLoc));
          } catch(e) {}
      }
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLoc = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setLocation(newLoc);
        localStorage.setItem('nearbuy_location', JSON.stringify(newLoc));
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.warn("Geolocation denied/failed. Using saved location or default.", err);
        if (savedLoc) {
            try {
                setLocation(JSON.parse(savedLoc));
                setLoading(false);
                return;
            } catch (e) {}
        }
        
        // Final fallback if nothing exists (Demo: New Delhi)
        const fallback = { latitude: 28.6139, longitude: 77.2090 }; 
        setLocation(fallback);
        localStorage.setItem('nearbuy_location', JSON.stringify(fallback));
        setError(null); 
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, error, loading, getLocation, updateLocation, detectLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useUserLocation = () => {
  return useContext(LocationContext);
};
