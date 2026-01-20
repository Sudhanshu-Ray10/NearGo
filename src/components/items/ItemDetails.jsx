import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthModal } from '../../context/AuthModalContext';
import { useAuth } from '../../hooks/useAuth';

const ItemDetails = ({ item }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openModal } = useAuthModal();

  const handleRequest = () => {
    if (!user) {
        // Redirect to login if not authenticated
        openModal();
        return;
    }
    
    // Simulate request logic
    if (window.confirm(`Send request for ${item.title}?`)) {
        alert("Request sent successfully! The seller will be notified.");
        // Logic to update DB would go here
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img
        src={item.image || 'https://via.placeholder.com/800x400'}
        alt={item.title}
        className="w-full h-96 object-cover"
      />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
        <p className="text-4xl font-bold text-blue-600 mb-4">₹{item.price}</p>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{item.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Details</h2>
          <ul className="space-y-2">
            <li className="text-gray-700">
              <span className="font-medium">Category:</span> {item.category}
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Distance:</span> {item.distance} km away
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Posted:</span> {item.postedDate}
            </li>
          </ul>
        </div>

        {user && user.uid === item.sellerId ? (
            <div className="bg-gray-100 p-4 rounded text-center text-gray-600">
                You listed this item
            </div>
        ) : (
          <button
            onClick={handleRequest}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
          >
            {user ? 'Request Item' : 'Login to Request'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ItemDetails;
