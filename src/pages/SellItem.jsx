import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserLocation } from '../context/LocationContext';
import { useItems } from '../context/ItemContext';
import { useAuth } from '../hooks/useAuth';
import { uploadToCloudinary } from '../services/cloudinary';
import { addNotification } from '../services/notificationService';
import { 
    Loader2, MapPin, AlertCircle, X, Camera, Upload, 
    Tag, IndianRupee, FileText, LayoutGrid, Navigation 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SellItem = () => {
  const navigate = useNavigate();
  const { location, error: locationError } = useUserLocation();
  const { addItem } = useItems();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Form Data now holds 'images' array of File objects
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'Electronics',
    description: '',
    address: '',
    pincode: '',
    images: [] // Changed from single image to array
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'images' && files) {
        const newFiles = Array.from(files);
        // Combine with existing images, limiting to, say, 5 max
        const totalImages = [...formData.images, ...newFiles].slice(0, 5);
        
        setFormData(prev => ({ ...prev, images: totalImages }));
        
        // Generate previews
        const newPreviews = totalImages.map(file => URL.createObjectURL(file));
        setImagePreviews(newPreviews);
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const removeImage = (index) => {
      const newImages = formData.images.filter((_, i) => i !== index);
      const newPreviews = imagePreviews.filter((_, i) => i !== index);
      
      setFormData(prev => ({ ...prev, images: newImages }));
      setImagePreviews(newPreviews);
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

    if (formData.images.length === 0) {
        alert("Please upload at least one image.");
        return;
    }

    setLoading(true);
    try {
        // Upload All Images
        const uploadPromises = formData.images.map(file => uploadToCloudinary(file));
        const imageUrls = await Promise.all(uploadPromises);

        const itemData = {
            ...formData,
            images: imageUrls, // Store all URLs
            image: imageUrls[0], // Store first one as main thumbnail for legacy support
            location: location,
            postedDate: new Date().toISOString(),
            sellerId: user.uid,
            sellerName: user.displayName || user.email || 'Anonymous'
        };

        await addItem(itemData);
        
        await addNotification(user.uid, {
            type: 'listing',
            title: 'Item Listed Successfully',
            message: `Your item "${formData.title}" is now live and visible to buyers near you.`,
            icon: 'Tag', 
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
          <div className="container mx-auto px-4 py-8 text-center flex flex-col items-center justify-center min-h-[50vh]">
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl max-w-md shadow-sm">
                  <div className="flex items-center gap-2 font-bold mb-2 text-xl">
                      <AlertCircle /> Location Error
                  </div>
                  <p>{locationError}. You must allow location access to sell items nearby.</p>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Premium Header Background */}
      <div className="bg-slate-900 h-64 sm:h-80 relative overflow-hidden">
          {/* Abstract Background Shapes */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/30 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-600/20 blur-[80px] rounded-full pointer-events-none"></div>
          
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

          <div className="container mx-auto px-4 h-full relative z-10 flex flex-col justify-center pb-20">
               {/* Mobile Close Button */}
                <div className="absolute top-6 left-4 md:hidden">
                    <button onClick={() => navigate('/')} className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors border border-white/10">
                        <X size={24} />
                    </button>
                </div>

              <span className="inline-block px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider w-fit mb-4 backdrop-blur-sm">
                  Marketplace
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
                  Sell an <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Item</span>
              </h1>
              <p className="text-slate-300 text-lg max-w-xl leading-relaxed">
                  Turn your unused items into cash. List in seconds, sell to neighbors.
              </p>
          </div>
      </div>

      {/* Main Content Card */}
      <div className="container mx-auto px-4 -mt-16 relative z-20 max-w-3xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 space-y-8 animate-in slide-in-from-bottom-5 duration-300">
            
            {/* Location Banner */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-4 items-start">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                    <MapPin size={20} />
                </div>
                <div>
                    <h3 className="font-semibold text-blue-900">Posting Location</h3>
                    <p className="text-sm text-blue-700/80 mt-1">
                        Currently detected near: <span className="font-medium bg-blue-100 px-2 py-0.5 rounded text-blue-800">{location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : "Detecting..."}</span>
                    </p>
                    <p className="text-xs text-blue-600/70 mt-2">Visible to buyers within 5 km of this location.</p>
                </div>
            </div>

            {/* Basic Details */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                    <FileText size={20} className="text-blue-600" /> Item Details
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                        <div className="relative group">
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                required
                                placeholder="What are you selling?"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                        <div className="relative group">
                            <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none cursor-pointer"
                            >
                                <option value="Electronics">Electronics</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Books">Books</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Sports">Sports</option>
                                <option value="Kitchen">Kitchen</option>
                                <option value="Computers">Computers</option>
                                <option value="Gaming">Gaming</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Other">Other</option>
                            </select>
                            {/* Custom Arrow */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
                        <div className="relative group">
                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={18} />
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium"
                                required
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium h-32 resize-none"
                            required
                            placeholder="Describe condition, features, age, and reason for selling..."
                        />
                    </div>
                </div>
            </div>

            {/* Address & Contact */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                    <Navigation size={20} className="text-blue-600" /> Location Details
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                     <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Address</label>
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                required
                                placeholder="House No, Street, Area"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                        <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            required
                            placeholder="e.g. 560001"
                        />
                    </div>
                </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-6">
                 <h3 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
                    <Camera size={20} className="text-blue-600" /> Item Photos (Max 5)
                </h3>
                
                {imagePreviews.length === 0 ? (
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-blue-200 rounded-2xl cursor-pointer bg-blue-50/30 hover:bg-blue-50 transition-all group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Upload size={32} />
                            </div>
                            <p className="mb-2 text-lg font-semibold text-gray-700">Click to upload photos</p>
                            <p className="text-sm text-gray-500">Upload up to 5 images</p>
                        </div>
                        <input name="images" type="file" multiple className="hidden" accept="image/*" onChange={handleChange} />
                    </label>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {imagePreviews.map((url, index) => (
                            <div key={index} className="relative rounded-2xl overflow-hidden shadow-sm border border-gray-200 group aspect-square">
                                <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button 
                                        type="button" 
                                        onClick={() => removeImage(index)}
                                        className="bg-white text-red-600 p-2 rounded-full font-bold shadow-lg hover:scale-110 transition-transform"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        {imagePreviews.length < 5 && (
                             <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all aspect-square">
                                <div className="text-gray-400 flex flex-col items-center">
                                    <Upload size={24} />
                                    <span className="text-xs font-semibold mt-1">Add More</span>
                                </div>
                                <input name="images" type="file" multiple className="hidden" accept="image/*" onChange={handleChange} />
                            </label>
                        )}
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={!location || loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                >
                    {loading ? <Loader2 className="animate-spin" size={24} /> : 'Post Your Item'}
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">
                    By posting, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>

        </form>
      </div>
    </div>
  );
};

export default SellItem;
