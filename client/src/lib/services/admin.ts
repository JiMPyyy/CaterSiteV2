import api from '../api';

// Types
export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrder {
  _id: string;
  orderNumber: string;
  userId: {
    _id: string;
    username: string;
    email: string;
    phone?: string;
    isActive: boolean;
  };
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    restaurant: string;
  }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  deliveryDate: string;
  deliveryTime: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  specialInstructions?: string;
  adminNotes?: string;
  paymentStatus: string;
  paymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    banned: number;
  };
  orders: {
    total: number;
    today: number;
    pending: number;
  };
  revenue: {
    total: number;
  };
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalOrders?: number;
  totalUsers?: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const adminService = {
  // Dashboard Stats
  getDashboardStats: async (): Promise<{ success: boolean; data: DashboardStats }> => {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch dashboard stats' };
    }
  },

  // Orders Management
  getAllOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    date?: string;
  }): Promise<{ success: boolean; data: { orders: AdminOrder[]; pagination: PaginationInfo } }> => {
    try {
      const response = await api.get('/admin/orders', { params });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch orders' };
    }
  },

  updateOrderStatus: async (orderId: string, status: string, notes?: string): Promise<{ success: boolean; data: { order: AdminOrder }; message: string }> => {
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, { status, notes });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to update order status' };
    }
  },

  // Users Management
  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'active' | 'banned';
  }): Promise<{ success: boolean; data: { users: AdminUser[]; pagination: PaginationInfo } }> => {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  banUser: async (userId: string, reason?: string): Promise<{ success: boolean; data: { user: AdminUser }; message: string }> => {
    try {
      const response = await api.put(`/admin/users/${userId}/ban`, { reason });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to ban user' };
    }
  },

  unbanUser: async (userId: string): Promise<{ success: boolean; data: { user: AdminUser }; message: string }> => {
    try {
      const response = await api.put(`/admin/users/${userId}/ban`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to unban user' };
    }
  },

  resetUserPassword: async (userId: string, newPassword?: string, sendEmail: boolean = true): Promise<{
    success: boolean;
    message: string;
    data: { newPassword: string; emailSent: boolean }
  }> => {
    try {
      const response = await api.put(`/admin/users/${userId}/reset-password`, {
        newPassword,
        sendEmail
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to reset password' };
    }
  },

  promoteToAdmin: async (userId: string): Promise<{ success: boolean; data: { user: AdminUser }; message: string }> => {
    try {
      const response = await api.put(`/admin/users/${userId}/promote`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to promote user' };
    }
  },

  // Order Cancellation and Refund
  cancelOrderWithRefund: async (orderId: string, params?: {
    reason?: string;
    refundAmount?: number;
    notifyCustomer?: boolean;
  }): Promise<{
    success: boolean;
    data: { order: AdminOrder; refund: any };
    message: string
  }> => {
    try {
      const response = await api.put(`/admin/orders/${orderId}/cancel`, params);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to cancel order' };
    }
  }
};

// Helper functions for status formatting
export const getOrderStatusColor = (status: string): string => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'confirmed': return 'bg-blue-100 text-blue-800';
    case 'preparing': return 'bg-orange-100 text-orange-800';
    case 'ready': return 'bg-purple-100 text-purple-800';
    case 'delivered': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getUserStatusColor = (isActive: boolean): string => {
  return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
