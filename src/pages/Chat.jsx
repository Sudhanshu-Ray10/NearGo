import React from 'react';
import ChatWindow from '../components/chat/ChatWindow';

const Chat = () => {
  // Mock conversation
  const activeConversation = {
    id: 1,
    name: 'John Doe',
    messages: [
      { id: 1, text: 'Is this still available?', sender: 'other', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: 2, text: 'Yes, it is!', sender: 'me', timestamp: new Date(Date.now() - 3500000).toISOString() }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chat List (Sidebar) */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Conversations</h2>
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 rounded cursor-pointer hover:bg-blue-100">
              <h3 className="font-semibold">John Doe</h3>
              <p className="text-sm text-gray-600 truncate">Is this still available?</p>
            </div>
            {/* More conversation items */}
          </div>
        </div>

        {/* Chat Window */}
        <div className="md:col-span-2">
          <ChatWindow conversation={activeConversation} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
