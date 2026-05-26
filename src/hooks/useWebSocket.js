import { useEffect, useRef } from 'react';
import { useOrderStore } from '../store/useOrderStore';
import { useNotificationStore } from '../store/useNotificationStore';

export const useWebSocket = (role) => {
  const fetchOrders = useOrderStore((state) => state.fetchOrders);
  const fetchBaristaQueue = useOrderStore((state) => state.fetchBaristaQueue);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const tickTimers = useOrderStore((state) => state.tickTimers);
  const wsRef = useRef(null);

  useEffect(() => {
    // 1. KDS SLA Timers Tick (every 30 seconds, simulate 1 minute elapsed)
    const timerInterval = setInterval(() => {
      tickTimers();
    }, 30000);

    // 2. Real WebSocket connection for staff roles
    const ALLOWED_ROLES = ['barista', 'store_manager', 'admin', 'super_admin'];
    const token = localStorage.getItem('dc_token');

    if (token && ALLOWED_ROLES.includes(role)) {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const storeId = localStorage.getItem('dc_store_id') || '1';
      const wsUrl = `${wsProtocol}//${window.location.host}/ws?token=${token}&storeId=${storeId}`;

      const connect = () => {
        console.log('[WS] Connecting to:', wsUrl);
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('[WS] Connected successfully');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const { type, payload } = data;
            console.log('[WS] Event received:', type, payload);

            switch (type) {
              case 'NEW_ORDER':
                addNotification(
                  'New Order Received',
                  `Order #${payload.order_number || payload.id} placed.`,
                  'info'
                );
                // Refresh list
                fetchOrders();
                if (role === 'barista') {
                  fetchBaristaQueue();
                }
                break;

              case 'KOT_UPDATE':
              case 'ORDER_STATUS':
                addNotification(
                  'Order Updated',
                  `Order status changed to ${payload.status}.`,
                  'success'
                );
                fetchOrders();
                if (role === 'barista') {
                  fetchBaristaQueue();
                }
                break;

              case 'STOCK_ALERT':
                addNotification(
                  'Low Stock Warning',
                  payload.message || `${payload.ingredient_name} is running low.`,
                  'warning'
                );
                break;

              case 'ERROR':
                console.error('[WS] Server error message:', payload?.message);
                break;

              default:
                break;
            }
          } catch (err) {
            console.error('[WS] Parse message error:', err);
          }
        };

        ws.onclose = (e) => {
          console.warn('[WS] Closed:', e.reason);
          // Auto-reconnect with backoff
          setTimeout(() => {
            if (localStorage.getItem('dc_token')) {
              connect();
            }
          }, 5000);
        };

        ws.onerror = (err) => {
          console.error('[WS] Error:', err);
          ws.close();
        };
      };

      connect();
    }

    return () => {
      clearInterval(timerInterval);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [role, fetchOrders, fetchBaristaQueue, addNotification, tickTimers]);
};
