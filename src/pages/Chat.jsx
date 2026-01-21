import React, { useState, useEffect } from 'react';
import ChatWindow from '../components/chat/ChatWindow';
import { useAuth } from '../hooks/useAuth';
import { subscribeToUserChats } from '../services/chatService';
import { MessageCircle, Loader2 } from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUserChats(user.uid, (data) => {
        setChats(data);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
      return (
          <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
              Please login to view your chats.
          </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
       <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MessageCircle className="text-blue-600" /> My Chats
       </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[650px]">
        {/* Chat List (Sidebar) */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-100">
             <h2 className="font-bold text-gray-700">Conversations ({chats.length})</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {loading ? (
                <div className="flex justify-center p-4"><Loader2 className="animate-spin text-blue-500" /></div>
            ) : chats.length === 0 ? (
                <div className="text-center p-8 text-gray-400 text-sm">
                    No active chats. 
                    <br /> Requests accepted by sellers will appear here.
                </div>
            ) : (
                chats.map(chat => (
                    <div 
                        key={chat.id}
                        onClick={() => setSelectedChat(chat)}
                        className={`p-4 rounded-xl cursor-pointer transition-all border ${
                            selectedChat?.id === chat.id 
                            ? 'bg-blue-50 border-blue-200 shadow-sm' 
                            : 'hover:bg-gray-50 border-transparent hover:border-gray-100'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-bold text-gray-800 truncate pr-2">{chat.itemTitle || 'Unknown Item'}</h3>
                            {chat.lastMessageTime && (
                                <span className="text-[10px] text-gray-400 shrink-0">
                                    {new Date(chat.lastMessageTime?.toDate()).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                        <p className={`text-sm truncate ${
                            selectedChat?.id === chat.id ? 'text-blue-600 font-medium' : 'text-gray-500'
                        }`}>
                            {chat.lastMessage || 'No messages yet'}
                        </p>
                    </div>
                ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="md:col-span-2 h-full">
          <ChatWindow conversation={selectedChat} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
