'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Calendar, ShoppingCart, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

import { orderService, Order } from '@/lib/services/orders';
import Navigation from '@/components/layout/Navigation';

export default function SchedulePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch orders on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const ordersResponse = await orderService.getOrders();
      setOrders(ordersResponse.data.orders);
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (selectInfo: any) => {
    if (!isAuthenticated) {
      alert('Please log in to manage orders');
      return;
    }

    const clickedDate = selectInfo.startStr;
    setSelectedDate(clickedDate);

    // Check if there's already an order on this date
    const existingOrder = orders.find(order =>
      order.deliveryDate.split('T')[0] === clickedDate
    );

    setSelectedOrder(existingOrder || null);

    setShowActionModal(true);
  };

  const handleEventClick = (clickInfo: any) => {
    const eventData = clickInfo.event.extendedProps;

    if (eventData.order) {
      // It's an order event - show order details
      const order = eventData.order;
      alert(`Order #${order.orderNumber}\nTotal: $${order.totalAmount.toFixed(2)}\nStatus: ${orderService.formatStatus(order.status)}\nDelivery: ${order.deliveryTime}`);
    }
  };

  // Handle creating a new order
  const handleCreateOrder = () => {
    setShowActionModal(false);
    router.push('/order');
  };

  // Handle deleting an order
  const handleDeleteOrderFromDate = async () => {
    if (!selectedOrder) return;

    if (confirm(`Are you sure you want to cancel order #${selectedOrder.orderNumber}?`)) {
      try {
        await orderService.cancelOrder(selectedOrder._id);
        await fetchOrders(); // Refresh orders
        setShowActionModal(false);
      } catch (error: any) {
        alert(error.message || 'Failed to cancel order');
      }
    }
  };



  // Convert orders to FullCalendar events
  const orderEvents = orders.map(order => ({
    id: `order-${order._id}`,
    title: `🍽️ Order #${order.orderNumber} - ${order.deliveryTime}`,
    date: order.deliveryDate.split('T')[0],
    backgroundColor: order.status === 'delivered' ? '#10b981' :
                    order.status === 'cancelled' ? '#ef4444' :
                    order.status === 'confirmed' ? '#3b82f6' : '#f59e0b',
    borderColor: order.status === 'delivered' ? '#059669' :
                order.status === 'cancelled' ? '#dc2626' :
                order.status === 'confirmed' ? '#2563eb' : '#d97706',
    textColor: '#ffffff',
    extendedProps: {
      order: order,
      type: 'order'
    }
  }));

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col font-sans text-gray-900 bg-white">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md border border-gray-200">
            <Calendar className="mx-auto text-primary mb-4" size={64} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-muted-foreground">Please log in to view and manage your orders.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col font-sans text-gray-900 bg-white">
      <Navigation />

      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Calendar</h1>
              <p className="text-muted-foreground">View and manage your catering orders</p>
            </div>
            <button
              onClick={() => router.push('/order')}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition flex items-center gap-2"
            >
              <Plus size={20} />
              New Order
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="bg-card rounded-lg shadow-lg border border-border p-6">
              <style jsx global>{`
                .fc-daygrid-day:hover {
                  background-color: #f3f4f6 !important;
                  cursor: pointer !important;
                  transition: background-color 0.2s ease !important;
                }
                .fc-daygrid-day-top:hover {
                  color: #1f2937 !important;
                  font-weight: 500 !important;
                }
                .fc-day-today:hover {
                  background-color: #e5e7eb !important;
                }
                .fc-daygrid-day {
                  transition: background-color 0.2s ease;
                }
              `}</style>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                events={orderEvents}
                select={handleDateSelect}
                eventClick={handleEventClick}
                height="auto"
                eventDisplay="block"
                eventBackgroundColor="#3b82f6"
                eventBorderColor="#2563eb"
                eventTextColor="#ffffff"
              />
            </div>
          )}

          {/* Action Modal - Create or Cancel Order */}
          <AnimatePresence>
            {showActionModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={() => setShowActionModal(false)}
              >
                <motion.div
                  initial={{ y: 20, opacity: 0, scale: 0.96 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 20, opacity: 0, scale: 0.96 }}
                  onClick={e => e.stopPropagation()}
                  className="bg-card rounded-lg shadow-xl border border-border p-6 w-full max-w-md mx-4"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    <button
                      onClick={() => setShowActionModal(false)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Show existing order info if there is one */}
                    {selectedOrder && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-1">🍽️ Existing Order:</h4>
                        <p className="text-gray-900">Order #{selectedOrder.orderNumber}</p>
                        <p className="text-gray-600 text-sm">
                          ${selectedOrder.totalAmount.toFixed(2)} - {orderService.formatStatus(selectedOrder.status)}
                        </p>
                        <p className="text-gray-600 text-sm">Delivery: {selectedOrder.deliveryTime}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {/* Create Order Button */}
                      <button
                        onClick={handleCreateOrder}
                        className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-3"
                      >
                        <ShoppingCart size={20} />
                        <span>Create Order for this Date</span>
                      </button>

                      {/* Delete Order Button - Only show if there's an existing order */}
                      {selectedOrder && (
                        <button
                          onClick={handleDeleteOrderFromDate}
                          className="w-full bg-destructive text-destructive-foreground py-3 px-4 rounded-lg hover:bg-destructive/90 transition flex items-center justify-center gap-3"
                        >
                          <Trash2 size={20} />
                          <span>Cancel Order #{selectedOrder.orderNumber}</span>
                        </button>
                      )}

                      {/* Cancel Button */}
                      <button
                        onClick={() => setShowActionModal(false)}
                        className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CaterVegas. All rights reserved.
        </div>
      </footer>
    </div>
  );
}