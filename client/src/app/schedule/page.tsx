'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function SchedulePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Order Schedule</h1>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable
        selectable
        events={[
          { title: 'John Smith – 12:00 PM', date: '2025-07-01' },
          { title: 'Sarah Johnson – 11:30 AM', date: '2025-07-02' },
        ]}
        height="auto"
      />
    </div>
  );
}
