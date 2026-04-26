import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { useUserLocation } from '../../context/LocationContext';

// Fix for default markers in Leaflet with Vite/Webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const RecenterBtn = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.flyTo([lat, lng], map.getZoom());
        }
    }, [lat, lng, map]);
    return null;
};

const ItemsMap = ({ items }) => {
  const { location } = useUserLocation();
  
  // Default to India Center if no location
  const center = location ? [location.latitude, location.longitude] : [20.5937, 78.9629];
  const zoom = location ? 12 : 5;

  return (
    <div className="h-[600px] w-full rounded-2xl overflow-hidden shadow-xl border border-gray-200 z-0">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {location && <RecenterBtn lat={location.latitude} lng={location.longitude} />}

        {/* User Location Marker */}
        {location && (
             <Marker position={[location.latitude, location.longitude]}>
                <Popup>
                    <div className="text-center font-bold">You are here</div>
                </Popup>
            </Marker>
        )}

        {/* Item Markers */}
        {items.map(item => {
            if (!item.location || !item.location.latitude) return null;
            return (
                <Marker 
                    key={item.id} 
                    position={[item.location.latitude, item.location.longitude]}
                >
                    <Popup>
                        <div className="min-w-[150px]">
                            <img src={item.image} alt={item.title} className="w-full h-24 object-cover rounded-lg mb-2"/>
                            <h3 className="font-bold text-sm truncate">{item.title}</h3>
                            <p className="text-blue-600 font-bold">₹{item.price}</p>
                            <Link to={`/items/${item.id}`} className="block mt-2 text-center bg-blue-600 text-white text-xs py-1 rounded">
                                View Details
                            </Link>
                        </div>
                    </Popup>
                </Marker>
            )
        })}
      </MapContainer>
    </div>
  );
};

export default ItemsMap;
