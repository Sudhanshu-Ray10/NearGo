import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, XCircle, Loader2, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom'; // Added
import { getBuyerRequests, markRequestDelivered } from '../services/requestService';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Added
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        const data = await getBuyerRequests(user.uid);
        // Sort manually since we removed orderBy from Firestore
        data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setOrders(data);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleMarkDelivered = async (orderId) => {
    if (!window.confirm("Confirm you have received this item?")) return;
    
    setActionLoading(orderId);
    try {
        await markRequestDelivered(orderId);
        // Update local state
        setOrders(prev => prev.map(o => 
            o.id === orderId ? { ...o, status: 'delivered' } : o
        ));
        alert("Order marked as Delivered!");
    } catch (error) {
        alert("Failed to update order.");
    } finally {
        setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
        case 'delivered':
            return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 w-fit"><CheckCircle size={12}/> Delivered</span>;
        case 'accepted':
            return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 w-fit"><Truck size={12}/> On the way</span>;
        case 'pending':
            return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 w-fit"><Clock size={12}/> Pending Approval</span>;
        case 'rejected':
            return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 w-fit"><XCircle size={12}/> Declined</span>;
        default:
            return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase tracking-wide">{status}</span>;
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/')} className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <X size={24} />
          </button>
          <h1 className="text-3xl font-bold">My Orders</h1>
      </div>
      
      {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
              <Package className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
              <p className="text-gray-500">Items you request will appear here.</p>
          </div>
      ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {orders.map((order) => (
                <div key={order.id} className="p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                        <div>
                            {getStatusBadge(order.status)}
                            <p className="text-sm text-gray-500 mt-2">Order ID: #{order.id.slice(0,8).toUpperCase()}</p>
                            <p className="text-xs text-gray-400">
                                Requested on {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Recent'}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-lg font-bold block">₹{order.itemPrice?.toLocaleString('en-IN') || '0'}</span>
                            
                            {/* Action Button: Only visible if Accepted */}
                            {order.status === 'accepted' && (
                                <button 
                                    onClick={() => handleMarkDelivered(order.id)}
                                    disabled={actionLoading === order.id}
                                    className="mt-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold uppercase rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 ml-auto"
                                >
                                    {actionLoading === order.id ? <Loader2 className="animate-spin" size={12} /> : <CheckCircle size={14} />}
                                    Mark as Delivered
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                            {order.itemImage ? (
                                <img src={order.itemImage} alt={order.itemTitle} className="w-full h-full object-cover" />
                            ) : (
                                <Package className="w-full h-full p-4 text-gray-300" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 text-lg">{order.itemTitle}</h3>
                            <p className="text-sm text-gray-500">Seller: {order.sellerId ? "View Seller" : "Unknown"}</p> (We can fetch seller name if needed later)
                        </div>
                    </div>
                </div>
            ))}
          </div>
      )}
    </div>
  );
};

export default Orders;
