import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SocialCalendar() {
  const [viewMode, setViewMode] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    loadEvents();
  }, [currentDate, viewMode]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const startDate = new Date(currentDate);
      startDate.setDate(startDate.getDate() - 7);
      const endDate = new Date(currentDate);
      endDate.setDate(endDate.getDate() + 30);

      const res = await fetch(
        `/api/calendar?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
      );
      if (!res.ok) throw new Error('Failed to load events');
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWeekDays = () => {
    const days = [];
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getEventsForDay = (date) => {
    return events.filter(e => {
      const eventDate = new Date(e.scheduled_for);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'published':
        return 'bg-white';
      case 'scheduled':
        return 'bg-gray-400';
      case 'draft':
        return 'bg-gray-700';
      default:
        return 'bg-gray-500';
    }
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      instagram: '📸',
      facebook: '📘',
      twitter: '𝕏',
      linkedin: '💼',
      email: '✉️',
      blog: '📝'
    };
    return icons[platform] || '📱';
  };

  const weekDays = getWeekDays();
  const isToday = (date) => date.toDateString() === new Date().toDateString();

  return (
    <div className="p-4 pb-80px">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Social Calendar</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('week')}
            className={`p-2 rounded-beheard ${
              viewMode === 'week' ? 'bg-beheard-lime text-beheard-black' : 'bg-beheard-card'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`p-2 rounded-beheard ${
              viewMode === 'month' ? 'bg-beheard-lime text-beheard-black' : 'bg-beheard-card'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))}
          className="btn-secondary"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h2 className="font-semibold">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))}
          className="btn-secondary"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="space-y-2 mb-6">
          {weekDays.map((day, i) => {
            const dayEvents = getEventsForDay(day);
            const today = isToday(day);

            return (
              <div
                key={i}
                className={`card ${today ? 'border-2 border-beheard-lime' : ''}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-beheard-text-tertiary">
                      {day.toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className="font-semibold">{day.getDate()}</p>
                  </div>
                  {today && <span className="text-xs bg-beheard-lime text-beheard-black px-2 py-1 rounded">Today</span>}
                </div>

                {dayEvents.length === 0 ? (
                  <p className="text-xs text-beheard-text-tertiary">No content scheduled</p>
                ) : (
                  <div className="space-y-2">
                    {dayEvents.map(event => (
                      <motion.button
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        whileHover={{ scale: 1.02 }}
                        className="w-full text-left p-2 bg-beheard-hover rounded-beheard hover:bg-beheard-border transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-xs font-medium flex items-center gap-1">
                              <span>{getPlatformIcon(event.platform)}</span>
                              {event.platform}
                            </p>
                            <p className="text-xs text-beheard-text-tertiary mt-1 line-clamp-1">
                              {typeof event.body === 'string' ? event.body : event.body[0]}
                            </p>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${getStatusDot(event.status)}`} />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Month View */}
      {viewMode === 'month' && (
        <div className="card">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-beheard-text-tertiary py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => {
              const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
              const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
              const dayNum = i - firstDay + 1;

              if (dayNum < 1 || dayNum > daysInMonth) {
                return <div key={i} className="aspect-square" />;
              }

              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
              const dayEvents = getEventsForDay(date);
              const today = isToday(date);

              return (
                <div
                  key={i}
                  className={`aspect-square p-1 rounded-beheard border ${
                    today ? 'border-2 border-beheard-lime' : 'border border-beheard-border'
                  } bg-beheard-hover flex flex-col`}
                >
                  <p className="text-xs font-semibold">{dayNum}</p>
                  <div className="flex-1 flex flex-wrap gap-0.5 content-start">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={`w-1 h-1 rounded-full ${getStatusDot(event.status)}`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Unscheduled drafts */}
      <div className="mt-6">
        <h3 className="font-semibold mb-3">Unscheduled Drafts</h3>
        <div className="card">
          <p className="text-sm text-beheard-text-secondary">No unscheduled drafts</p>
        </div>
      </div>

      {/* Event detail sheet */}
      {selectedEvent && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          className="fixed bottom-0 left-0 right-0 bg-beheard-card border-t border-beheard-border rounded-t-2xl p-4 max-h-96 overflow-y-auto"
        >
          <button
            onClick={() => setSelectedEvent(null)}
            className="absolute top-2 right-2 text-beheard-text-secondary"
          >
            ✕
          </button>

          <div className="mb-4">
            <p className="text-xs text-beheard-text-tertiary mb-1">
              {new Date(selectedEvent.scheduled_for).toLocaleString()}
            </p>
            <p className="text-sm font-semibold">
              {getPlatformIcon(selectedEvent.platform)} {selectedEvent.platform}
            </p>
          </div>

          {selectedEvent.image_url && (
            <img
              src={selectedEvent.image_url}
              alt="Content"
              className="w-full rounded-beheard mb-4"
            />
          )}

          <p className="text-sm text-beheard-text-secondary mb-4">
            {typeof selectedEvent.body === 'string' ? selectedEvent.body : selectedEvent.body[0]}
          </p>

          <div className="flex gap-2">
            <button className="btn-secondary flex-1">Edit</button>
            <button className="btn-secondary flex-1">Reschedule</button>
            <button className="btn-primary flex-1">Publish</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
