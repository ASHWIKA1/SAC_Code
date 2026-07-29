import React, { useState, useEffect } from 'react';
import { ShoppingCart, CreditCard, QrCode, DollarSign, X, CheckCircle, Smartphone } from 'lucide-react';
import { PageHeader, WhiteCard, Badge } from '../../../components/UI';
import { useInventorySync } from './useInventorySync';
import api from '../../../utils/api';

export default function PosTerminal() {
  const { items: menuItems, refetch: refetchItems } = useInventorySync();
  const [cart, setCart] = useState([]);
  const [checkoutModal, setCheckoutModal] = useState(null); // 'prepaid', 'upi', 'cod'
  const [rfidCard, setRfidCard] = useState('CARD-9021');
  const [checkoutResult, setCheckoutResult] = useState(null);
  const [codOrders, setCodOrders] = useState([]);

  useEffect(() => {
    fetchCodOrders();
  }, []);

  const fetchCodOrders = async () => {
    try {
      const res = await api.get('/api/v1/canteen/orders/active');
      const cods = (res.data || []).filter(o => o.paymentMode === 'COD' && o.paymentStatus === 'PENDING');
      setCodOrders(cods);
    } catch (e) {
      console.error(e);
    }
  };

  const addToCart = (item) => {
    if (item.isOutOfStock) return;
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: item.id, itemName: item.itemName, price: item.price, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCheckout = async (mode) => {
    const total = getCartTotal();
    if (total === 0) return;

    const payload = {
      cardUid: rfidCard,
      totalAmount: total,
      paymentMode: mode,
      items: cart
    };

    try {
      const res = await api.post('/api/v1/canteen/orders/checkout', payload);
      const savedOrder = res.data;

      if (mode === 'PREPAID') {
        setCheckoutResult({ type: 'success', msg: `Payment successful! Token: ${savedOrder.orderTokenId}` });
        setCart([]);
        refetchItems();
        setTimeout(() => {
          setCheckoutModal(null);
          setCheckoutResult(null);
        }, 2000);
      } else if (mode === 'COD') {
        setCheckoutResult({ type: 'success', msg: `Order created in COD cash queue! Token: ${savedOrder.orderTokenId}` });
        setCart([]);
        fetchCodOrders();
        refetchItems();
        setTimeout(() => {
          setCheckoutModal(null);
          setCheckoutResult(null);
        }, 2500);
      } else if (mode === 'UPI') {
        // Show QR and simulate webhook trigger after 4 seconds
        setCheckoutResult({ 
          type: 'upi-pending', 
          orderId: savedOrder.id,
          token: savedOrder.orderTokenId,
          qrData: `upi://pay?pa=canteen@school&pn=Canteen&am=${total}&cu=INR` 
        });
      }
    } catch (err) {
      setCheckoutResult({ type: 'error', msg: err.response?.data?.message || err.message });
    }
  };

  const simulateUpiConfirmation = async (orderId) => {
    try {
      await api.post(`/api/v1/canteen/orders/${orderId}/upi-webhook`);
      setCheckoutResult({ type: 'success', msg: `UPI Payment Received! Dispatching ticket to KDS...` });
      setCart([]);
      refetchItems();
      setTimeout(() => {
        setCheckoutModal(null);
        setCheckoutResult(null);
      }, 2000);
    } catch (e) {
      alert("Simulation failed: " + e.message);
    }
  };

  const clearCodOrder = async (orderId) => {
    try {
      await api.post(`/api/v1/canteen/orders/${orderId}/clear-cod`);
      alert("Payment cleared! Order dispatched to KDS.");
      fetchCodOrders();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PageHeader 
        title="POS Cashier Terminal" 
        breadcrumbs={[{ label: 'Canteen' }, { label: 'POS Terminal' }]}
      />

      <div className="row">
        {/* Visual Item Cards Grid */}
        <div className="col-12 col-md-8">
          <WhiteCard title="Menu Items Touch Grid">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
              {menuItems.map(item => {
                const isOut = item.isOutOfStock || item.stockQuantity <= 0;
                return (
                  <div 
                    key={item.id} 
                    onClick={() => addToCart(item)}
                    className={`canteen-card-item ${isOut ? 'disabled' : ''}`}
                    style={{
                      background: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: 6,
                      padding: 15,
                      cursor: isOut ? 'not-allowed' : 'pointer',
                      textAlign: 'center',
                      opacity: isOut ? 0.5 : 1
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{item.itemName}</div>
                    <div style={{ fontSize: 11, color: '#777', margin: '4px 0' }}>{item.itemCode || 'CODE'}</div>
                    <div style={{ fontWeight: 700, color: 'var(--primary-color)', fontSize: 14 }}>₹{item.price}</div>
                    
                    <div style={{ marginTop: 8 }}>
                      {isOut ? (
                        <Badge text="Out of Stock" color="red" />
                      ) : (
                        <Badge text={`Stock: ${item.stock || item.stockQuantity}`} color="green" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </WhiteCard>

          {/* COD Cashier Queue Stream */}
          <div style={{ marginTop: 20 }}>
            <WhiteCard title="COD Queue (Cash Payments Clearance)">
              {codOrders.length === 0 ? (
                <p style={{ color: '#999', fontSize: 13 }}>No pending COD orders awaiting cash payment.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {codOrders.map(order => (
                    <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', background: '#FFFDF5', border: '1px solid #F59E0B', borderRadius: 6 }}>
                      <div>
                        <strong style={{ fontSize: 13 }}>Token: {order.orderTokenId}</strong>
                        <p style={{ margin: 0, fontSize: 11, color: '#777' }}>Total: ₹{order.totalAmount} • Card: {order.cardUid}</p>
                      </div>
                      <button className="primary_btn btn_sm" onClick={() => clearCodOrder(order.id)} style={{ background: '#10B981', border: 'none' }}>
                        <DollarSign size={13} style={{ marginRight: 4 }} /> Clear Payment
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </WhiteCard>
          </div>
        </div>

        {/* POS Cart Sidebar */}
        <div className="col-12 col-md-4">
          <WhiteCard title="POS Shopping Cart">
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: '#aaa' }}>
                <ShoppingCart size={32} style={{ marginBottom: 10, opacity: 0.5 }} />
                <p>Cart is empty. Tap items on the grid to add.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                  {cart.map(c => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{c.itemName}</div>
                        <div style={{ fontSize: 11, color: '#666' }}>{c.quantity}x @ ₹{c.price}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 12, fontWeight: 700 }}>₹{(c.price * c.quantity).toFixed(2)}</span>
                        <button onClick={() => removeFromCart(c.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '2px solid #eee', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15 }}>
                  <span>Total Due:</span>
                  <span style={{ color: 'var(--primary-color)' }}>₹{getCartTotal().toFixed(2)}</span>
                </div>

                {/* Checkout triggers */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                  <button className="primary_btn" onClick={() => setCheckoutModal('prepaid')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '10px 0' }}>
                    <CreditCard size={14} /> Prepaid Card
                  </button>
                  <button className="primary_btn" onClick={() => setCheckoutModal('upi')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '10px 0', background: '#059669' }}>
                    <QrCode size={14} /> UPI / QR
                  </button>
                  <button className="primary_btn" onClick={() => setCheckoutModal('cod')} style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '10px 0', background: '#F59E0B' }}>
                    <DollarSign size={14} /> COD Cash Order
                  </button>
                </div>
              </div>
            )}
          </WhiteCard>
        </div>
      </div>

      {/* Checkout Dialog Overlay */}
      {checkoutModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', borderRadius: 8, padding: 25, width: '90%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <h5 style={{ fontWeight: 700, margin: 0 }}>Payment Processing</h5>
              <button onClick={() => { setCheckoutModal(null); setCheckoutResult(null); }} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>×</button>
            </div>

            {checkoutModal === 'prepaid' && !checkoutResult && (
              <div>
                <p style={{ fontSize: 13, color: '#555' }}>Simulating RFID Prepaid Card Reader Tap...</p>
                <div style={{ margin: '15px 0' }}>
                  <label style={{ fontSize: 12, fontWeight: 700 }}>Card UID Input</label>
                  <input type="text" className="form-control" value={rfidCard} onChange={e => setRfidCard(e.target.value)} />
                </div>
                <button className="primary_btn w-100" onClick={() => handleCheckout('PREPAID')}>
                  Simulate RFID Card Tap (< 3s)
                </button>
              </div>
            )}

            {checkoutModal === 'upi' && !checkoutResult && (
              <div style={{ textAlign: 'center' }}>
                <p>Generating Dynamic QR Code...</p>
                <button className="primary_btn w-100" onClick={() => handleCheckout('UPI')}>
                  Generate QR
                </button>
              </div>
            )}

            {checkoutResult?.type === 'upi-pending' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ padding: 20, background: '#f5f5f5', display: 'inline-block', borderRadius: 6, marginBottom: 15 }}>
                  <QrCode size={120} style={{ margin: '0 auto' }} />
                  <p style={{ margin: '10px 0 0 0', fontSize: 11, fontStyle: 'italic' }}>upi://pay?am={getCartTotal()}</p>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600 }}>Awaiting UPI Gateway confirmation...</p>
                <button className="primary_btn w-100" onClick={() => simulateUpiConfirmation(checkoutResult.orderId)} style={{ marginTop: 10, background: '#10B981' }}>
                  Simulate UPI Webhook Confirmation
                </button>
              </div>
            )}

            {checkoutModal === 'cod' && !checkoutResult && (
              <div>
                <p>Dispatch order directly to cash cashier queue?</p>
                <button className="primary_btn w-100" onClick={() => handleCheckout('COD')}>
                  Confirm Cash Order Dispatch
                </button>
              </div>
            )}

            {checkoutResult && checkoutResult.type !== 'upi-pending' && (
              <div style={{ textAlign: 'center', padding: '15px 0' }}>
                {checkoutResult.type === 'success' ? (
                  <CheckCircle size={48} style={{ color: '#10B981', margin: '0 auto 10px auto' }} />
                ) : (
                  <X size={48} style={{ color: '#EF4444', margin: '0 auto 10px auto' }} />
                )}
                <p style={{ fontWeight: 600, fontSize: 14 }}>{checkoutResult.msg}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
