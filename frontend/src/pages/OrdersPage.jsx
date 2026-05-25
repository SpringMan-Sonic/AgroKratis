import React from 'react';
import { useOrders } from '../hooks/useOrders';
import OrderTable from '../components/orders/OrderTable';

const OrdersPage = () => {
  const { orders, loading } = useOrders();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recent Orders</h2>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
          {orders.length} Orders
        </span>
      </div>
      <OrderTable orders={orders} loading={loading} />
    </div>
  );
};

export default OrdersPage;