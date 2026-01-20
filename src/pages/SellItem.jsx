import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserLocation } from '../context/LocationContext';

const SellItem = () => {
  const navigate = useNavigate();
  const { location, error: locationError } = useUserLocation();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'Electronics',
    description: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
        alert("Location is required to sell items. Please enable location access.");
        return;
    }
    
    // TODO: Implement item creation logic with Firebase
    const itemData = {
        ...formData,
        location: location,
        postedDate: new Date().toISOString()
    };

    console.log('Form data:', itemData);
    alert('Item listed successfully!');
    navigate('/items');
  };

  if (locationError) {
      return (
          <div className="container mx-auto px-4 py-8 text-center">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Location Error: </strong>
                  <span className="block sm:inline">{locationError}. You must allow location access to sell items.</span>
              </div>
          </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Sell an Item</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g. Scientific Calculator"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Books">Books</option>
                <option value="Clothing">Clothing</option>
                <option value="Sports">Sports</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-blue-200 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Describe the condition, age, and features..."
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                type="file"
                name="image"
                onChange={handleChange}
                className="w-full"
                accept="image/*"
                />
                <p className="text-xs text-gray-500 mt-2">Upload a clear picture of the item</p>
            </div>
          </div>
          
           <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {location ? (
                  <span>Location detected: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</span>
              ) : (
                  <span>Detecting location...</span>
              )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
            disabled={!location}
          >
            {location ? 'Post Item' : 'Waiting for Location...'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellItem;
