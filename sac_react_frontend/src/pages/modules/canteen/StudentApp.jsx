import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader, WhiteCard, Badge } from '../../../components/UI';
import api from '../../../utils/api';

export default function StudentApp() {
  const [cardUid, setCardUid] = useState('CARD-9021'); // default test Card UID
  const [orders, setOrders] = useState([]);
  const [bookingSlot, setBookingSlot] = useState('');
  const [cart, setCart] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchMenu();
  }, [cardUid]);

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/api/v1/canteen/orders/track/${cardUid}`);
      setOrders(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await api.get('/api/v1/canteen/items');
      setMenuItems(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrebook = async (e) => {
    e.preventDefault();
    if (!bookingSlot || cart.length === 0) {
      alert("Please select a time slot and add items to your pre-order.");
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const scheduledTime = `${todayStr}T${bookingSlot}:00`;

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const payload = {
      cardUid,
      totalAmount: total,
      paymentMode: 'PREPAID',
      scheduledTime,
      items: cart
    };

    try {
      await api.post('/api/v1/canteen/orders/checkout', payload);
      alert("🎉 Pre-order booked successfully for " + bookingSlot + "!");
      setCart([]);
      setBookingSlot('');
      fetchOrders();
    } catch (err) {
      alert("Pre-booking failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleQuickReorder = async (historicalOrder) => {
    setReordering(true);
    try {
      // Fetch items of the historical order
      const itemsRes = await api.get(`/api/v1/canteen/orders/${historicalOrder.id}/items`);
      const items = itemsRes.data || [];

      const cartItems = items.map(i => ({
        id: i.menuItemId,
        quantity: i.quantity,
        price: i.unitPrice
      }));

      const payload = {
        cardUid,
        totalAmount: historicalOrder.totalAmount,
        paymentMode: 'PREPAID',
        items: cartItems
      };

      await api.post('/api/v1/canteen/orders/checkout', payload);
      alert("🎉 Order successfully placed via Quick Re-order!");
      fetchOrders();
    } catch (err) {
      alert("Re-order failed: " + (err.response?.data?.message || err.message));
    } finally {
      setReordering(false);
    }
  };

  const addToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id, itemName: item.itemName, price: item.price, quantity: 1 }];
    });
  };

  const orderStatuses = [
    { label: 'Payment Done', status: 'PAYMENT_DONE' },
    { label: 'Received', status: 'ORDER_RECEIVED' },
    { label: 'Preparing', status: 'CURRENTLY_PREPARING' },
    { label: 'Ready', status: 'READY_FOR_COLLECTION' }
  ];

  const getStatusIndex = (currentStatus) => {
    return orderStatuses.findIndex(s => s.status === currentStatus);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PageHeader 
        title="Student CMS Portal" 
        breadcrumbs={[{ label: 'Canteen' }, { label: 'Student Portal' }]}
      />

      <div className="row">
        {/* Active Order Progress Trackers */}
        <div className="col-12 col-md-8">
          <WhiteCard title="Live Active Order Tracking">
            {orders.filter(o => o.orderStatus !== 'FULFILLED' && o.orderStatus !== 'CANCELLED').length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                <Clock size={36} style={{ marginBottom: 10, opacity: 0.6 }} />
                <p>No active orders currently processing.</p>
              </div>
            ) : (
              orders.filter(o => o.orderStatus !== 'FULFILLED' && o.orderStatus !== 'CANCELLED').map(order => {
                const activeIndex = getStatusIndex(order.orderStatus);
                return (
                  <div key={order.id} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 20, marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 15 }}>
                      <div>
                        <h5 style={{ margin: 0, fontWeight: 700 }}>
                          Order Token: <span style={{ color: 'var(--primary-color)' }}>{order.orderTokenId}</span>
                        </h5>
                        <p style={{ margin: 0, fontSize: 12, color: '#777' }}>Card UID: {order.cardUid}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>Estimated Collection:</p>
                        <p style={{ margin: 0, fontSize: 13, color: '#10B981', fontWeight: 700 }}>
                          {new Date(order.estimatedDeliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar Pipeline */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: 30 }}>
                      <div style={{ position: 'absolute', top: 8, left: '5%', right: '5%', height: 4, background: '#E5E7EB', zIndex: 1 }} />
                      <div style={{ position: 'absolute', top: 8, left: '5%', width: `${(activeIndex / (orderStatuses.length - 1)) * 90}%`, height: 4, background: '#7C32FF', zIndex: 1, transition: 'width 0.4s ease' }} />

                      {orderStatuses.map((state, sIdx) => {
                        const isDone = sIdx <= activeIndex;
                        return (
                          <div key={state.status} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, width: '22%' }}>
                            <div style={{
                              width: 20, height: 20, borderRadius: '50%',
                              background: isDone ? '#7C32FF' : '#E5E7EB',
                              border: '3px solid #fff',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }} />
                            <span style={{ fontSize: 11, fontWeight: isDone ? 700 : 500, color: isDone ? '#333' : '#999', marginTop: 8, textAlign: 'center' }}>
                              {state.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {order.orderStatus === 'READY_FOR_COLLECTION' && (
                      <div style={{ marginTop: 20, padding: 12, background: '#ECFDF5', border: '1px solid #10B981', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 10, color: '#065F46' }}>
                        <CheckCircle2 size={18} />
                        <div>
                          <strong>Ready for Collection!</strong> Please head to <strong>{order.pickupCounterId || 'Counter 1'}</strong>.
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </WhiteCard>

          {/* Meal Pre-booking */}
          <div style={{ marginTop: 20 }}>
            <WhiteCard title="Meal Pre-booking & Slot Scheduler">
              <form onSubmit={handlePrebook}>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Select Pickup Slot</label>
                    <select 
                      className="form-control" 
                      value={bookingSlot} 
                      onChange={e => setBookingSlot(e.target.value)}
                      required
                    >
                      <option value="">-- Choose Slot --</option>
                      <option value="08:30">Breakfast Slot A (08:30 AM)</option>
                      <option value="10:30">Breakfast Slot B (10:30 AM)</option>
                      <option value="12:30">Lunch Slot A (12:30 PM)</option>
                      <option value="13:30">Lunch Slot B (01:30 PM)</option>
                      <option value="15:30">Snack Slot A (03:30 PM)</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-6" style={{ display: 'flex', alignItems: 'flex-end' }}>
                    <button type="submit" className="primary_btn w-100" style={{ height: '38px' }}>
                      Book Pre-order Slot
                    </button>
                  </div>
                </div>
              </form>

              {/* Booking Cart */}
              <div style={{ marginTop: 15 }}>
                <h6 style={{ fontWeight: 700, fontSize: 13, borderBottom: '1px solid #f0f0f0', paddingBottom: 6 }}>Prebook Order Cart</h6>
                {cart.length === 0 ? (
                  <p style={{ fontSize: 12, color: '#aaa', margin: '10px 0' }}>Add items from the menu list below to book a slot.</p>
                ) : (
                  <div>
                    {cart.map(c => (
                      <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0' }}>
                        <span>{c.itemName} x{c.quantity}</span>
                        <span>₹{(c.price * c.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div style={{ textAlign: 'right', fontWeight: 700, fontSize: 13, marginTop: 8 }}>
                      Total: ₹{cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            </WhiteCard>
          </div>
        </div>

        {/* Menu Items and Quick Reorder list */}
        <div className="col-12 col-md-4">
          <WhiteCard title="Quick Menu Ordering">
            <div style={{ maxHeight: 350, overflowY: 'auto' }}>
              {menuItems.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f9f9f9' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>{item.itemName}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#999' }}>₹{item.price} • {item.dietaryTags || 'Veg'}</p>
                  </div>
                  <button className="primary_btn btn_sm" onClick={() => addToCart(item)} style={{ padding: '3px 8px', fontSize: 11 }}>
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </WhiteCard>

          <div style={{ marginTop: 20 }}>
            <WhiteCard title="Past Orders (Quick Re-order)">
              <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                {orders.filter(o => o.orderStatus === 'FULFILLED').length === 0 ? (
                  <p style={{ fontSize: 12, color: '#999', textAlign: 'center', padding: 10 }}>No past order history.</p>
                ) : (
                  orders.filter(o => o.orderStatus === 'FULFILLED').slice(0, 5).map(hist => (
                    <div key={hist.id} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>Token: {hist.orderTokenId}</p>
                        <p style={{ margin: 0, fontSize: 11, color: '#888' }}>Total: ₹{hist.totalAmount} • {new Date(hist.timeOrdered).toLocaleDateString()}</p>
                      </div>
                      <button 
                        className="btn-secondary-outline btn_sm" 
                        disabled={reordering} 
                        onClick={() => handleQuickReorder(hist)}
                        style={{ fontSize: 11, padding: '3px 8px' }}
                      >
                        Re-order
                      </button>
                    </div>
                  ))
                )}
              </div>
            </WhiteCard>
          </div>
        </div>
      </div>
    </div>
  );
}
