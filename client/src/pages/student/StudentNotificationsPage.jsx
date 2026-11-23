import React, { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StudentNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/students/notifications');
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/students/notifications/${id}/read`);
      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {}
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl">
      <div>
        <h2 className="text-xl font-extrabold text-brand-navy">Notifications & Updates</h2>
        <p className="text-xs text-slate-500 mt-1">
          Recent alerts regarding your admission applications, counselling, and verification.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-brand-border shadow-card p-6">
        {loading ? (
          <p className="text-xs text-slate-400 py-6 text-center">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center">
            You have no notifications at this time.
          </p>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.isRead && markAsRead(n._id)}
                className={`p-4 rounded-xl border transition-all text-xs cursor-pointer ${
                  n.isRead
                    ? 'bg-white border-slate-200'
                    : 'bg-blue-50/70 border-brand-royal'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-brand-navy text-sm">{n.title}</h4>
                  <span className="text-[10px] text-slate-400">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{n.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentNotificationsPage;
