import api from '../api';

// Types
export interface Schedule {
  _id: string;
  userId: string;
  title: string;
  date: string;
  time: string;
  description?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  attendees?: number;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleData {
  title: string;
  date: string;
  time: string;
  description?: string;
  attendees?: number;
  location?: string;
  notes?: string;
}

export interface UpdateScheduleData extends Partial<CreateScheduleData> {
  status?: 'scheduled' | 'completed' | 'cancelled';
}

export interface SchedulesResponse {
  success: boolean;
  data: {
    schedules: Schedule[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface ScheduleResponse {
  success: boolean;
  data: {
    schedule: Schedule;
  };
}

// Schedule service functions
export const scheduleService = {
  // Get all schedules
  getSchedules: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<SchedulesResponse> => {
    try {
      const response = await api.get('/schedules', { params });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch schedules' };
    }
  },

  // Get single schedule
  getSchedule: async (id: string): Promise<ScheduleResponse> => {
    try {
      const response = await api.get(`/schedules/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to fetch schedule' };
    }
  },

  // Create new schedule
  createSchedule: async (scheduleData: CreateScheduleData): Promise<ScheduleResponse> => {
    try {
      const response = await api.post('/schedules', scheduleData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to create schedule' };
    }
  },

  // Update schedule
  updateSchedule: async (id: string, scheduleData: UpdateScheduleData): Promise<ScheduleResponse> => {
    try {
      const response = await api.put(`/schedules/${id}`, scheduleData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to update schedule' };
    }
  },

  // Delete schedule
  deleteSchedule: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.delete(`/schedules/${id}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Failed to delete schedule' };
    }
  },

  // Convert schedule to FullCalendar event format
  toCalendarEvent: (schedule: Schedule) => ({
    id: schedule._id,
    title: `${schedule.title} - ${schedule.time}`,
    date: schedule.date,
    backgroundColor: schedule.status === 'completed' ? '#10b981' : 
                    schedule.status === 'cancelled' ? '#ef4444' : '#3b82f6',
    extendedProps: {
      schedule: schedule
    }
  }),

  // Convert FullCalendar events back to schedules
  fromCalendarEvents: (events: any[]): Schedule[] => {
    return events.map(event => event.extendedProps.schedule).filter(Boolean);
  }
};
