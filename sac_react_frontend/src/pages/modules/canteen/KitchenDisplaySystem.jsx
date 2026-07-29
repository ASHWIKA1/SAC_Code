import React, { useEffect, useState } from 'react';
import { Clock, Play, CheckCircle2, UserCheck, Flame } from 'lucide-react';
import { PageHeader, WhiteCard, Badge } from '../../../components/UI';
import { useRealtimeOrders } from './useRealtimeOrders';
import api from '../../../utils/api';

export default function KitchenDisplaySystem() {
  const { orders, refetch } = useRealtimeOrders();
  const [currentTimes, setCurrentTimes] = useState({});

  // Clock tick to calculate SLA visual timers
  useEffect(() => {
    const timer = setInterval(() => {
      const updated = {};
      orders.forEach(order => {
        const elapsed = Math.floor((Date.now() - new Date(order.timeOrdered).getTime()) / 1000);
        updated[order.id] = elapsed; // elapsed seconds
      });
      setCurrentTimes(updated);
    }, 1000);

    return () => clearInterval(timer);
  }, [orders]);

  const handleNextStatus = async (order, nextStatus) => {
    try {
      await api.post(`/api/v1/canteen/orders/${order.id}/status?status=${nextStatus}`, { status: nextStatus });
      refetch();
    } catch (e) {
      console.error(e);
      alert("Failed to update status: " + (e.response?.data?.message || e.response?.data || e.message));
    }
  };

  const getSlaClassAndText = (elapsedSeconds) => {
    const mins = Math.floor(elapsedSeconds / 60);
    if (mins < 3) {
      return { className: 'kds-green', label: 'NORMAL SLA' };
    } else if (mins < 7) {
      return { className: 'kds-amber', label: 'APPROACHING SLA' };
    } else {
      return { className: 'kds-red-flash', label: 'OVERDUE!' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <style>{`
        .kds-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 15px;
        }
        .kds-card {
          background: #fff;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s;
        }
        .kds-card:hover {
          transform: translateY(-2px);
        }
        .kds-card-header {
          padding: 12px 16px;
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 700;
        }
        .kds-green { background: #10B981; }
        .kds-amber { background: #F59E0B; }
        .kds-red-flash {
          background: #EF4444;
          animation: kds-pulse 1s infinite alternate;
        }
        @keyframes kds-pulse {
          0% { opacity: 0.85; }
          100% { opacity: 1; box-shadow: 0 0 12px #EF4444; }
        }
        .kds-body {
          padding: 16px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .kds-item-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          padding: 4px 0;
          border-bottom: 1px solid #f9f9f9;
        }
        .kds-footer {
          padding: 12px 16px;
          background: #fafafa;
          border-top: 1px solid #f0f0f0;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
      `}</style>

      <PageHeader 
        title="Kitchen Display System (KDS)" 
        breadcrumbs={[{ label: 'Canteen' }, { label: 'KDS Terminal' }]}
      />

      <WhiteCard title="Preparation Queue">
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#888' }}>
            <Flame size={48} style={{ marginBottom: 12, opacity: 0.4 }} />
            <h4>No active orders in KDS queue.</h4>
            <p>New customer tickets will appear here automatically in real time.</p>
          </div>
        ) : (
          <div className="kds-grid">
            {orders.map(order => {
              const elapsed = currentTimes[order.id] || 0;
              const sla = getSlaClassAndText(elapsed);
              const minutes = Math.floor(elapsed / 60);
              const seconds = elapsed % 60;

              return (
                <div key={order.id} className="kds-card">
                  {/* Visual Aging Alert Header */}
                  <div className={`kds-card-header ${sla.className}`}>
                    <div>{order.orderTokenId}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                      <Clock size={14} />
                      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </div>
                  </div>

                  <div className="kds-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#777' }}>
                      <span>Card UID: {order.cardUid}</span>
                      <span>{order.paymentMode}</span>
                    </div>

                    <div style={{ margin: '8px 0', borderBottom: '1px solid #f0f0f0' }} />

                    {/* Order items loader */}
                    <div style={{ flexGrow: 1 }}>
                      <KdsItemsList orderId={order.id} />
                    </div>

                    {order.scheduledTime && (
                      <div style={{ background: '#EFF6FF', border: '1px solid #3B82F6', borderRadius: 4, padding: 6, fontSize: 11, color: '#1E3A8A' }}>
                        📅 Scheduled Pickup: {new Date(order.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}

                    <div style={{ fontSize: 11, fontWeight: 700, color: '#4B5563' }}>
                      Current State: <Badge text={order.orderStatus} color={order.orderStatus === 'CURRENTLY_PREPARING' ? 'orange' : 'blue'} />
                    </div>
                  </div>

                  {/* Single tap status progression */}
                  <div className="kds-footer">
                    {order.orderStatus === 'ORDER_RECEIVED' && (
                      <button className="primary_btn btn_sm" onClick={() => handleNextStatus(order, 'CURRENTLY_PREPARING')}>
                        <Play size={13} style={{ marginRight: 4 }} /> Start Cooking
                      </button>
                    )}
                    {order.orderStatus === 'PAYMENT_DONE' && (
                      <button className="primary_btn btn_sm" onClick={() => handleNextStatus(order, 'CURRENTLY_PREPARING')}>
                        <Play size={13} style={{ marginRight: 4 }} /> Start Cooking
                      </button>
                    )}
                    {order.orderStatus === 'CURRENTLY_PREPARING' && (
                      <button className="primary_btn btn_sm" onClick={() => handleNextStatus(order, 'READY_FOR_COLLECTION')} style={{ background: '#10B981' }}>
                        <CheckCircle2 size={13} style={{ marginRight: 4 }} /> Mark Ready
                      </button>
                    )}
                    {order.orderStatus === 'READY_FOR_COLLECTION' && (
                      <button className="primary_btn btn_sm" onClick={() => handleNextStatus(order, 'FULFILLED')} style={{ background: '#059669' }}>
                        <UserCheck size={13} style={{ marginRight: 4 }} /> Hand Over
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </WhiteCard>
    </div>
  );
}

// Inner helper to fetch and display items for a specific KDS ticket
function KdsItemsList({ orderId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get(`/api/v1/canteen/orders/${orderId}/items`)
      .then(res => setItems(res.data || []))
      .catch(err => console.error(err));
  }, [orderId]);

  return (
    <div>
      {items.map(item => (
        <div key={item.id} className="kds-item-row">
          <span>{item.quantity}x (Item ID: {item.menuItemId})</span>
          {item.kitchenNotes && (
            <span style={{ fontSize: 11, fontStyle: 'italic', color: '#EEF' }}>
              Note: {item.kitchenNotes}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
