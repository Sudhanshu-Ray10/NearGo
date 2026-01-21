import React, { useState, useEffect } from 'react';
import { Bell, ShoppingBag, Tag, MessageSquare, Info, Check, X, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { subscribeToNotifications, updateNotification, markAllNotificationsAsRead } from '../services/notificationService';
import { updateRequestStatus } from '../services/requestService';

const ICON_MAP = {
    'ShoppingBag': ShoppingBag,
    'Tag': Tag,
    'MessageSquare': MessageSquare,
    'Info': Info,
    'REQUEST_RECEIVED': Bell,
    'REQUEST_ACCEPTED': Check,
    'REQUEST_REJECTED': X
};

const Notifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToNotifications(user.uid, (data) => {
            setNotifications(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleMarkAllRead = async () => {
        await markAllNotificationsAsRead(notifications);
    };

    const handleAction = async (notification, status) => {
        if (!notification.requestId) return;
        
        setActionLoading(notification.id);
        try {
            await updateRequestStatus(notification.requestId, status);
            
            // Mark notification as having action taken so buttons disappear persistently
            await updateNotification(notification.id, {
                actionTaken: true,
                actionResult: status,
                read: true
            });
            
        } catch (error) {
            console.error("Action failed", error);
            alert("Failed to update status.");
        } finally {
            setActionLoading(null);
        }
    };

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-xl font-bold text-gray-700">Please login to view notifications</h2>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Notifications</h1>
                {notifications.some(n => !n.read) && (
                    <button 
                        onClick={handleMarkAllRead}
                        className="text-sm text-blue-600 font-medium hover:underline"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {loading ? (
                <div className="text-center py-10">Loading notifications...</div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                    <Bell className="mx-auto text-gray-300 mb-3" size={48} />
                    <p className="text-gray-500">No notifications yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notif) => {
                        const IconComponent = ICON_MAP[notif.type] || ICON_MAP[notif.icon] || Info;
                        const isRequest = notif.type === 'REQUEST_RECEIVED';
                        
                        // Determine background color based on type/status
                        let bgColor = 'bg-white';
                        if (!notif.read) bgColor = 'bg-blue-50/50';

                        return (
                            <div key={notif.id} className={`${bgColor} p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-shadow`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${notif.color || 'bg-blue-100 text-blue-600'}`}>
                                    <IconComponent size={20} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{notif.title || 'New Notification'}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                                    
                                    {/* Action Buttons for Requests */}
                                    {isRequest && !notif.actionTaken && (
                                        <div className="flex gap-2 mt-3">
                                            <button 
                                                onClick={() => handleAction(notif, 'accepted')}
                                                disabled={actionLoading === notif.id}
                                                className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                                            >
                                                {actionLoading === notif.id ? <Loader2 className="animate-spin" size={12}/> : <Check size={12} />} 
                                                Accept
                                            </button>
                                            <button 
                                                onClick={() => handleAction(notif, 'rejected')}
                                                disabled={actionLoading === notif.id}
                                                className="px-3 py-1.5 bg-red-100 text-red-600 text-xs font-bold rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
                                            >
                                                <X size={12} /> Decline
                                            </button>
                                        </div>
                                    )}

                                    {/* Result Message if Action Taken */}
                                    {isRequest && notif.actionTaken && (
                                        <div className="mt-2 text-xs font-bold uppercase tracking-wide">
                                            {notif.actionResult === 'accepted' ? (
                                                <span className="text-green-600 flex items-center gap-1"><Check size={14}/> Request Accepted</span>
                                            ) : (
                                                <span className="text-red-500 flex items-center gap-1"><X size={14}/> Request Declined</span>
                                            )}
                                        </div>
                                    )}

                                    <p className="text-xs text-gray-400 mt-2">
                                        {notif.createdAt?.seconds ? new Date(notif.createdAt.seconds * 1000).toLocaleString() : 'Just now'}
                                    </p>
                                </div>
                                {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" title="Unread"></div>}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Notifications;
