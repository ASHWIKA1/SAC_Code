import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export function useRealtimeOrders(onStatusChange) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial active orders
  const fetchActiveOrders = () => {
    fetch('/api/v1/canteen/orders/active')
      .then(res => res.json())
      .then(data => {
        setOrders(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch active orders:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchActiveOrders();

    // Establish WebSocket STOMP connection
    const socket = new SockJS('http://localhost:8085/ws-canteen');
    const stompClient = Stomp.over(socket);
    stompClient.debug = null; // disable verbose logging

    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/canteen', (message) => {
        const event = JSON.parse(message.body);
        if (event.type === 'ORDER_STATUS_CHANGED') {
          const updatedOrder = event.data;
          
          setOrders((prev) => {
            // If the order is fulfilled or cancelled, remove it from active list
            if (updatedOrder.orderStatus === 'FULFILLED' || updatedOrder.orderStatus === 'CANCELLED') {
              return prev.filter(o => o.id !== updatedOrder.id);
            }
            // Otherwise, update or insert
            const exists = prev.some(o => o.id === updatedOrder.id);
            if (exists) {
              return prev.map(o => o.id === updatedOrder.id ? updatedOrder : o);
            } else {
              return [updatedOrder, ...prev];
            }
          });

          if (onStatusChange) {
            onStatusChange(updatedOrder);
          }
        }
      });
    }, (err) => {
      console.warn("WebSocket STOMP Connection failed, fallback to polling:", err);
      // Fallback polling interval if WS fails
      const interval = setInterval(fetchActiveOrders, 5000);
      return () => clearInterval(interval);
    });

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, []);

  return { orders, loading, refetch: fetchActiveOrders };
}
