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
  const [selectedTime, setSelectedTime] = useState<string>('12:00');
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

    // Reset time to default when opening modal
    setSelectedTime('12:00');

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
    // Pass both the selected date and time as URL parameters
    router.push(`/order?date=${selectedDate}&time=${selectedTime}`);
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
    backgroundColor: order.status === 'delivered' ? 'rgb(15, 15, 15)' :
                    order.status === 'cancelled' ? 'rgb(113, 113, 122)' :
                    order.status === 'confirmed' ? 'rgb(15, 15, 15)' : 'rgb(113, 113, 122)',
    borderColor: order.status === 'delivered' ? 'rgb(39, 39, 42)' :
                order.status === 'cancelled' ? 'rgb(82, 82, 91)' :
                order.status === 'confirmed' ? 'rgb(39, 39, 42)' : 'rgb(82, 82, 91)',
    textColor: '#ffffff',
    extendedProps: {
      order: order,
      type: 'order'
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
          <div className="text-center p-8 rounded-lg shadow-lg max-w-md" style={{
            backgroundColor: 'rgb(255, 255, 255)',
            border: '2px solid rgb(113, 113, 122)'
          }}>
            <Calendar className="mx-auto mb-4" style={{ color: 'rgb(113, 113, 122)' }} size={64} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'rgb(15, 15, 15)' }}>Authentication Required</h2>
            <p style={{ color: 'rgb(15, 15, 15)' }}>Please log in to view and manage your orders.</p>
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

      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'rgb(15, 15, 15)' }}>Order Calendar</h1>
              <p style={{ color: 'rgb(15, 15, 15)' }}>View and manage your catering orders</p>
            </div>
            <button
              onClick={() => {
                // Pre-fill with today's date when creating a new order from header
                const today = new Date().toISOString().split('T')[0];
                router.push(`/order?date=${today}`);
              }}
              className="px-4 py-2 rounded-lg transition flex items-center gap-2 text-white"
              style={{ backgroundColor: 'rgb(15, 15, 15)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)'}
            >
              <Plus size={20} />
              New Order
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'rgb(15, 15, 15)' }}></div>
            </div>
          ) : (
            <div className="rounded-lg shadow-lg p-6" style={{
              backgroundColor: 'rgb(255, 255, 255)',
              border: '2px solid rgb(113, 113, 122)'
            }}>
              <style jsx global>{`
                .fc-daygrid-day:hover {
                  background-color: rgba(113, 113, 122, 0.1) !important;
                  cursor: pointer !important;
                  transition: background-color 0.2s ease !important;
                }
                .fc-daygrid-day-top:hover {
                  color: rgb(15, 15, 15) !important;
                  font-weight: 500 !important;
                }
                .fc-day-today:hover {
                  background-color: rgba(15, 15, 15, 0.1) !important;
                }
                .fc-daygrid-day {
                  transition: background-color 0.2s ease;
                }
                .fc-toolbar-title {
                  color: rgb(15, 15, 15) !important;
                }
                .fc-button-primary {
                  background-color: rgb(15, 15, 15) !important;
                  border-color: rgb(15, 15, 15) !important;
                }
                .fc-button-primary:hover {
                  background-color: rgb(39, 39, 42) !important;
                  border-color: rgb(39, 39, 42) !important;
                }
                .fc-button-primary:not(:disabled):active {
                  background-color: rgb(39, 39, 42) !important;
                  border-color: rgb(39, 39, 42) !important;
                }
                .fc-col-header-cell {
                  background-color: rgba(15, 15, 15, 0.05) !important;
                }
                .fc-daygrid-day-number {
                  color: rgb(15, 15, 15) !important;
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
                eventBackgroundColor="rgb(15, 15, 15)"
                eventBorderColor="rgb(39, 39, 42)"
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
                  className="rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
                  style={{
                    backgroundColor: 'rgb(255, 255, 255)',
                    border: '2px solid rgb(113, 113, 122)'
                  }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold" style={{ color: 'rgb(15, 15, 15)' }}>
                      {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    <button
                      onClick={() => setShowActionModal(false)}
                      className="transition"
                      style={{ color: 'rgb(113, 113, 122)' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(82, 82, 91)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(113, 113, 122)'}
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Show existing order info if there is one */}
                    {selectedOrder && (
                      <div className="rounded-lg p-4 mb-4" style={{
                        backgroundColor: 'rgba(15, 15, 15, 0.05)',
                        border: '1px solid rgb(113, 113, 122)'
                      }}>
                        <h4 className="font-medium mb-1" style={{ color: 'rgb(15, 15, 15)' }}>🍽️ Existing Order:</h4>
                        <p style={{ color: 'rgb(15, 15, 15)' }}>Order #{selectedOrder.orderNumber}</p>
                        <p className="text-sm" style={{ color: 'rgb(113, 113, 122)' }}>
                          ${selectedOrder.totalAmount.toFixed(2)} - {orderService.formatStatus(selectedOrder.status)}
                        </p>
                        <p className="text-sm" style={{ color: 'rgb(15, 15, 15)' }}>Delivery: {selectedOrder.deliveryTime}</p>
                      </div>
                    )}

                    {/* Time Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2" style={{ color: 'rgb(15, 15, 15)' }}>
                        Select Delivery Time:
                      </label>
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                        style={{
                          border: '1px solid rgb(113, 113, 122)',
                          backgroundColor: 'rgb(255, 255, 255)',
                          color: 'rgb(15, 15, 15)'
                        }}
                      >
                        <option value="11:00">11:00 AM</option>
                        <option value="11:30">11:30 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="12:30">12:30 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="13:30">1:30 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="14:30">2:30 PM</option>
                        <option value="15:00">3:00 PM</option>
                        <option value="15:30">3:30 PM</option>
                        <option value="16:00">4:00 PM</option>
                        <option value="16:30">4:30 PM</option>
                        <option value="17:00">5:00 PM</option>
                        <option value="17:30">5:30 PM</option>
                        <option value="18:00">6:00 PM</option>
                        <option value="18:30">6:30 PM</option>
                        <option value="19:00">7:00 PM</option>
                        <option value="19:30">7:30 PM</option>
                        <option value="20:00">8:00 PM</option>
                      </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      {/* Create Order Button */}
                      <button
                        onClick={handleCreateOrder}
                        className="w-full py-3 px-4 rounded-lg transition flex items-center justify-center gap-3 text-white"
                        style={{ backgroundColor: 'rgb(15, 15, 15)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(39, 39, 42)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(15, 15, 15)'}
                      >
                        <ShoppingCart size={20} />
                        <span>Create Order for {selectedTime ? new Date(`2000-01-01T${selectedTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : 'this time'}</span>
                      </button>

                      {/* Delete Order Button - Only show if there's an existing order */}
                      {selectedOrder && (
                        <button
                          onClick={handleDeleteOrderFromDate}
                          className="w-full py-3 px-4 rounded-lg transition flex items-center justify-center gap-3 text-white"
                          style={{ backgroundColor: 'rgb(113, 113, 122)' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(82, 82, 91)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(113, 113, 122)'}
                        >
                          <Trash2 size={20} />
                          <span>Cancel Order #{selectedOrder.orderNumber}</span>
                        </button>
                      )}

                      {/* Cancel Button */}
                      <button
                        onClick={() => setShowActionModal(false)}
                        className="w-full py-3 px-4 rounded-lg transition"
                        style={{
                          backgroundColor: 'rgba(113, 113, 122, 0.1)',
                          color: 'rgb(15, 15, 15)',
                          border: '1px solid rgb(113, 113, 122)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(113, 113, 122, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(113, 113, 122, 0.1)'}
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
      <footer style={{
        borderTop: '1px solid rgb(113, 113, 122)',
        backgroundColor: 'rgb(255, 255, 255)'
      }}>
        <div className="container mx-auto px-4 py-6 text-center text-sm" style={{ color: 'rgb(15, 15, 15)' }}>
          © {new Date().getFullYear()} CaterLV. All rights reserved.
        </div>
      </footer>
    </div>
  );
}