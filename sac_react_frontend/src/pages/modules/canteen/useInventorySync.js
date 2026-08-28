import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import api from '../../../utils/api';

export function useInventorySync(onStockUpdate) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = () => {
    api.get('/api/v1/canteen/items')
      .then(res => {
        setItems(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch menu items:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();

    const socket = new SockJS('http://localhost:8085/ws-canteen');
    const stompClient = Stomp.over(socket);
    stompClient.debug = null;

    stompClient.connect({}, () => {
      stompClient.subscribe('/topic/canteen', (message) => {
        const event = JSON.parse(message.body);
        if (event.type === 'STOCK_UPDATED') {
          // Trigger reload or update specific item
          fetchItems();
          if (onStockUpdate) {
            onStockUpdate(event.data);
          }
        }
      });
    }, (err) => {
      console.warn("WebSocket STOMP connection for stock updates failed:", err);
    });

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, []);

  return { items, loading, refetch: fetchItems };
}
