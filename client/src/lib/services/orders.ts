import api from '../api';

// Types
export interface OrderItem {
  name: string;
  description?: string;
  quantity: number;
  price: number;
  category: 'appetizer' | 'main' | 'dessert' | 'beverage' | 'side';
  dietaryInfo?: ('vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'nut-free' | 'halal' | 'kosher')[];
  customization?: {
    size?: string;
    selections?: Array<{
      name: string;
      price: number;
      additions?: Array<{
        item: {
          name: string;
          price: number;
        };
        quantity: number;
      }>;
    }>;
    sandwiches?: Array<{
      name: string;
      count: number;
    }>;
    allAdditions?: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    additions?: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  };
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  deliveryDate: string;
  deliveryTime: string;
  deliveryAddress: DeliveryAddress;
  specialInstructions?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: OrderItem[];
  deliveryDate: string;
  deliveryTime: string;
  deliveryAddress: DeliveryAddress;
  specialInstructions?: string;
  paymentIntentId?: string;
}

export interface UpdateOrderData extends Partial<CreateOrderData> {
  status?: Order['status'];
  paymentStatus?: Order['paymentStatus'];
}

export interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface OrderResponse {
  success: boolean;
  data: {
    order: Order;
  };
}

// Order service functions
export const orderService = {
  // Get all orders
  getOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<OrdersResponse> => {
    try {
      const response = await api.get('/orders', { params });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch orders' };
    }
  },

  // Get single order
  getOrder: async (id: string): Promise<OrderResponse> => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch order' };
    }
  },

  // Create new order
  createOrder: async (orderData: CreateOrderData): Promise<OrderResponse> => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to create order' };
    }
  },

  // Update order
  updateOrder: async (id: string, orderData: UpdateOrderData): Promise<OrderResponse> => {
    try {
      const response = await api.put(`/orders/${id}`, orderData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to update order' };
    }
  },

  // Cancel order
  cancelOrder: async (id: string): Promise<{ success: boolean; message: string; data: { order: Order } }> => {
    try {
      const response = await api.put(`/orders/${id}/cancel`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to cancel order' };
    }
  },

  // Calculate order total
  calculateTotal: (items: OrderItem[]): number => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  // Format order status for display
  formatStatus: (status: Order['status']): string => {
    const statusMap = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      ready: 'Ready',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return statusMap[status] || status;
  },

  // Get status color for UI
  getStatusColor: (status: Order['status']): string => {
    const colorMap = {
      pending: 'text-yellow-600 bg-yellow-100',
      confirmed: 'text-blue-600 bg-blue-100',
      preparing: 'text-orange-600 bg-orange-100',
      ready: 'text-purple-600 bg-purple-100',
      delivered: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100'
    };
    return colorMap[status] || 'text-gray-600 bg-gray-100';
  }
};
