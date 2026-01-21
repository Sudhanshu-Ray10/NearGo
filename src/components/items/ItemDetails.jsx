import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthModal } from '../../context/AuthModalContext';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2, MapPin, Calendar } from 'lucide-react';
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto border border-gray-100">
        <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-1/2 h-96 bg-gray-100 relative">
                 <img
                    src={item.image || 'https://via.placeholder.com/800x400'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content Section */}
            <div className="md:w-1/2 p-8 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                             <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider rounded-full mb-2">
                                {item.category || 'Item'}
                             </span>
                             <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">{item.title}</h1>
                        </div>
                        <p className="text-3xl font-bold text-blue-600">₹{item.price}</p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                        <div className="flex items-center gap-1">
                            <MapPin size={16} />
                            <span>{distance} km away</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>{item.postedDate ? new Date(item.postedDate).toLocaleDateString() : 'Recently'}</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{item.description}</p>
                    </div>

                    {item.sellerName && (
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-6">
                             <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                {item.sellerName.charAt(0).toUpperCase()}
                             </div>
                             <div>
                                 <p className="text-sm text-gray-500 font-medium">Seller</p>
                                 <p className="font-bold text-gray-900">{item.sellerName}</p>
                             </div>
                        </div>
                    )}
                </div>

                <div>
                    {user && user.uid === item.sellerId ? (
                        <div className="w-full bg-gray-100 text-gray-500 py-3 rounded-xl font-bold text-center border-2 border-dashed border-gray-200">
                            You listed this item
                        </div>
                    ) : (
                        <button
                            onClick={handleRequest}
                            disabled={hasRequested || sendingRequest}
                            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] ${
                                hasRequested 
                                ? "bg-green-100 text-green-700 cursor-not-allowed border border-green-200"
                                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200"
                            }`}
                        >
                            {sendingRequest ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin" size={20} /> Sending...
                                </span>
                            ) : hasRequested ? (
                                "Request Sent ✓"
                            ) : (
                                user ? 'Request to Buy' : 'Login to Buy'
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
