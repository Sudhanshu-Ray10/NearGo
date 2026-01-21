import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useUserLocation } from '../../context/LocationContext';
import { calculateDistance } from '../../utils/calculateDistance';

const ItemCard = ({ item }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { location } = useUserLocation();

  const isInWishlistState = isInWishlist(item.id);

  const handleWishlistClick = () => {
    if (isInWishlistState) {
        removeFromWishlist(item.id);
    } else {
        addToWishlist(item);
    }
  };

  const handleAddToCart = () => {
      addToCart(item);
      alert("Added to cart!");
  };

  const distance = location && item.location 
      ? calculateDistance(location.latitude, location.longitude, item.location.latitude, item.location.longitude)
      : 'N/A';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
      <img
        src={item.image || 'https://via.placeholder.com/300'}
        alt={item.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">₹{item.price}</span>
          <span className="text-sm text-gray-500">{distance} km away</span>
        </div>
        
        <div className="flex gap-2 mt-3">
             <button 
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
            >
                <ShoppingCart size={16} />
                Add
            </button>
            <button 
                onClick={handleWishlistClick}
                className={`p-2 rounded border ${isInWishlistState ? 'bg-red-50 border-red-200 text-red-500' : 'bg-gray-50 border-gray-200 text-gray-500'} hover:bg-gray-100`}
            >
                <Heart size={20} fill={isInWishlistState ? "currentColor" : "none"} />
            </button>
        </div>
        <Link
          to={`/items/${item.id}`}
          className="mt-2 block w-full border border-blue-600 text-blue-600 text-center py-2 rounded hover:bg-blue-50"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;
