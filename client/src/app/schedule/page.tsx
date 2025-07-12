'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Trash2, Clock, X } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import Navigation from '@/components/layout/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { orderService, Order } from '@/lib/services/orders';

interface DateClickModalProps {
  isOpen: boolean;
  selectedDate: string;
  existingOrders: Order[];
  onClose: () => void;
  onCreateOrder: (date: string) => void;
  onDeleteOrder: (orderId: string) => void;
}

const DateClickModal = ({
  isOpen,
  selectedDate,
  existingOrders,
  onClose,
  onCreateOrder,
  onDeleteOrder
}: DateClickModalProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const ordersForDate = existingOrders.filter(order =>
    order.deliveryDate === selectedDate
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-gray-400"
            style={{ color: 'rgb(15, 15, 15)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold">Schedule Actions</h2>
                <p className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                  {formatDate(selectedDate)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'rgb(113, 113, 122)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(82, 82, 91)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(113, 113, 122)'}
              >
                <X size={16} className="text-white" />
              </button>
            </div>

            {/* Create Order Button */}
            <button
              onClick={() => onCreateOrder(selectedDate)}
              className="w-full mb-4 p-4 rounded-xl border-2 border-dashed transition-all duration-200 hover:scale-105"
              style={{
                borderColor: 'rgb(113, 113, 122)',
                backgroundColor: 'rgba(15, 15, 15, 0.02)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(15, 15, 15, 0.05)';
                e.currentTarget.style.borderColor = 'rgb(15, 15, 15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(15, 15, 15, 0.02)';
                e.currentTarget.style.borderColor = 'rgb(113, 113, 122)';
              }}
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgb(15, 15, 15)' }}>
                  <Plus size={20} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Create New Order</div>
                  <div className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                    Place a catering order for this date
                  </div>
                </div>
              </div>
            </button>

            {/* Existing Orders */}
            {ordersForDate.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar size={16} />
                  Existing Orders ({ordersForDate.length})
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {ordersForDate.map((order) => (
                    <div
                      key={order._id}
                      className="p-3 rounded-lg border flex justify-between items-center"
                      style={{
                        backgroundColor: 'rgba(15, 15, 15, 0.02)',
                        borderColor: 'rgb(113, 113, 122)'
                      }}
                    >
                      <div className="flex-1">
                        <div className="font-medium">#{order.orderNumber}</div>
                        <div className="text-sm flex items-center gap-4" style={{ color: 'rgb(113, 113, 122)' }}>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {order.deliveryTime}
                          </span>
                          <span>${order.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="text-xs" style={{ color: 'rgb(113, 113, 122)' }}>
                          {order.items.length} items • {order.status}
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteOrder(order._id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors ml-3"
                        style={{ backgroundColor: 'rgb(239, 68, 68)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(220, 38, 38)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(239, 68, 68)'}
                        title="Cancel Order"
                      >
                        <Trash2 size={14} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {ordersForDate.length === 0 && (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: 'rgba(113, 113, 122, 0.1)' }}>
                  <Calendar size={20} style={{ color: 'rgb(113, 113, 122)' }} />
                </div>
                <p className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                  No orders scheduled for this date
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function SchedulePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  // Fetch orders on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrders();
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (info: any) => {
    setSelectedDate(info.dateStr);
    setShowDateModal(true);
  };

  const handleCreateOrder = (date: string) => {
    setShowDateModal(false);
    // Redirect to order page with prefilled date
    router.push(`/order?date=${date}`);
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await orderService.cancelOrder(orderId);
      // Refresh orders after deletion
      await fetchOrders();
      setShowDateModal(false);
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  // Convert orders to calendar events
  const calendarEvents = orders.map(order => ({
    id: order._id,
    title: `Order #${order.orderNumber}`,
    date: order.deliveryDate,
    backgroundColor: order.status === 'delivered' ? '#10b981' :
                    order.status === 'cancelled' ? '#ef4444' : '#3b82f6',
    borderColor: 'transparent',
    textColor: 'white',
    extendedProps: {
      order: order
    }
  }));

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col font-sans" style={{
        color: 'rgb(15, 15, 15)',
        backgroundColor: 'rgb(255, 255, 255)'
      }}>
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p style={{ color: 'rgb(113, 113, 122)' }}>Please log in to view your schedule.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col font-sans" style={{
      color: 'rgb(15, 15, 15)',
      backgroundColor: 'rgb(255, 255, 255)'
    }}>
      <Navigation />

      {/* Hero Section */}
      <div style={{ backgroundColor: 'rgb(255, 255, 255)', borderBottom: '1px solid rgb(113, 113, 122)' }}>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4" style={{ color: 'rgb(15, 15, 15)' }}>
              Your <span style={{ color: 'rgb(113, 113, 122)' }}>Schedule</span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: 'rgb(15, 15, 15)' }}>
              View and manage your catering orders on the calendar
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: 'rgb(15, 15, 15)' }}>Order Calendar</h2>
              <p style={{ color: 'rgb(113, 113, 122)' }}>Click on any date to create a new order or manage existing ones</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'rgb(15, 15, 15)' }}></div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border-2 p-6" style={{ borderColor: 'rgb(113, 113, 122)' }}>
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                dateClick={handleDateClick}
                height="auto"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth'
                }}
                eventDisplay="block"
                dayMaxEvents={3}
                moreLinkClick="popover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Date Click Modal */}
      <DateClickModal
        isOpen={showDateModal}
        selectedDate={selectedDate}
        existingOrders={orders}
        onClose={() => setShowDateModal(false)}
        onCreateOrder={handleCreateOrder}
        onDeleteOrder={handleDeleteOrder}
      />
    </div>
  );
}