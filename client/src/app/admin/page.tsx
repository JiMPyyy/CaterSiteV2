'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import AdminOrdersTable from '@/components/admin/AdminOrdersTable';
import AdminUsersTable from '@/components/admin/AdminUsersTable';
import { adminService } from '@/lib/services/admin';

interface DashboardStats {
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

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'users'>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }

    loadDashboardStats();
  }, [isAuthenticated, user, router]);

  const loadDashboardStats = async () => {
    try {
      const response = await adminService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="flex min-h-screen flex-col font-sans items-center justify-center" style={{
        color: 'rgb(15, 15, 15)',
        backgroundColor: 'rgb(255, 255, 255)'
      }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'rgb(15, 15, 15)' }}>Access Denied</h1>
          <p style={{ color: 'rgb(113, 113, 122)' }}>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col font-sans" style={{
        color: 'rgb(15, 15, 15)',
        backgroundColor: 'rgb(255, 255, 255)'
      }}>
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'rgb(15, 15, 15)' }}></div>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: {
    title: string;
    value: number;
    icon: any;
    color: string;
    subtitle?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex min-h-screen flex-col font-sans" style={{
      color: 'rgb(15, 15, 15)',
      backgroundColor: 'rgb(255, 255, 255)'
    }}>
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>Admin Dashboard</h1>
          <p className="mt-2" style={{ color: 'rgb(113, 113, 122)' }}>Manage orders, users, and monitor system performance</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'orders', label: 'Orders', icon: ShoppingCart },
              { id: 'users', label: 'Users', icon: Users }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === id
                    ? 'text-white'
                    : 'hover:bg-gray-100'
                }`}
                style={{
                  backgroundColor: activeTab === id ? 'rgb(15, 15, 15)' : 'transparent',
                  color: activeTab === id ? 'rgb(255, 255, 255)' : 'rgb(113, 113, 122)'
                }}
              >
                <Icon size={20} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={stats.users.total}
                icon={Users}
                color="bg-blue-500"
                subtitle={`${stats.users.active} active, ${stats.users.banned} banned`}
              />
              <StatCard
                title="Total Orders"
                value={stats.orders.total}
                icon={ShoppingCart}
                color="bg-green-500"
                subtitle={`${stats.orders.today} today`}
              />
              <StatCard
                title="Pending Orders"
                value={stats.orders.pending}
                icon={Clock}
                color="bg-yellow-500"
                subtitle="Require attention"
              />
              <StatCard
                title="Total Revenue"
                value={stats.revenue.total}
                icon={DollarSign}
                color="bg-purple-500"
                subtitle="All time"
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('orders')}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <CheckCircle className="text-green-500" size={24} />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Process Orders</p>
                    <p className="text-sm text-gray-600">Update order statuses</p>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <Users className="text-blue-500" size={24} />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Manage Users</p>
                    <p className="text-sm text-gray-600">Ban/unban users</p>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <AlertCircle className="text-orange-500" size={24} />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Reset Passwords</p>
                    <p className="text-sm text-gray-600">Help users with access</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && <AdminOrdersTable />}
        {activeTab === 'users' && <AdminUsersTable />}
      </div>
    </div>
  );
}
