import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { OrderCard, StatusBadge } from '../components/AdminComponents';
import { generateDishDescription } from '../services/geminiService';
import { MenuItem } from '../types';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, Plus, Sparkles, X, Edit, Trash2, TrendingUp, DollarSign, Calendar, Clock, LogOut, History, Lock, User, BellRing } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Components ---

const NotificationToast: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right duration-500">
      <div className="bg-white border-l-4 border-orange-500 shadow-2xl rounded-lg p-4 flex items-start space-x-4 max-w-sm">
        <div className="bg-orange-100 p-2 rounded-full text-orange-600 animate-pulse">
          <BellRing size={24} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-800">Đơn hàng mới!</h4>
          <p className="text-sm text-gray-600 mt-1">Khách vừa đặt món. Vui lòng kiểm tra danh sách.</p>
          <button
            onClick={onDismiss}
            className="mt-3 text-sm font-semibold text-orange-600 hover:text-orange-800"
          >
            Đã hiểu
          </button>
        </div>
        <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// --- Sub-pages ---

const LoginView: React.FC = () => {
  const { adminLogin } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(password)) {
      setError('');
    } else {
      setError('Mật khẩu không chính xác.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-10">
          <div className="inline-block p-4 rounded-2xl bg-blue-50 text-blue-600 mb-6">
            <Lock size={40} />
          </div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">Quản lý bán hàng</h1>
          <p className="text-gray-500">Đăng nhập để quản lý hệ thống</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tài khoản</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="nhập tài khoản"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="nhập mật khẩu"
              />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100 flex items-center"><X size={16} className="mr-2" />{error}</div>}

          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

const OrdersView: React.FC = () => {
  const { orders, updateOrderStatus } = useAppContext();

  // Sort: Pending first, then by time
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const statusPriority = { pending: 0, cooking: 1, served: 2, paid: 3 };
      if (statusPriority[a.status] !== statusPriority[b.status]) {
        return statusPriority[a.status] - statusPriority[b.status];
      }
      return b.timestamp - a.timestamp;
    });
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <ShoppingBag className="mr-3 text-blue-600" />
          Đơn hàng hiện tại
          <span className="ml-3 bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">{orders.filter(o => o.status !== 'paid').length} đang xử lý</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedOrders.filter(o => o.status !== 'paid').length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <ShoppingBag size={48} className="text-gray-300" />
            </div>
            <p className="text-gray-500 text-lg font-medium">Hiện tại không có đơn hàng nào.</p>
            <p className="text-gray-400 text-sm">Đơn hàng mới sẽ xuất hiện tại đây.</p>
          </div>
        ) : (
          sortedOrders.filter(o => o.status !== 'paid').map(order => (
            <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />
          ))
        )}
      </div>
    </div>
  );
};

const HistoryView: React.FC = () => {
  const { orders } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const orderDate = new Date(o.timestamp).toISOString().split('T')[0];
      return o.status === 'paid' && orderDate === selectedDate;
    }).sort((a, b) => b.timestamp - a.timestamp);
  }, [orders, selectedDate]);

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <History className="mr-2 text-green-600" />
          Lịch sử đơn hàng
        </h2>
        <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border shadow-sm">
          <Calendar size={18} className="text-gray-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="outline-none text-gray-700 font-medium"
          />
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-8 text-white shadow-xl flex items-center justify-between">
        <div>
          <p className="text-green-100 font-medium mb-1">Doanh thu ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}</p>
          <h3 className="text-4xl font-black">{totalRevenue.toLocaleString()}đ</h3>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">{filteredOrders.length}</div>
          <p className="text-green-100 text-sm">Đơn hàng đã xong</p>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600 uppercase text-xs tracking-wider">Mã đơn / Bàn</th>
              <th className="px-6 py-4 font-semibold text-gray-600 uppercase text-xs tracking-wider">Thời gian</th>
              <th className="px-6 py-4 font-semibold text-gray-600 uppercase text-xs tracking-wider">Khách hàng</th>
              <th className="px-6 py-4 font-semibold text-gray-600 uppercase text-xs tracking-wider">Chi tiết món</th>
              <th className="px-6 py-4 font-semibold text-gray-600 uppercase text-xs tracking-wider text-right">Tổng tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  Không có dữ liệu cho ngày này.
                </td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800">#{order.id.slice(-6)}</div>
                    <div className="text-sm text-gray-500">Bàn {order.tableId}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 font-mono text-sm">
                    {new Date(order.timestamp).toLocaleTimeString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <span className="flex items-center"><User size={14} className="mr-2 text-gray-400" /> {order.customerName}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm max-w-md truncate">
                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-green-600 text-lg">
                    {order.total.toLocaleString()}đ
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MenuView: React.FC = () => {
  const { menu, addMenuItem, updateMenuItem, deleteMenuItem } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '', price: 0, category: 'food', description: '', image: '', available: true
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const openModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ name: '', price: 0, category: 'food', description: '', image: 'https://picsum.photos/400/300', available: true });
    }
    setIsModalOpen(true);
  };

  const handleGenerateDescription = async () => {
    if (!formData.name) return;
    setIsGenerating(true);
    const desc = await generateDishDescription(formData.name!, '');
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      ...formData
    } as MenuItem;

    if (editingItem) {
      updateMenuItem(item);
    } else {
      addMenuItem(item);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <UtensilsCrossed className="mr-3 text-orange-600" />
          Quản lý thực đơn
        </h2>
        <button
          onClick={() => openModal()}
          className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-black flex items-center transition-all hover:shadow-lg"
        >
          <Plus size={18} className="mr-2" />
          Thêm món mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600 uppercase text-xs tracking-wider">Hình ảnh</th>
              <th className="px-6 py-4 font-semibold text-gray-600 uppercase text-xs tracking-wider">Tên món</th>
              <th className="px-6 py-4 font-semibold text-gray-600 uppercase text-xs tracking-wider">Giá</th>
              <th className="px-6 py-4 font-semibold text-gray-600 uppercase text-xs tracking-wider">Trạng thái</th>
              <th className="px-6 py-4 font-semibold text-gray-600 uppercase text-xs tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {menu.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <img src={item.image} alt="" className="w-16 h-16 rounded-lg object-cover bg-gray-100 border border-gray-200" />
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-800 text-lg">{item.name}</div>
                  <div className="text-sm text-gray-500 max-w-sm truncate">{item.description}</div>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block uppercase">{item.category}</span>
                </td>
                <td className="px-6 py-4 font-bold text-orange-600">{item.price.toLocaleString()}đ</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs rounded-full font-bold ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.available ? 'Còn hàng' : 'Hết hàng'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => openModal(item)} className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-colors"><Edit size={18} /></button>
                  <button onClick={() => deleteMenuItem(item.id)} className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition-colors"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-8 py-5 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-xl text-gray-800">{editingItem ? 'Sửa món ăn' : 'Thêm món mới'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-gray-400 hover:text-gray-800 transition-colors" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tên món</label>
                  <input required type="text" className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="VD: Phở Bò" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Giá (VNĐ)</label>
                  <input required type="number" className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục</label>
                  <select className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all"
                    value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value as any })}>
                    <option value="food">Món ăn</option>
                    <option value="drink">Đồ uống</option>
                    <option value="dessert">Tráng miệng</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Hình ảnh (URL)</label>
                <input type="text" className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700">Mô tả</label>
                  <button type="button" onClick={handleGenerateDescription} disabled={isGenerating || !formData.name}
                    className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full flex items-center hover:bg-purple-200 disabled:opacity-50 transition-colors font-semibold">
                    <Sparkles size={14} className="mr-1" />
                    {isGenerating ? 'Đang viết...' : 'AI Viết mô tả'}
                  </button>
                </div>
                <textarea rows={3} className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Mô tả hấp dẫn về món ăn..." />
              </div>
              <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <input type="checkbox" id="avail" checked={formData.available}
                  onChange={e => setFormData({ ...formData, available: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer" />
                <label htmlFor="avail" className="text-sm text-gray-700 font-bold cursor-pointer">Đang có bán</label>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all hover:shadow-lg">
                Lưu thay đổi
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardView: React.FC = () => {
  const { orders } = useAppContext();

  // Calculate generic stats
  const totalRevenue = orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  // Prepare chart data (Mocking last 7 days from current mock orders if they were real, otherwise random for demo visual)
  const data = [
    { name: 'T2', rev: 1200000 },
    { name: 'T3', rev: 900000 },
    { name: 'T4', rev: 1500000 },
    { name: 'T5', rev: 2100000 },
    { name: 'T6', rev: 1800000 },
    { name: 'T7', rev: 3200000 },
    { name: 'CN', rev: totalRevenue > 0 ? totalRevenue : 2800000 }, // Show current rev in CN for demo
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <LayoutDashboard className="mr-3 text-purple-600" />
          Tổng quan doanh thu
        </h2>
        <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
          Cập nhật: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 font-bold text-sm uppercase tracking-wide">Doanh thu hôm nay</span>
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="text-4xl font-black text-gray-800 mb-2">{totalRevenue.toLocaleString()}đ</div>
          <p className="text-sm text-green-600 font-medium flex items-center"><TrendingUp size={16} className="mr-1" /> +12.5% so với hôm qua</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 font-bold text-sm uppercase tracking-wide">Tổng đơn hàng</span>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <ShoppingBag size={24} />
            </div>
          </div>
          <div className="text-4xl font-black text-gray-800 mb-2">{totalOrders}</div>
          <p className="text-sm text-gray-400 font-medium">Đơn hàng trong ngày</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-gray-500 font-bold text-sm uppercase tracking-wide">Đang chờ xử lý</span>
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <Clock size={24} />
            </div>
          </div>
          <div className="text-4xl font-black text-gray-800 mb-2 relative z-10">{pendingOrders}</div>
          <p className="text-sm text-orange-600 font-bold relative z-10">Cần xử lý ngay</p>
          {pendingOrders > 0 && <div className="absolute -right-4 -bottom-4 bg-orange-500/10 w-32 h-32 rounded-full blur-2xl"></div>}
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-96">
        <h3 className="font-bold text-gray-800 mb-6 flex items-center text-lg"><Calendar size={20} className="mr-2 text-gray-400" /> Biểu đồ doanh thu tuần</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `${val / 1000}k`} tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2937', color: '#fff', borderRadius: '8px', border: 'none' }}
              itemStyle={{ color: '#fff' }}
              formatter={(value: number) => [value.toLocaleString() + 'đ', 'Doanh thu']}
              cursor={{ fill: '#f9fafb' }}
            />
            <Bar dataKey="rev" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={50} activeBar={{ fill: '#4338ca' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const AdminApp: React.FC = () => {
  const { isAdminLoggedIn, adminLogout, newOrderAlert, dismissNewOrderAlert } = useAppContext();
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'dashboard' | 'history'>('orders');

  // Play Sound on New Order
  useEffect(() => {
    if (newOrderAlert) {
      // Simple Beep using AudioContext or simple beep base64
      // Using a short distinct beep data URI for compatibility
      const beep = "data:audio/wav;base64,UklGRl9vT1BXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU";
      const audio = new Audio(beep);
      audio.play().catch(e => console.log("Audio play failed (user interaction needed first)", e));
    }
  }, [newOrderAlert]);

  if (!isAdminLoggedIn) {
    return <LoginView />;
  }

  const navItems = [
    { id: 'orders', label: 'Đơn hàng', icon: ShoppingBag },
    { id: 'menu', label: 'Thực đơn', icon: UtensilsCrossed },
    { id: 'history', label: 'Lịch sử', icon: History },
    { id: 'dashboard', label: 'Báo cáo', icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar / Mobile Nav */}
      <aside className="bg-white border-r border-gray-200 md:w-72 flex-shrink-0 sticky top-0 z-20 flex flex-col h-screen shadow-sm">
        <div className="p-8 border-b border-gray-100 hidden md:block">
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Trang <span className="text-blue-600">Quản Trị</span></h1>
          {/* <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-semibold">Quản lý bán hàng</p> */}
          <p>Phát Triển - <a href="https://kiencode.io.vn/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">kiencode.io.vn</a></p>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b flex justify-between items-center bg-white shadow-sm shrink-0">
          <h1 className="text-xl font-black">Admin<span className="text-blue-600">Portal</span></h1>
          <button onClick={adminLogout} className="text-gray-500 hover:text-red-600"><LogOut size={20} /></button>
        </div>

        <nav className="p-6 md:space-y-3 flex md:flex-col overflow-x-auto md:overflow-visible bg-white flex-grow">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center space-x-4 px-6 py-4 rounded-xl transition-all whitespace-nowrap text-left ${active ? 'bg-blue-50 text-blue-700 font-bold shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
                  }`}
              >
                <Icon size={22} className={active ? "text-blue-600" : "text-gray-400"} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button Desktop */}
        <div className="hidden md:block p-6 border-t border-gray-100">
          <button
            onClick={adminLogout}
            className="flex items-center space-x-3 px-6 py-4 rounded-xl text-red-600 hover:bg-red-50 w-full font-medium transition-colors"
          >
            <LogOut size={22} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto relative bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          {newOrderAlert && <NotificationToast onDismiss={dismissNewOrderAlert} />}
          {activeTab === 'orders' && <OrdersView />}
          {activeTab === 'menu' && <MenuView />}
          {activeTab === 'history' && <HistoryView />}
          {activeTab === 'dashboard' && <DashboardView />}
        </div>
      </main>
    </div>
  );
};

export default AdminApp;