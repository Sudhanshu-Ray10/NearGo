import React from 'react';
import { Package, Truck, CheckCircle } from 'lucide-react';

const Orders = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Mock Order 1 */}
        <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">Delivered</span>
                    <p className="text-sm text-gray-500 mt-2">Order #NB12345678</p>
                    <p className="text-xs text-gray-400">Placed on Jan 15, 2026</p>
                </div>
                <div className="text-right">
                     <span className="text-lg font-bold block">₹12,499</span>
                     <button className="text-blue-600 text-sm font-medium hover:underline mt-1">View Invoice</button>
                </div>
            </div>
            
            <div className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                    {/* Placeholder image */}
                    <Package className="w-full h-full p-4 text-gray-300" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800">Premium Office Chair</h3>
                    <p className="text-sm text-gray-500">Furniture • Qty: 1</p>
                </div>
            </div>
        </div>

        {/* Mock Order 2 */}
        <div className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 w-fit">
                        <Truck size={12} /> On the way
                    </span>
                    <p className="text-sm text-gray-500 mt-2">Order #NB87654321</p>
                    <p className="text-xs text-gray-400">Placed on Jan 18, 2026</p>
                </div>
                 <div className="text-right">
                     <span className="text-lg font-bold block">₹899</span>
                </div>
            </div>
            
             <div className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                    <Package className="w-full h-full p-4 text-gray-300" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800">Wireless Mouse</h3>
                    <p className="text-sm text-gray-500">Electronics • Qty: 1</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Orders;
