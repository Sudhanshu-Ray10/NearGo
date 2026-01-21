import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthModal } from '../../context/AuthModalContext';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2, MapPin, Calendar, ChevronLeft, ChevronRight, User, MessageCircle } from 'lucide-react';
import { calculateDistance } from '../../utils/calculateDistance';
import { useUserLocation } from '../../context/LocationContext';
import { sendRequest, checkRequestStatus } from '../../services/requestService';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openModal } = useAuthModal();
  const { location: userLocation } = useUserLocation();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasRequested, setHasRequested] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  
  // Carousel State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, 'items', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setItem({ id: docSnap.id, ...docSnap.data() });
          
          if (user) {
              const status = await checkRequestStatus(docSnap.id, user.uid);
              setHasRequested(status);
          }
        } else {
          setError("Item not found");
        }
      } catch (err) {
        console.error("Error fetching item details:", err);
        setError("Failed to load item details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id, user]);

  const handleRequest = async () => {
    if (!user) {
        openModal();
        return;
    }
    
    if (!window.confirm(`Send request to buy ${item.title}?`)) return;

    setSendingRequest(true);
    try {
        await sendRequest(item, user, item.sellerId);
        setHasRequested(true);
        alert("Request sent successfully! The seller will be notified.");
    } catch (error) {
        console.error("Failed to send request", error);
        alert("Failed to send request. Please try again.");
    } finally {
        setSendingRequest(false);
    }
  };

  const nextImage = () => {
      if (!item) return;
      const images = item.images || [item.image];
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
      if (!item) return;
      const images = item.images || [item.image];
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-700">{error || "Item not found"}</h2>
        <button 
            onClick={() => navigate('/items')}
            className="mt-4 text-blue-600 hover:underline"
        >
            Back to Items
        </button>
      </div>
    );
  }

  const distance = userLocation && item.location 
      ? calculateDistance(userLocation.latitude, userLocation.longitude, item.location.latitude, item.location.longitude)
      : 'N/A';
  
  const displayImages = item.images && item.images.length > 0 ? item.images : [item.image || 'https://via.placeholder.com/800x400'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-5xl mx-auto border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* 1. Image Carousel Section */}
            <div className="bg-gray-100 relative group h-[400px] lg:h-full">
                 <img
                    src={displayImages[currentImageIndex]}
                    alt={item.title}
                    className="w-full h-full object-cover transition-opacity duration-300"
                />
                
                {/* Carousel Controls */}
                {displayImages.length > 1 && (
                    <>
                        <button 
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full hover:bg-white text-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-all active:scale-95"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button 
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full hover:bg-white text-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-all active:scale-95"
                        >
                            <ChevronRight size={24} />
                        </button>
                        
                        {/* Dots Indicator */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {displayImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Content Section - Reordered */}
            <div className="p-8 lg:p-12 flex flex-col h-full bg-white">
                
                {/* Title & Category */}
                <div className="mb-6">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                        {item.category || 'Item'}
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">{item.title}</h1>
                </div>

                {/* 2. Time & Location */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <MapPin size={18} className="text-blue-500" />
                        <span className="font-medium text-gray-700">{distance} km away</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <Calendar size={18} className="text-blue-500" />
                        <span className="font-medium text-gray-700">{item.postedDate ? new Date(item.postedDate).toLocaleDateString() : 'Recently'}</span>
                    </div>
                </div>

                {/* 3. Seller Info */}
                {item.sellerName && (
                    <div className="mb-8">
                         <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Seller</h3>
                         <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                                {item.sellerName.charAt(0).toUpperCase()}
                             </div>
                             <div>
                                 <p className="font-bold text-gray-900 text-lg">{item.sellerName}</p>
                                 <p className="text-sm text-gray-500">Verified Seller</p>
                             </div>
                         </div>
                    </div>
                )}

                {/* Description */}
                 <div className="mb-8 flex-grow">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{item.description}</p>
                </div>

                {/* 4. Price & 5. Chat Button */}
                <div className="mt-auto pt-6 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                             <p className="text-sm text-gray-500 font-medium mb-1">Asking Price</p>
                             <p className="text-4xl font-extrabold text-gray-900">₹{item.price}</p>
                        </div>
                        
                        <div className="w-full sm:w-auto">
                            {user && user.uid === item.sellerId ? (
                                <div className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold text-center border-2 border-dashed border-gray-200">
                                    You listed this item
                                </div>
                            ) : (
                                <button
                                    onClick={handleRequest}
                                    disabled={hasRequested || sendingRequest}
                                    className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                                        hasRequested 
                                        ? "bg-green-100 text-green-700 cursor-not-allowed border border-green-200"
                                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/40 hover:-translate-y-0.5"
                                    }`}
                                >
                                    {sendingRequest ? (
                                        <>
                                            <Loader2 className="animate-spin" size={24} /> Sending...
                                        </>
                                    ) : hasRequested ? (
                                        "Request Sent ✓"
                                    ) : (
                                        <>
                                            <MessageCircle size={24} /> Chat with Seller
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
