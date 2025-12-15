import React from 'react';
import { Order, OrderStatus } from '../types';
import { CheckCircle, Clock, DollarSign, ChefHat, User } from 'lucide-react';

export const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    cooking: 'bg-blue-100 text-blue-800 border-blue-200',
    served: 'bg-green-100 text-green-800 border-green-200',
    paid: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const labels = {
    pending: 'Chờ xác nhận',
    cooking: 'Đang chế biến',
    served: 'Đã phục vụ',
    paid: 'Đã thanh toán',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]} uppercase tracking-wide`}>
      {labels[status]}
    </span>
  );
};

export const OrderCard: React.FC<{
  order: Order;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}> = ({ order, onUpdateStatus }) => {
  const timeString = new Date(order.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`bg-white rounded-xl p-5 shadow-sm border transition-all ${order.status === 'pending' ? 'border-orange-400 ring-1 ring-orange-200' : 'border-gray-200'}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Bàn {order.tableId}</h3>
          <div className="flex flex-col space-y-1 mt-1">
             <p className="text-gray-500 text-sm flex items-center">
                <Clock size={14} className="mr-1" /> {timeString}
             </p>
             <p className="text-blue-600 text-sm flex items-center font-medium">
                <User size={14} className="mr-1" /> {order.customerName || "Khách lẻ"}
             </p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="space-y-2 mb-4 border-b border-dashed border-gray-200 pb-4">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-gray-800">
              <span className="font-bold mr-2 text-orange-600">{item.quantity}x</span>
              {item.name}
            </span>
            <span className="text-gray-500">{(item.price * item.quantity).toLocaleString()}đ</span>
          </div>
        ))}
        {order.note && (
           <div className="bg-yellow-50 p-2 rounded text-sm text-yellow-800 italic mt-2 border border-yellow-100">
             Note: {order.note}
           </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-gray-600">Tổng tiền</span>
        <span className="font-bold text-xl text-orange-600">{order.total.toLocaleString()}đ</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {order.status === 'pending' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'cooking')}
            className="col-span-2 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center"
          >
            <ChefHat size={16} className="mr-2" />
            Nhận đơn & Nấu
          </button>
        )}
        {order.status === 'cooking' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'served')}
            className="col-span-2 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center"
          >
            <CheckCircle size={16} className="mr-2" />
            Đã phục vụ
          </button>
        )}
        {order.status === 'served' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'paid')}
            className="col-span-2 bg-gray-800 text-white py-2 rounded-lg font-medium hover:bg-gray-900 flex items-center justify-center"
          >
            <DollarSign size={16} className="mr-2" />
            Thanh toán xong
          </button>
        )}
      </div>
    </div>
  );
};