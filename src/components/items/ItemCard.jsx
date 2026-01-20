import React from 'react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={item.image || 'https://via.placeholder.com/300'}
        alt={item.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">${item.price}</span>
          <span className="text-sm text-gray-500">{item.distance} km away</span>
        </div>
        <Link
          to={`/items/${item.id}`}
          className="mt-3 block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;
