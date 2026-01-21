import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingCart, Heart, ArrowLeft, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (item) => {
    addToCart(item);
    // Optional: remove from wishlist after adding to cart? User preference generally no.
    alert(`${item.title} added to cart!`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
       {/* Mobile Header with Close Button */}
       <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate('/')} className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <X size={24} />
            </button>
            <h1 className="text-3xl font-bold flex items-center gap-2">
                <Heart className="text-red-500 fill-current" /> My Wishlist
            </h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
          <Heart className="mx-auto text-gray-300 mb-4" size={64} />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save items you love to buy them later.</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Start Browsing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="relative h-48 bg-gray-100">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                  title="Remove from wishlist"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="p-4 flex flex-col flex-1">
                <Link to={`/items/${item.id}`} className="block">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors">{item.title}</h3>
                </Link>
                <p className="text-xl font-bold text-blue-600 mt-1">₹{item.price?.toLocaleString('en-IN')}</p>
                
                <div className="mt-auto pt-4 flex gap-2">
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
