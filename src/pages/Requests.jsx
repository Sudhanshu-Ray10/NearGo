import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getSellerRequests, updateRequestStatus } from '../services/requestService';
import { Loader2, Check, X, Clock, AlertCircle } from 'lucide-react';

const Requests = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        if (user) {
            setLoading(true);
            const data = await getSellerRequests(user.uid);
            setRequests(data);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [user]);

    const handleAction = async (requestId, newStatus) => {
        try {
            // Optimistic update
            setRequests(prev => prev.map(req => 
                req.id === requestId ? { ...req, status: newStatus } : req
            ));

            await updateRequestStatus(requestId, newStatus);
        } catch (error) {
            console.error("Action failed:", error);
            alert("Failed to update status");
            fetchRequests(); // Revert on failure
        }
    };

    if (loading) {
       return (
           <div className="flex justify-center items-center h-[60vh]">
               <Loader2 className="animate-spin text-blue-500" size={40} />
           </div>
       );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Received Requests</h1>
            
            {requests.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">No requests yet</h3>
                    <p className="text-gray-500">When someone wants to buy your items, it will appear here.</p>
                </div>
            ) : (
                <div className="grid gap-4 max-w-3xl mx-auto">
                    {requests.map(request => (
                        <div key={request.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
                            
                            {/* Item Image */}
                            <img 
                                src={request.itemImage || 'https://via.placeholder.com/100'} 
                                alt={request.itemTitle} 
                                className="w-20 h-20 rounded-lg object-cover bg-gray-100"
                            />

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 truncate">{request.itemTitle}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                    <span className="font-medium text-blue-600">₹{request.itemPrice}</span>
                                    <span>•</span>
                                    <span>From {request.buyerName}</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {request.createdAt?.seconds ? new Date(request.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-2">
                                {request.status === 'pending' ? (
                                    <>
                                        <button 
                                            onClick={() => handleAction(request.id, 'accepted')}
                                            className="px-4 py-2 bg-green-50 text-green-700 font-semibold rounded-lg hover:bg-green-100 flex items-center gap-2 transition-colors border border-green-200"
                                        >
                                            <Check size={18} /> Accept
                                        </button>
                                        <button 
                                            onClick={() => handleAction(request.id, 'rejected')}
                                            className="px-4 py-2 bg-red-50 text-red-700 font-semibold rounded-lg hover:bg-red-100 flex items-center gap-2 transition-colors border border-red-200"
                                        >
                                            <X size={18} /> Reject
                                        </button>
                                    </>
                                ) : (
                                    <div className={`px-4 py-2 rounded-lg font-semibold border flex items-center gap-2 ${
                                        request.status === 'accepted' 
                                            ? 'bg-green-50 text-green-700 border-green-200' 
                                            : 'bg-red-50 text-red-700 border-red-200'
                                    }`}>
                                        {request.status === 'accepted' ? <Check size={18} /> : <X size={18} />}
                                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Requests;
