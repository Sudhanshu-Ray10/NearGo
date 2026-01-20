import React, { useState } from 'react';

const RequestButton = ({ itemId, onRequestSent }) => {
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    setLoading(true);
    try {
      // Call request service
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      onRequestSent && onRequestSent();
      alert('Request sent successfully!');
    } catch (error) {
      console.error('Error sending request:', error);
      alert('Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRequest}
      disabled={loading}
      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
    >
      {loading ? 'Sending...' : 'Send Request'}
    </button>
  );
};

export default RequestButton;
