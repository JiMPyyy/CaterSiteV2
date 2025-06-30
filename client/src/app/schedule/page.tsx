'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Calendar, Clock, MapPin, Users, FileText, ShoppingCart, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { scheduleService, Schedule, CreateScheduleData } from '@/lib/services/schedules';
import { orderService, Order } from '@/lib/services/orders';
import Navigation from '@/components/layout/Navigation';

export default function SchedulePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateScheduleData>({
    title: '',
    date: '',
    time: '',
    description: '',
    attendees: 1,
    location: '',
    notes: ''
  });

  // Fetch schedules and orders on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [schedulesResponse, ordersResponse] = await Promise.all([
        scheduleService.getSchedules(),
        orderService.getOrders()
      ]);
      setSchedules(schedulesResponse.data.schedules);
      setOrders(ordersResponse.data.orders);
    } catch (error: any) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await scheduleService.getSchedules();
      setSchedules(response.data.schedules);
    } catch (error: any) {
      console.error('Failed to fetch schedules:', error);
    }
  };

  const handleDateSelect = (selectInfo: any) => {
    if (!isAuthenticated) {
      alert('Please log in to manage schedules');
      return;
    }

    const clickedDate = selectInfo.startStr;
    setSelectedDate(clickedDate);

    // Check if there's already a schedule on this date
    const existingSchedule = schedules.find(schedule =>
      schedule.date.split('T')[0] === clickedDate
    );

    // Check if there's already an order on this date
    const existingOrder = orders.find(order =>
      order.deliveryDate.split('T')[0] === clickedDate
    );

    setSelectedSchedule(existingSchedule || null);
    setSelectedOrder(existingOrder || null);

    setShowActionModal(true);
  };

  const handleEventClick = (clickInfo: any) => {
    const eventData = clickInfo.event.extendedProps;

    if (eventData.schedule) {
      // It's a schedule event
      const schedule = eventData.schedule;
      setSelectedSchedule(schedule);
      setFormData({
        title: schedule.title,
        date: schedule.date.split('T')[0], // Extract date part
        time: schedule.time,
        description: schedule.description || '',
        attendees: schedule.attendees || 1,
        location: schedule.location || '',
        notes: schedule.notes || ''
      });
      setShowModal(true);
    } else if (eventData.order) {
      // It's an order event - redirect to order details or show info
      const order = eventData.order;
      alert(`Order #${order.orderNumber}\nTotal: $${order.totalAmount.toFixed(2)}\nStatus: ${orderService.formatStatus(order.status)}\nDelivery: ${order.deliveryTime}`);
    }
  };

  // Handle creating a new order
  const handleCreateOrder = () => {
    setShowActionModal(false);
    router.push('/order');
  };

  // Handle creating a new schedule
  const handleCreateSchedule = () => {
    setShowActionModal(false);
    setSelectedSchedule(null);
    setFormData({
      title: '',
      date: selectedDate,
      time: '12:00',
      description: '',
      attendees: 1,
      location: '',
      notes: ''
    });
    setShowModal(true);
  };

  // Handle deleting a schedule
  const handleDeleteScheduleFromDate = async () => {
    if (!selectedSchedule) return;

    if (confirm(`Are you sure you want to delete the event "${selectedSchedule.title}"?`)) {
      try {
        await scheduleService.deleteSchedule(selectedSchedule._id);
        await fetchData(); // Refresh both schedules and orders
        setShowActionModal(false);
      } catch (error: any) {
        alert(error.message || 'Failed to delete schedule');
      }
    }
  };

  // Handle deleting an order
  const handleDeleteOrderFromDate = async () => {
    if (!selectedOrder) return;

    if (confirm(`Are you sure you want to cancel order #${selectedOrder.orderNumber}?`)) {
      try {
        await orderService.cancelOrder(selectedOrder._id);
        await fetchData(); // Refresh both schedules and orders
        setShowActionModal(false);
      } catch (error: any) {
        alert(error.message || 'Failed to cancel order');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (selectedSchedule) {
        // Update existing schedule
        await scheduleService.updateSchedule(selectedSchedule._id, formData);
      } else {
        // Create new schedule
        await scheduleService.createSchedule(formData);
      }

      await fetchData(); // Refresh both schedules and orders
      setShowModal(false);
      resetForm();
    } catch (error: any) {
      alert(error.message || 'Failed to save schedule');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSchedule) return;

    if (confirm('Are you sure you want to delete this schedule?')) {
      try {
        await scheduleService.deleteSchedule(selectedSchedule._id);
        await fetchData(); // Refresh both schedules and orders
        setShowModal(false);
        resetForm();
      } catch (error: any) {
        alert(error.message || 'Failed to delete schedule');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      description: '',
      attendees: 1,
      location: '',
      notes: ''
    });
    setSelectedSchedule(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'attendees' ? parseInt(value) || 1 : value
    }));
  };

  // Convert schedules and orders to FullCalendar events
  const scheduleEvents = schedules.map(schedule => scheduleService.toCalendarEvent(schedule));

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

  const calendarEvents = [...scheduleEvents, ...orderEvents];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <Calendar className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to view and manage your schedules.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Event Schedule</h1>
          <button
            onClick={() => {
              setSelectedSchedule(null);
              resetForm();
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus size={20} />
            New Event
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
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
              events={calendarEvents}
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

        {/* Schedule Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.96 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.96 }}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedSchedule ? 'Edit Event' : 'New Event'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Team lunch meeting"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <Calendar size={14} />
                        Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <Clock size={14} />
                        Time *
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Attendees and Location */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <Users size={14} />
                        Attendees
                      </label>
                      <input
                        type="number"
                        name="attendees"
                        value={formData.attendees}
                        onChange={handleInputChange}
                        min="1"
                        max="1000"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <MapPin size={14} />
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Conference Room A"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Event description..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <FileText size={14} />
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Additional notes..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    {selectedSchedule && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saving...' : selectedSchedule ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Modal - Choose between Create Order, Create Schedule, or Delete Schedule */}
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
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
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
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Show existing schedule info if there is one */}
                  {selectedSchedule && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-blue-900 mb-1">📅 Existing Event:</h4>
                      <p className="text-blue-800">{selectedSchedule.title}</p>
                      <p className="text-blue-600 text-sm">{selectedSchedule.time}</p>
                    </div>
                  )}

                  {/* Show existing order info if there is one */}
                  {selectedOrder && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-green-900 mb-1">🍽️ Existing Order:</h4>
                      <p className="text-green-800">Order #{selectedOrder.orderNumber}</p>
                      <p className="text-green-600 text-sm">
                        ${selectedOrder.totalAmount.toFixed(2)} - {orderService.formatStatus(selectedOrder.status)}
                      </p>
                      <p className="text-green-600 text-sm">Delivery: {selectedOrder.deliveryTime}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {/* Create Order Button */}
                    <button
                      onClick={handleCreateOrder}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-3"
                    >
                      <ShoppingCart size={20} />
                      <span>Create Order for this Date</span>
                    </button>

                    {/* Create Schedule Button */}
                    <button
                      onClick={handleCreateSchedule}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-3"
                    >
                      <Calendar size={20} />
                      <span>Create New Event</span>
                    </button>

                    {/* Delete Schedule Button - Only show if there's an existing schedule */}
                    {selectedSchedule && (
                      <button
                        onClick={handleDeleteScheduleFromDate}
                        className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-3"
                      >
                        <Trash2 size={20} />
                        <span>Delete Event "{selectedSchedule.title}"</span>
                      </button>
                    )}

                    {/* Delete Order Button - Only show if there's an existing order */}
                    {selectedOrder && (
                      <button
                        onClick={handleDeleteOrderFromDate}
                        className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition flex items-center justify-center gap-3"
                      >
                        <Trash2 size={20} />
                        <span>Cancel Order #{selectedOrder.orderNumber}</span>
                      </button>
                    )}

                    {/* Cancel Button */}
                    <button
                      onClick={() => setShowActionModal(false)}
                      className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition"
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
  );
}
