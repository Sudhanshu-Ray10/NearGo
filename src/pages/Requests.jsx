import React from 'react';
import RequestList from '../components/requests/RequestList';

const Requests = () => {
  // Mock data
  const requests = [
    {
      id: 1,
      itemTitle: 'Vintage Camera',
      buyerName: 'John Doe',
      date: '2023-10-15'
    },
    {
      id: 2,
      itemTitle: 'MacBook Pro',
      buyerName: 'Jane Smith',
      date: '2023-10-14'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Received Requests</h1>
      <div className="max-w-2xl">
        <RequestList requests={requests} />
      </div>
    </div>
  );
};

export default Requests;
