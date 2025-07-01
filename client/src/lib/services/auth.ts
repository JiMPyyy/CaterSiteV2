import api, { tokenManager } from '../api';

// Types
export interface User {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: string[];
}

// Auth service functions
export const authService = {
  // Register new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      console.log('Auth service: Sending registration request to:', `${process.env.NEXT_PUBLIC_API_URL}/auth/register`);
      console.log('Auth service: Registration data:', {
        ...userData,
        password: '[HIDDEN]',
        confirmPassword: '[HIDDEN]'
      });

      const response = await api.post('/auth/register', userData);

      console.log('Auth service: Registration response:', response.data);

      // Store token
      if (response.data.data.token) {
        tokenManager.set(response.data.data.token);
      }

      return response.data;
    } catch (error: any) {
      console.error('Auth service: Registration error:', error);
      console.error('Auth service: Error response:', error.response?.data);

      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.errors?.[0] ||
                          error.message ||
                          'Registration failed';

      throw { message: errorMessage };
    }
  },

  // Login user
  login: async (credentials: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Store token
      if (response.data.data.token) {
        tokenManager.set(response.data.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // Logout user
  logout: () => {
    tokenManager.remove();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!tokenManager.get();
  },

  // Get current user profile
  getProfile: async (): Promise<{ success: boolean; data: { user: User } }> => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to get profile' };
    }
  },

  // Update user profile
  updateProfile: async (userData: Partial<Pick<User, 'username' | 'email' | 'phone'>>): Promise<{ success: boolean; data: { user: User } }> => {
    try {
      const response = await api.put('/auth/profile', userData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!tokenManager.get();
  }
};
