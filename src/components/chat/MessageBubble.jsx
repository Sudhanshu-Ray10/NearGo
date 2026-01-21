import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

const MessageBubble = ({ message, currentUserId }) => {
  const isMe = message.senderId === currentUserId;

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
          isMe
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
        }`}
      >
        <p className="text-sm md:text-base leading-relaxed">{message.text}</p>
        
        <div className={`flex items-center gap-1 justify-end mt-1 text-[10px] ${
            isMe ? 'text-blue-100' : 'text-gray-400'
        }`}>
            <span>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            
            {/* Read Receipts for my messages */}
            {isMe && (
                <span className="ml-1">
                    {message.status === 'read' ? (
                        <CheckCheck size={14} className="text-blue-200" /> 
                    ) : (
                        <Check size={14} className="text-blue-200" />
                    )}
                </span>
            )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
