import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

const OrderTable = ({ orders, loading }) => {
  if (loading) return <LoadingSpinner />;

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No orders yet
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="text-left py-3 px-4 font-semibold">Date</th>
            <th className="text-left py-3 px-4 font-semibold">Seed</th>
            <th className="text-left py-3 px-4 font-semibold">Amount</th>
            <th className="text-left py-3 px-4 font-semibold">Ration Card</th>
            <th className="text-left py-3 px-4 font-semibold">Aadhaar</th>
            <th className="text-left py-3 px-4 font-semibold">Language</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{new Date(order.date).toLocaleDateString()}</td>
              <td className="py-3 px-4 font-medium">{order.seedName}</td>
              <td className="py-3 px-4">{order.amount}g</td>
              <td className="py-3 px-4">{order.rationCard}</td>
              <td className="py-3 px-4">{order.aadhaar}</td>
              <td className="py-3 px-4 uppercase">{order.language}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;