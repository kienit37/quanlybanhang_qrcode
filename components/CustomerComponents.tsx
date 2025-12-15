import React from 'react';
import { MenuItem, CartItem } from '../types';
import { Plus, Minus, ShoppingBag } from 'lucide-react';

export const ProductCard: React.FC<{
  item: MenuItem;
  onAdd: () => void;
}> = ({ item, onAdd }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
    <div className="h-40 w-full relative overflow-hidden">
      <img src={item.image} alt={item.name} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
      {!item.available && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold backdrop-blur-sm">
          Hết món
        </div>
      )}
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-800 line-clamp-1 text-lg">{item.name}</h3>
        <span className="font-bold text-orange-600 shrink-0 ml-2">{item.price.toLocaleString()}đ</span>
      </div>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">{item.description}</p>
      <button
        onClick={onAdd}
        disabled={!item.available}
        className={`w-full py-2.5 rounded-lg flex items-center justify-center font-medium transition-colors ${
          item.available
            ? 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        <Plus size={18} className="mr-2" />
        Thêm vào giỏ
      </button>
    </div>
  </div>
);

export const CartDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: (note: string) => void;
}> = ({ isOpen, onClose, cart, onUpdateQuantity, onCheckout }) => {
  const [note, setNote] = React.useState('');
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Drawer */}
      <div className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-5 border-b bg-orange-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <ShoppingBag className="mr-2 text-orange-600" />
            Giỏ hàng của bạn
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-2">
            Đóng
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-400 mt-20 flex flex-col items-center">
               <ShoppingBag size={64} className="mb-4 opacity-20" />
               <p>Chưa có món nào được chọn</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                  <p className="text-orange-600 font-medium text-sm">{item.price.toLocaleString()}đ</p>
                </div>
                <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-1">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="w-8 h-8 rounded-md bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 flex items-center justify-center shadow-sm transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-semibold text-gray-700 w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="w-8 h-8 rounded-md bg-white text-gray-600 hover:bg-green-50 hover:text-green-600 flex items-center justify-center shadow-sm transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 border-t bg-gray-50 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú cho bếp</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Ít cay, không hành..."
                className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                rows={2}
              />
            </div>
            <div className="flex justify-between items-center text-lg font-bold text-gray-800">
              <span>Tổng cộng:</span>
              <span className="text-orange-600 text-xl">{total.toLocaleString()}đ</span>
            </div>
            <button
              onClick={() => onCheckout(note)}
              className="w-full bg-orange-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:bg-orange-700 active:scale-[0.98] transition-all"
            >
              Đặt món ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
