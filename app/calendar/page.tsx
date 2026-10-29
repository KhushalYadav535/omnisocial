'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '../../components/AppLayout';
import { apiRequest } from '../../lib/api';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Send,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Filter,
  RefreshCw,
  Edit2,
  GripVertical,
  X,
  AlertTriangle,
  Eye
} from 'lucide-react';
import { Facebook, Instagram } from '../../components/Icons';

export default function CalendarPage() {
  const [activeBrandId, setActiveBrandId] = useState<string>('');
  const [events, setEvents] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'MONTH' | 'WEEK' | 'DAY' | 'LIST'>('MONTH');
  const [currentDate, setCurrentDate] = useState(() => new Date('2026-10-01T00:00:00Z'));
  const [today, setToday] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now);
    setToday(now);
  }, []);

  const fetchCalendar = async () => {
    setLoading(true);
    try {
      const query = activeBrandId ? `?brandId=${activeBrandId}` : '';
      const res = await apiRequest(`/calendar${query}`);
      setEvents(res.events || []);
    } catch (err: any) {
      console.error('Failed to load calendar:', err);
      setNotice({ type: 'error', text: err.message || 'Failed to load calendar items' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, [activeBrandId]);

  // Handle Drag and Drop Rescheduling
  const handleDragStart = (e: React.DragEvent, eventItem: any) => {
    if (eventItem.status === 'PUBLISHED' || eventItem.status === 'PUBLISHING') {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', eventItem.id);
    setDraggedEventId(eventItem.id);
  };

  const handleDropOnDate = async (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData('text/plain') || draggedEventId;
    if (!eventId) return;

    const eventToMove = events.find(ev => ev.id === eventId);
    if (!eventToMove) return;

    if (eventToMove.status === 'PUBLISHED' || eventToMove.status === 'PUBLISHING') {
      setNotice({ type: 'error', text: `Cannot reschedule a ${eventToMove.status} publication` });
      return;
    }

    // Preserve time of day from original schedule
    const origDate = new Date(eventToMove.scheduledFor);
    const newScheduled = new Date(targetDate);
    newScheduled.setHours(origDate.getHours(), origDate.getMinutes(), 0, 0);

    // Optimistic UI state update
    const previousEvents = [...events];
    setEvents(prev =>
      prev.map(ev =>
        ev.id === eventId ? { ...ev, scheduledFor: newScheduled.toISOString(), status: 'QUEUED' } : ev
      )
    );

    try {
      await apiRequest('/calendar/reschedule', {
        method: 'POST',
        body: JSON.stringify({
          publicationId: eventToMove.publicationId,
          newDate: newScheduled.toISOString()
        })
      });

      setNotice({
        type: 'success',
        text: `Post "${eventToMove.title}" rescheduled to ${newScheduled.toLocaleDateString()} at ${newScheduled.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      });
    } catch (err: any) {
      // Revert optimistic update
      setEvents(previousEvents);
      setNotice({ type: 'error', text: err.message || 'Failed to reschedule post' });
    } finally {
      setDraggedEventId(null);
    }
  };

  const handleSaveModalReschedule = async () => {
    if (!selectedEvent || !rescheduleDate) return;
    setSaving(true);
    setNotice(null);
    try {
      await apiRequest('/calendar/reschedule', {
        method: 'POST',
        body: JSON.stringify({
          publicationId: selectedEvent.publicationId,
          newDate: new Date(rescheduleDate).toISOString()
        })
      });

      setNotice({ type: 'success', text: 'Publication rescheduled successfully.' });
      setSelectedEvent(null);
      fetchCalendar();
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Reschedule failed' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContentEdit = async () => {
    if (!selectedEvent) return;
    setSaving(true);
    setNotice(null);
    try {
      await apiRequest(`/calendar/events/${selectedEvent.publicationId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: editTitle,
          caption: editCaption
        })
      });

      setNotice({ type: 'success', text: 'Post content updated successfully.' });
      setIsEditing(false);
      setSelectedEvent(null);
      fetchCalendar();
    } catch (err: any) {
      setNotice({ type: 'error', text: err.message || 'Edit failed' });
    } finally {
      setSaving(false);
    }
  };

  // Date Navigation Helpers
  const nextPeriod = () => {
    const next = new Date(currentDate);
    if (viewMode === 'MONTH') next.setMonth(next.getMonth() + 1);
    else if (viewMode === 'WEEK') next.setDate(next.getDate() + 7);
    else if (viewMode === 'DAY') next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const prevPeriod = () => {
    const prev = new Date(currentDate);
    if (viewMode === 'MONTH') prev.setMonth(prev.getMonth() - 1);
    else if (viewMode === 'WEEK') prev.setDate(prev.getDate() - 7);
    else if (viewMode === 'DAY') prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const jumpToToday = () => {
    setCurrentDate(new Date());
  };

  // Generate Month View Days (35 or 42 grid cells)
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthDays: { date: Date; isCurrentMonth: boolean }[] = [];
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    monthDays.push({ date: new Date(year, month, -i), isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    monthDays.push({ date: new Date(year, month, i), isCurrentMonth: true });
  }
  const remaining = 35 - monthDays.length;
  for (let i = 1; i <= (remaining > 0 ? remaining : 42 - monthDays.length); i++) {
    monthDays.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
  }

  // Generate Week View Days (7 days centered on currentDate)
  const weekDays: Date[] = [];
  const currentDayOfWeek = currentDate.getDay();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDayOfWeek);

  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    weekDays.push(d);
  }

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // Upcoming publications for sidebar
  const upcomingPosts = events
    .filter(e => e.status === 'QUEUED')
    .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
    .slice(0, 5);

  return (
    <AppLayout activeBrandId={activeBrandId} onBrandChange={setActiveBrandId}>
      <div className="space-y-6">
        {/* Header with Navigation and View Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
              <CalendarIcon className="w-6 h-6 text-indigo-600" />
              <span>Multi-Platform Content Calendar</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Drag and drop posts to reschedule. Timezone-aware background execution verified with PostgreSQL persistence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600">
              {(['MONTH', 'WEEK', 'DAY', 'LIST'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    viewMode === mode ? 'bg-white text-indigo-600 shadow-2xs' : 'hover:text-slate-900'
                  }`}
                >
                  {mode.charAt(0) + mode.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-1.5 bg-white border border-slate-200 p-0.5 rounded-lg shadow-2xs">
              <button onClick={prevPeriod} className="p-1.5 hover:bg-slate-50 rounded-md text-slate-600">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={jumpToToday}
                className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-md"
              >
                Today
              </button>
              <button onClick={nextPeriod} className="p-1.5 hover:bg-slate-50 rounded-md text-slate-600">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <span className="text-sm font-black text-slate-900 min-w-32 text-right">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {notice && (
          <div className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2 ${
            notice.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{notice.text}</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Grid Area (3 Cols) */}
          <div className="lg:col-span-3">
            {/* MONTH VIEW */}
            {viewMode === 'MONTH' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-[11px] font-bold text-slate-600 py-2.5">
                  <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>

                <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 min-h-[560px]">
                  {monthDays.map((dayItem, idx) => {
                    const isToday = today ? isSameDay(dayItem.date, today) : false;
                    const dayEvents = events.filter(e => isSameDay(new Date(e.scheduledFor), dayItem.date));

                    return (
                      <div
                        key={idx}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropOnDate(e, dayItem.date)}
                        className={`p-1.5 flex flex-col justify-between transition-colors min-h-[95px] ${
                          dayItem.isCurrentMonth ? 'bg-white' : 'bg-slate-50/50 text-slate-400'
                        } hover:bg-indigo-50/20`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center ${
                            isToday ? 'bg-indigo-600 text-white font-black' : 'text-slate-700'
                          }`}>
                            {dayItem.date.getDate()}
                          </span>
                        </div>

                        {/* Event Pills with Drag and Drop */}
                        <div className="space-y-1 my-1 overflow-y-auto max-h-24">
                          {dayEvents.map(ev => {
                            const isDraggable = ev.status !== 'PUBLISHED' && ev.status !== 'PUBLISHING';
                            return (
                              <div
                                key={ev.id}
                                draggable={isDraggable}
                                onDragStart={(e) => handleDragStart(e, ev)}
                                onClick={() => {
                                  setSelectedEvent(ev);
                                  setIsEditing(false);
                                  setEditTitle(ev.title);
                                  setEditCaption(ev.caption);
                                }}
                                className={`w-full text-left p-1 rounded text-[10px] font-semibold truncate block transition-all cursor-pointer ${
                                  isDraggable ? 'cursor-grab active:cursor-grabbing hover:shadow-2xs' : 'cursor-pointer'
                                } ${
                                  ev.status === 'PUBLISHED'
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : ev.status === 'QUEUED'
                                    ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                                    : ev.status === 'PUBLISHING'
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                                }`}
                              >
                                <span className="font-bold mr-1">
                                  [{ev.platform.slice(0, 2)}]
                                </span>
                                {ev.title}
                              </div>
                            );
                          })}
                        </div>

                        <div className="text-right text-[9px] text-slate-300">
                          {dayEvents.length > 0 && `${dayEvents.length} post(s)`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* WEEK VIEW */}
            {viewMode === 'WEEK' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-bold text-slate-700 py-3">
                  {weekDays.map((d, i) => (
                    <div key={i} className="space-y-0.5">
                      <p className="text-[11px] text-slate-500">{d.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                      <p className={`text-sm font-black ${today && isSameDay(d, today) ? 'text-indigo-600' : 'text-slate-900'}`}>{d.getDate()}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 divide-x divide-slate-100 min-h-[480px]">
                  {weekDays.map((d, i) => {
                    const dayEvents = events.filter(e => isSameDay(new Date(e.scheduledFor), d));
                    return (
                      <div
                        key={i}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropOnDate(e, d)}
                        className="p-2 space-y-2 hover:bg-indigo-50/20 transition-colors"
                      >
                        {dayEvents.map(ev => (
                          <div
                            key={ev.id}
                            draggable={ev.status !== 'PUBLISHED' && ev.status !== 'PUBLISHING'}
                            onDragStart={(e) => handleDragStart(e, ev)}
                            onClick={() => {
                              setSelectedEvent(ev);
                              setIsEditing(false);
                              setEditTitle(ev.title);
                              setEditCaption(ev.caption);
                            }}
                            className={`p-2 rounded-lg text-xs font-semibold cursor-pointer border shadow-2xs space-y-1 ${
                              ev.status === 'PUBLISHED'
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                                : ev.status === 'QUEUED'
                                ? 'bg-indigo-50 text-indigo-900 border-indigo-200'
                                : 'bg-rose-50 text-rose-900 border-rose-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase">{ev.platform}</span>
                              <span className="text-[9px] font-bold">{new Date(ev.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="font-bold truncate">{ev.title}</p>
                            <p className="text-[10px] text-slate-500 line-clamp-2">{ev.caption}</p>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* DAY VIEW */}
            {viewMode === 'DAY' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">
                    Schedule for {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {events.filter(e => isSameDay(new Date(e.scheduledFor), currentDate)).length} scheduled item(s)
                  </span>
                </div>

                <div className="space-y-3">
                  {events
                    .filter(e => isSameDay(new Date(e.scheduledFor), currentDate))
                    .map(ev => (
                      <div
                        key={ev.id}
                        onClick={() => {
                          setSelectedEvent(ev);
                          setIsEditing(false);
                          setEditTitle(ev.title);
                          setEditCaption(ev.caption);
                        }}
                        className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer flex items-center justify-between bg-white shadow-2xs"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            ev.platform === 'INSTAGRAM' ? 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {ev.platform.slice(0, 2)}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{ev.title}</h4>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{ev.caption}</p>
                            <div className="mt-1 flex items-center space-x-2 text-[10px] text-slate-400">
                              <span>Time: {new Date(ev.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              <span>• {ev.accountName}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            ev.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}>
                            {ev.status}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* LIST VIEW */}
            {viewMode === 'LIST' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs divide-y divide-slate-100">
                {events.map(ev => (
                  <div key={ev.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        ev.platform === 'INSTAGRAM' ? 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {ev.platform.slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{ev.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{ev.caption}</p>
                        <div className="mt-1 flex items-center space-x-2 text-[10px] text-slate-400">
                          <span>Scheduled: {new Date(ev.scheduledFor).toLocaleString()}</span>
                          <span>• {ev.brandName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ev.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}>
                        {ev.status}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedEvent(ev);
                          setIsEditing(false);
                          setEditTitle(ev.title);
                          setEditCaption(ev.caption);
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-bold px-2.5 py-1 rounded-md bg-indigo-50"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Publications Sidebar (1 Col) */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Upcoming Publications</span>
                </h3>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {upcomingPosts.length}
                </span>
              </div>

              {upcomingPosts.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">No queued publications due.</p>
              ) : (
                <div className="space-y-2">
                  {upcomingPosts.map(post => (
                    <div
                      key={post.id}
                      onClick={() => {
                        setSelectedEvent(post);
                        setIsEditing(false);
                        setEditTitle(post.title);
                        setEditCaption(post.caption);
                      }}
                      className="p-2.5 rounded-lg border border-slate-100 hover:border-indigo-200 bg-slate-50/50 hover:bg-indigo-50/20 transition-all cursor-pointer space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-slate-700">{post.platform}</span>
                        <span className="text-slate-400">{new Date(post.scheduledFor).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 truncate">{post.title}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{post.caption}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Event Detail & Reschedule Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedEvent.status === 'PUBLISHED'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : selectedEvent.status === 'QUEUED'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {selectedEvent.status}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{selectedEvent.platform} ({selectedEvent.accountName})</span>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Error Alert if Failed */}
              {selectedEvent.status === 'FAILED' && selectedEvent.errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Publication Failed</span>
                  </div>
                  <p className="text-[11px] text-rose-700">{selectedEvent.errorMessage}</p>
                </div>
              )}

              {/* Content Preview / Edit Form */}
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2.5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Caption</label>
                    <textarea
                      rows={3}
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2.5"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900">{selectedEvent.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">{selectedEvent.caption}</p>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Scheduled Time</span>
                      <span className="font-bold text-slate-700">{new Date(selectedEvent.scheduledFor).toLocaleString()}</span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Published Time</span>
                      <span className="font-bold text-slate-700">{selectedEvent.publishedAt ? new Date(selectedEvent.publishedAt).toLocaleString() : 'Not published'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Reschedule Picker (Only available for QUEUED or FAILED posts) */}
              {selectedEvent.status !== 'PUBLISHED' && selectedEvent.status !== 'PUBLISHING' && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Change Scheduled Date & Time</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="datetime-local"
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2"
                    />
                    <button
                      onClick={handleSaveModalReschedule}
                      disabled={saving || !rescheduleDate}
                      className="px-3 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shrink-0 disabled:opacity-50"
                    >
                      Save Date
                    </button>
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                {isEditing ? (
                  <div className="flex items-center space-x-2 w-full justify-end">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveContentEdit}
                      disabled={saving}
                      className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Update Post'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    {selectedEvent.status !== 'PUBLISHED' && selectedEvent.status !== 'PUBLISHING' ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Content</span>
                      </button>
                    ) : (
                      <div></div>
                    )}
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-lg"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
