import { create } from 'zustand';
import toast from 'react-hot-toast';

export const useNotificationStore = create((set, get) => ({
  notifications: [
    { id: 'n1', title: 'New Order Received', message: 'Order #ORD-1001 placed via D2C Web App.', type: 'info', read: false, time: '2 mins ago' },
    { id: 'n2', title: 'Low Stock Alert', message: 'Oat Milk inventory is below threshold (1000ml remaining).', type: 'warning', read: false, time: '10 mins ago' },
    { id: 'n3', title: 'SLA Breach Alert', message: 'Order #ORD-1002 in Koramangala has breached preparation SLA.', type: 'error', read: true, time: '30 mins ago' },
  ],

  addNotification: (title, message, type = 'info') => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      read: false,
      time: 'Just now',
    };

    set((state) => ({
      notifications: [newNotif, ...state.notifications],
    }));

    // Trigger visual react-hot-toast notification
    if (type === 'success') toast.success(`${title}: ${message}`);
    else if (type === 'error') toast.error(`${title}: ${message}`);
    else toast(`${title}: ${message}`, { icon: '🔔' });

    // Optional audio chirp for barista/admin screens
    if (type === 'error' || title.includes('New Order')) {
      try {
        const audio = new Audio('/assets/chime.mp3');
        audio.volume = 0.5;
        audio.play().catch(() => {}); // catch autoplay blocks
      } catch (e) {}
    }
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  clearAll: () => {
    set({ notifications: [] });
  },

  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.read).length;
  },
}));
