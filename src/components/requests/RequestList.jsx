import React from 'react';

const RequestList = ({ requests }) => {
  if (!requests || requests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No requests yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div key={request.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{request.itemTitle}</h3>
              <p className="text-sm text-gray-600">From: {request.buyerName}</p>
              <p className="text-sm text-gray-500">{request.date}</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Accept
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Decline
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestList;
