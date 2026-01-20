import React from 'react';
import { Bell, ShoppingBag, Tag, MessageSquare } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    {
        id: 1,
        type: 'order',
        title: 'Order Delivered',
        message: 'Your order #NB12345678 containing "Premium Office Chair" has been delivered successfully.',
        time: '2 hours ago',
        icon: ShoppingBag,
        color: 'bg-green-100 text-green-600'
    },
    {
        id: 2,
        type: 'offer',
        title: 'Price Drop Alert!',
        message: 'An item in your wishlist "Sony Headphones" is now available at a lower price.',
        time: '1 day ago',
        icon: Tag,
        color: 'bg-blue-100 text-blue-600'
    },
    {
        id: 3,
        type: 'chat',
        title: 'New Message',
        message: 'Buyer "Rahul" sent you a message regarding "Old Bicycle".',
        time: '2 days ago',
        icon: MessageSquare,
        color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <button className="text-sm text-blue-600 font-medium hover:underline">Mark all as read</button>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
            <div key={notif.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${notif.color}`}>
                    <notif.icon size={20} />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                </div>
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
