export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'food' | 'drink' | 'dessert';
  image: string;
  description: string;
  available: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type OrderStatus = 'pending' | 'cooking' | 'served' | 'paid';

export interface Order {
  id: string;
  tableId: string;
  customerName: string; // Added customer name
  items: CartItem[];
  status: OrderStatus;
  total: number;
  timestamp: number;
  note?: string;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}