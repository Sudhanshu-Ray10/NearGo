import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserLocation } from '../context/LocationContext';
import { useItems } from '../context/ItemContext';
import { useAuth } from '../hooks/useAuth';
import { uploadToCloudinary } from '../services/cloudinary';
import { addNotification } from '../services/notificationService';
import { Loader2, MapPin, AlertCircle, X } from 'lucide-react';

const SellItem = () => {
  const navigate = useNavigate();
  const { location, error: locationError } = useUserLocation();
  const { addItem } = useItems();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'Electronics',
    description: '',
    address: '',
    pincode: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image' && files && files[0]) {
        const file = files[0];
        setFormData(prev => ({ ...prev, image: file }));
        setImagePreview(URL.createObjectURL(file));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const removeImage = () => {
      setFormData(prev => ({ ...prev, image: null }));
      setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
        alert("Location is required to sell items. Please enable location access.");
        return;
    }
    
    if (!user) {
        alert("You must be logged in to sell an item.");
        return;
    }

    setLoading(true);
    try {
        let imageUrl = '';
        if (formData.image) {
            imageUrl = await uploadToCloudinary(formData.image);
        } else {
            imageUrl = 'https://via.placeholder.com/300';
        }

        const itemData = {
            ...formData,
            image: imageUrl,
            location: location,
            postedDate: new Date().toISOString(),
            sellerId: user.uid,
            sellerName: user.displayName || user.email || 'Anonymous' // basic seller info
        };

        await addItem(itemData); // This now goes to Firestore
        
        await addNotification(user.uid, {
            type: 'listing',
            title: 'Item Listed Successfully',
            message: `Your item "${formData.title}" is now live and visible to buyers near you.`,
            icon: 'Tag', // Using string identifier, will map in Notification component
            color: 'bg-blue-100 text-blue-600'
        });

        alert('Item listed successfully!');
        navigate('/items');
    } catch (error) {
        console.error("Error listing item:", error);
        alert("Failed to list item. Please try again.");
    } finally {
        setLoading(false);
    }
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
        
        {/* Location Info Banner */}
        <div className="mb-6 bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-sm text-blue-800">
            <MapPin className="flex-shrink-0 mt-0.5" size={18} />
            <div>
                <p className="font-semibold mb-1">Listing Location</p>
                <p className="opacity-90">
                    Your item will be listed at your <strong>current detected location</strong>. 
                </p>
                <p className="opacity-75 text-xs mt-1">
                    (Approx: {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : "Detecting..."})
                </p>
                <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                    <AlertCircle size={12} />
                    Only buyers within 50km of <strong>this spot</strong> will see your item.
                </p>
            </div>
        </div>

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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Address (Saved for reference)</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Street Address"
              />
            </div>
             <div>
              <label className="block text-gray-700 mb-2">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="110001"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Image</label>
            
            {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors relative cursor-pointer">
                    <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/*"
                    />
                    <div className="pointer-events-none">
                        <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Loader2 size={10} className="w-6 h-6 animate-none" /> {/* Using Loader as generic icon replacement if Upload icon missing */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        </div>
                        <p className="font-medium text-gray-900">Click to upload photo</p>
                        <p className="text-sm text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 3MB)</p>
                    </div>
                </div>
            ) : (
                <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                    <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                            type="button" 
                            onClick={removeImage}
                            className="bg-white text-red-600 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 hover:bg-red-50"
                        >
                            <X size={18} /> Remove Image
                        </button>
                    </div>
                </div>
            )}
            
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold flex items-center justify-center gap-2"
            disabled={!location || loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : (
                location ? 'Post Item' : 'Waiting for Location...'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellItem;
