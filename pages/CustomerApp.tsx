import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ProductCard, CartDrawer } from '../components/CustomerComponents';
import { CartItem } from '../types';
import { Search, ShoppingCart, Utensils, Coffee, IceCream, ChefHat, Check, UserCircle2, ArrowRight } from 'lucide-react';

const CustomerApp: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();
  const { menu, addOrder, tables } = useAppContext();
  
  const [activeCategory, setActiveCategory] = useState<'all' | 'food' | 'drink' | 'dessert'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);
  
  // Customer Info State
  const [customerName, setCustomerName] = useState('');
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);

  // Validate Table ID and Check Session Name
  useEffect(() => {
    if (!tableId || !tables.includes(tableId)) {
        console.warn("Invalid table ID accessed");
    }

    const savedName = sessionStorage.getItem(`customer_name_${tableId}`);
    if (savedName) {
        setCustomerName(savedName);
        setShowWelcomeScreen(false);
    }
  }, [tableId, tables]);

  const handleStartOrdering = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerName.trim()) {
        sessionStorage.setItem(`customer_name_${tableId}`, customerName.trim());
        setShowWelcomeScreen(false);
    }
  };

  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menu, activeCategory, searchQuery]);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    
    setAddSuccess(item.name);
    setTimeout(() => setAddSuccess(null), 1500);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleCheckout = (note: string) => {
    if (!tableId) return;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // Pass customerName to the order
    addOrder(tableId, cart, total, note, customerName);
    setCart([]);
    setIsCartOpen(false);
    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 3000);
  };

  const categories = [
    { id: 'all', label: 'Tất cả', icon: ChefHat },
    { id: 'food', label: 'Món ăn', icon: Utensils },
    { id: 'drink', label: 'Đồ uống', icon: Coffee },
    { id: 'dessert', label: 'Tráng miệng', icon: IceCream },
  ];

  if (showWelcomeScreen) {
    return (
        <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center flex items-center justify-center p-4 relative">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in duration-300 relative z-10 border border-white/20">
                <div className="text-center mb-8">
                    <div className="inline-block bg-orange-100 text-orange-600 p-4 rounded-full mb-4 shadow-inner">
                        <UserCircle2 size={48} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-800 mb-2">Xin chào!</h1>
                    <p className="text-gray-600">Vui lòng nhập tên của bạn để nhà bếp tiện xưng hô và phục vụ chu đáo hơn.</p>
                </div>
                
                <form onSubmit={handleStartOrdering}>
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Tên của bạn</label>
                        <input 
                            type="text" 
                            required
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all text-lg"
                            placeholder="Ví dụ: Anh Nam, Chị Lan..."
                            autoFocus
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-orange-600/30 hover:bg-orange-700 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center group"
                    >
                        Bắt đầu gọi món
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white sticky top-0 z-30 shadow-md border-b border-gray-100/50 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
                <div className="flex items-center gap-4">
                    <div className="bg-orange-600 p-2 rounded-lg text-white">
                         <ChefHat size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-gray-800 tracking-tight leading-none">Food<span className="text-orange-600">Order</span></h1>
                        <div className="flex items-center text-sm mt-1 gap-2">
                            <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-xs">{customerName}</span>
                            <span className="text-gray-300">|</span>
                            <span className="text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded text-xs border border-orange-100">Bàn {tableId}</span>
                        </div>
                    </div>
                </div>

                {/* Desktop Categories (Visible on md+) */}
                <div className="hidden md:flex items-center space-x-2 bg-gray-100/50 p-1.5 rounded-full">
                     {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id as any)}
                                className={`flex items-center space-x-2 px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${
                                    isActive 
                                    ? 'bg-white text-gray-900 shadow-sm transform scale-105' 
                                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
                                }`}
                            >
                                <Icon size={16} />
                                <span>{cat.label}</span>
                            </button>
                        )
                    })}
                </div>

                <button 
                    onClick={() => setIsCartOpen(true)}
                    className="relative group p-2 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-full transition-all ml-2"
                >
                    <div className="bg-gray-100 p-2 rounded-full group-hover:bg-white border border-transparent group-hover:border-orange-200 transition-all">
                        <ShoppingCart size={24} />
                    </div>
                    {cart.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce">
                        {cart.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                    )}
                </button>
            </div>
            
            {/* Mobile Categories (Scrollable) */}
            <div className="md:hidden pb-3 flex overflow-x-auto gap-2 no-scrollbar -mx-4 px-4">
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id as any)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all border ${
                                isActive 
                                ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                                : 'bg-white text-gray-600 border-gray-200'
                            }`}
                        >
                            <Icon size={16} />
                            <span>{cat.label}</span>
                        </button>
                    )
                })}
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Search & Filter Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
             <h2 className="text-2xl font-bold text-gray-800 self-start sm:self-center">
                {activeCategory === 'all' ? 'Thực đơn hôm nay' : categories.find(c => c.id === activeCategory)?.label}
             </h2>
             
             <div className="relative w-full sm:w-96 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Tìm món ngon..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none shadow-sm transition-all hover:border-gray-300"
                />
            </div>
        </div>

        {/* Menu Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {filteredMenu.map(item => (
            <div key={item.id} className="h-full transform hover:-translate-y-1 transition-transform duration-300">
              <ProductCard item={item} onAdd={() => addToCart(item)} />
            </div>
          ))}
        </div>
        
        {filteredMenu.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                    <Utensils className="text-gray-300" size={48} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Không tìm thấy món ăn</h3>
                <p className="text-gray-500">Thử tìm kiếm với từ khóa khác xem sao nhé.</p>
            </div>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckout}
      />

      {/* Added to Cart Toast Notification */}
      {addSuccess && (
        <div className="fixed bottom-6 right-6 md:right-10 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-4 animate-in slide-in-from-bottom-10 fade-in duration-300 min-w-[300px] border border-gray-700">
            <div className="bg-green-500 rounded-full p-1.5 shadow-lg shadow-green-500/30">
                <Check size={18} className="text-white" strokeWidth={4} />
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-base">Đã thêm vào giỏ</span>
                <span className="text-sm text-gray-300 line-clamp-1">{addSuccess}</span>
            </div>
        </div>
      )}

      {/* Order Success Notification */}
      {orderSuccess && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600 text-white px-10 py-8 rounded-3xl shadow-2xl z-50 flex flex-col items-center animate-in zoom-in duration-300 text-center max-w-sm w-full mx-4">
          <div className="bg-white text-green-600 rounded-full p-4 mb-4 shadow-lg">
             <ChefHat size={48} />
          </div>
          <h3 className="text-2xl font-black mb-2">Đặt món thành công!</h3>
          <p className="text-green-100 text-lg leading-relaxed">Bếp đã nhận đơn.<br/>Chúc bạn ngon miệng!</p>
          <button onClick={() => setOrderSuccess(false)} className="mt-6 bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full">
            Đóng
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerApp;