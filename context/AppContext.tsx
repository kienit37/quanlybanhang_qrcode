import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { MenuItem, Order, OrderStatus } from '../types';
import { supabase } from '../services/supabase';

interface AppContextType {
  menu: MenuItem[];
  orders: Order[];
  tables: string[];
  isAdminLoggedIn: boolean;
  newOrderAlert: Order | null;
  addOrder: (tableId: string, items: any[], total: number, note: string, customerName: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  addMenuItem: (item: MenuItem) => Promise<void>;
  updateMenuItem: (item: MenuItem) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
  dismissNewOrderAlert: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Fallback data in case DB is empty or fails
const INITIAL_TABLES = ['1', '2', '3', '4', '5', 'VIP-1', 'VIP-2'];
const ADMIN_PASSWORD = "kien2203@";

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('qr_admin_auth') === 'true';
  });

  const [newOrderAlert, setNewOrderAlert] = useState<Order | null>(null);

  // Ref to track if it's the initial load to avoid alerting specific existing orders
  const isInitialLoad = useRef(true);

  // 1. Fetch Initial Data
  useEffect(() => {
    fetchMenu();
    fetchOrders();

    // 2. Real-time Subscription for Orders
    const ordersChannel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        const newOrder = payload.new as any; // Cast safely

        // Convert DB snake_case to frontend camelCase if needed, 
        // but here we align struct if possible or map it.
        // Let's ensure our DB struct maps to Order type.
        // DB: id, table_id, customer_name, items (json), total, status, timestamp, note
        const formattedOrder: Order = {
          id: newOrder.id,
          tableId: newOrder.table_id,
          customerName: newOrder.customer_name,
          items: newOrder.items,
          total: newOrder.total,
          status: newOrder.status as OrderStatus,
          timestamp: newOrder.timestamp || Date.now(),
          note: newOrder.note
        };

        setOrders((prev) => [formattedOrder, ...prev]);
        setNewOrderAlert(formattedOrder); // Alert for everyone
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
        const updatedOrder = payload.new as any;
        setOrders((prev) => prev.map(o => o.id === updatedOrder.id ? {
          ...o,
          status: updatedOrder.status,
          // Update other fields if necessary
        } : o));
      })
      .subscribe();

    // 3. Real-time Subscription for Menu (Optional but good)
    const menuChannel = supabase
      .channel('public:menu_items')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, () => {
        fetchMenu(); // Re-fetch menu on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(menuChannel);
    };
  }, []);

  const fetchMenu = async () => {
    const { data, error } = await supabase.from('menu_items').select('*').order('created_at', { ascending: true });
    if (!error && data) {
      setMenu(data);
    }
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      // Map DB snake_case to Order type
      const formattedOrders: Order[] = data.map((item: any) => ({
        id: item.id,
        tableId: item.table_id,
        customerName: item.customer_name,
        items: item.items,
        total: item.total,
        status: item.status,
        timestamp: item.timestamp,
        note: item.note
      }));
      setOrders(formattedOrders);
    }
  };

  const addOrder = async (tableId: string, items: any[], total: number, note: string, customerName: string) => {
    const newOrder = {
      id: Date.now().toString(),
      table_id: tableId,
      customer_name: customerName,
      items: items,
      total: total,
      status: 'pending',
      timestamp: Date.now(),
      note: note
    };

    const { error } = await supabase.from('orders').insert([newOrder]);

    if (error) {
      console.error('Error adding order:', error);
      alert('Lỗi đặt món. Vui lòng thử lại!');
    }
    // No need to setOrders here manually if Realtime is working, 
    // but for instant feedback UI we can optimistic update if we want.
    // We'll rely on Realtime "INSERT" event to update local state.
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) console.error('Error updating status:', error);
  };

  const addMenuItem = async (item: MenuItem) => {
    const { error } = await supabase.from('menu_items').insert([item]);
    if (error) {
      console.error('Error adding menu item:', error);
      alert('Lỗi thêm món!');
    }
  };

  const updateMenuItem = async (item: MenuItem) => {
    const { error } = await supabase.from('menu_items').update(item).eq('id', item.id);
    if (error) console.error('Error updating menu:', error);
  };

  const deleteMenuItem = async (id: string) => {
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (error) console.error('Error deleting menu:', error);
  };

  const adminLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('qr_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('qr_admin_auth');
  };

  const dismissNewOrderAlert = () => {
    setNewOrderAlert(null);
  };

  return (
    <AppContext.Provider value={{
      menu,
      orders,
      tables: INITIAL_TABLES,
      isAdminLoggedIn,
      newOrderAlert,
      addOrder,
      updateOrderStatus,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      adminLogin,
      adminLogout,
      dismissNewOrderAlert
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};