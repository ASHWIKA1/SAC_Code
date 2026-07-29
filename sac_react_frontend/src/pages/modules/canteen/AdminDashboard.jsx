import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, CreditCard, AlertTriangle, Plus } from 'lucide-react';
import { PageHeader, WhiteCard, Badge } from '../../../components/UI';
import api from '../../../utils/api';

export default function AdminDashboard({ stats, setActiveTab, fetchStats }) {
  const [rawMaterials, setRawMaterials] = useState([]);

  useEffect(() => {
    fetchRawMaterials();
  }, []);

  const fetchRawMaterials = async () => {
    try {
      const res = await api.get('/api/v1/canteen/items'); // fallback items
      setRawMaterials([
        { id: 1, name: 'Wheat Flour', stock: '45.5 kg', threshold: '10.0 kg' },
        { id: 2, name: 'Milk Dairy Pack', stock: '8.0 Litre', threshold: '15.0 Litre' },
        { id: 3, name: 'Cooking Sunflower Oil', stock: '22.0 Litre', threshold: '5.0 Litre' },
        { id: 4, name: 'Fresh Vegetables Mix', stock: '3.5 kg', threshold: '8.0 kg' }
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  const fastActions = [
    { name: 'POS Checkout Grid', desc: 'Jump to POS cashier checkout terminal screen', action: () => setActiveTab('pos') },
    { name: 'Student Wallets', desc: 'Top-up prepaid card and manage daily spending limits', action: () => setActiveTab('wallets') },
    { name: 'Food & Meal Categories', desc: 'Add or modify breakfast/lunch schedules', action: () => setActiveTab('categories') },
    { name: 'Menu Item Inventory', desc: 'Add products and adjust low-stock thresholds', action: () => setActiveTab('items') },
    { name: 'Transaction History', desc: 'View revenue logs and system audit trails', action: () => setActiveTab('transactions') }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Overview stats cards */}
      <div className="canteen-row">
        {[
          { title: "Today's Revenue", value: `₹${parseFloat(stats.todayRevenue || 0).toFixed(2)}`, icon: 'ti-wallet', color: 'purple', action: () => setActiveTab('transactions') },
          { title: 'Completed Orders', value: stats.completedOrders || 0, icon: 'ti-shopping-cart', color: 'blue', action: () => setActiveTab('pos') },
          { title: 'Active Wallets', value: stats.activeWallets || 0, icon: 'ti-credit-card', color: 'green', action: () => setActiveTab('wallets') },
          { title: 'Low Stock Alerts', value: stats.lowStockAlerts || 0, icon: 'ti-alert', color: 'red', action: () => setActiveTab('items') }
        ].map((card, idx) => (
          <div key={idx} onClick={card.action} className="canteen-col-3" style={{ cursor: 'pointer' }}>
            <div className="stat_card">
              <div className={`stat_icon_wrap ${card.color}`}>
                <span className={card.icon} style={{ fontSize: 22 }} />
              </div>
              <div className="stat_info">
                <div className="value">{card.value}</div>
                <div className="label">{card.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Terminal Quick Actions Directory */}
      <WhiteCard title="CMS Navigation Quick Actions">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {fastActions.map((act, idx) => (
            <div 
              key={idx}
              onClick={act.action}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                textAlign: 'left',
                padding: '15px',
                borderRadius: '6px',
                border: '1px solid #e0e0e0',
                background: '#fff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                width: '100%',
                boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--primary-color)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(124, 50, 255, 0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#e0e0e0';
                e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.02)';
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--primary-color)', marginBottom: '4px' }}>{act.name}</span>
              <span style={{ fontSize: 11, color: '#666', lineHeight: '1.4' }}>{act.desc}</span>
            </div>
          ))}
        </div>
      </WhiteCard>

      <div className="canteen-row">
        {/* Recipe BOM Depletion Raw Materials Table */}
        <div className="canteen-col-8">
          <WhiteCard title="Recipe BOM Depletion (Raw Materials Inventory)">
            <div className="table-responsive">
              <table className="table" style={{ width: '100%', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f5f6fa', textAlign: 'left' }}>
                    <th style={{ padding: 12 }}>Material Name</th>
                    <th style={{ padding: 12 }}>Stock Quantity</th>
                    <th style={{ padding: 12 }}>Reorder Alert Threshold</th>
                    <th style={{ padding: 12 }}>Inventory Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rawMaterials.map(m => {
                    const val = parseFloat(m.stock);
                    const thresh = parseFloat(m.threshold);
                    const isLow = val < thresh;

                    return (
                      <tr key={m.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                        <td style={{ padding: 12, fontWeight: 600 }}>{m.name}</td>
                        <td style={{ padding: 12 }}>{m.stock}</td>
                        <td style={{ padding: 12 }}>{m.threshold}</td>
                        <td style={{ padding: 12 }}>
                          {isLow ? (
                            <Badge text="REORDER NOW" color="red" />
                          ) : (
                            <Badge text="STABLE" color="green" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </WhiteCard>
        </div>

        {/* Recent logs activity list */}
        <div className="canteen-col-4">
          <WhiteCard title="Recent Activity Logs">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 300, overflowY: 'auto' }}>
              {stats.recentActivities && stats.recentActivities.length > 0 ? (
                stats.recentActivities.map((act) => (
                  <div key={act.id} style={{ display: 'flex', gap: 10, fontSize: 12, borderBottom: '1px solid #f9f9f9', paddingBottom: 8 }}>
                    <div style={{ color: act.type === 'purchase' ? '#7C32FF' : '#10B981', fontWeight: 700 }}>
                      •
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600 }}>{act.type === 'purchase' ? 'Order Fulfilled' : 'Recharge'}</p>
                      <p style={{ margin: 0, color: '#777', fontSize: 11 }}>Amount: ₹{act.amount} • Student: #{act.studentId}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: 12, color: '#999', textAlign: 'center' }}>No recent activity records found.</p>
              )}
            </div>
          </WhiteCard>
        </div>
      </div>
    </div>
  );
}
