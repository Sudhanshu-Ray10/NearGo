import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { sendMessage, subscribeToChat, markMessagesAsRead } from '../../services/chatService';
import { useAuth } from '../../hooks/useAuth';
import { Loader2, Send } from 'lucide-react';

const ChatWindow = ({ conversation }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); // Initial load
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!conversation?.id || !user) return;

    setLoading(true);
    // Subscribe to real-time messages
    const unsubscribe = subscribeToChat(conversation.id, (newMessages) => {
        setMessages(newMessages);
        setLoading(false);
        
        // Mark as read when new messages arrive
        markMessagesAsRead(conversation.id, user.uid);
    });

    return () => unsubscribe();
  }, [conversation?.id, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !user || !conversation?.id) return;

    try {
        const text = message;
        setMessage(''); // Clear input immediately
        await sendMessage(conversation.id, user.uid, text);
    } catch (error) {
        console.error("Failed to send message", error);
        alert("Failed to send message");
    }
  };

  if (!conversation) {
      return (
          <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg items-center justify-center text-gray-400">
              <p>Select a conversation to start chatting</p>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-semibold">{conversation.itemTitle || 'Chat'}</h2>
        <p className="text-sm text-blue-100">Talking with {conversation.participants.length > 2 ? 'Group' : 'Seller/Buyer'}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {loading ? (
             <div className="flex justify-center pt-10"><Loader2 className="animate-spin text-blue-500" /></div>
        ) : messages.length === 0 ? (
            <p className="text-center text-gray-400 mt-10">No messages yet. Say hi! 👋</p>
        ) : (
            messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} currentUserId={user?.uid} />
            ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
