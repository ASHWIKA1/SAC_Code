import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, CreditCard, AlertTriangle, Command, Search, Plus } from 'lucide-react';
import { PageHeader, WhiteCard, Badge } from '../../../components/UI';
import api from '../../../utils/api';

export default function AdminDashboard({ stats, setActiveTab, fetchStats }) {
  const [showPalette, setShowPalette] = useState(false);
  const [paletteSearch, setPaletteSearch] = useState('');
  const [rawMaterials, setRawMaterials] = useState([]);

  useEffect(() => {
    fetchRawMaterials();
    
    // CMD+K palette global listener
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchRawMaterials = async () => {
    try {
      // In a real ERP system this is fetched from inventory modules, mock/fallback here
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
    { name: 'Launch POS Touch Checkout Grid', desc: 'Jump to POS ordering terminal screen', action: () => { setActiveTab('pos'); setShowPalette(false); } },
    { name: 'Top-up Student Wallet Balance', desc: 'Recharge student prepaid card', action: () => { setActiveTab('wallets'); setShowPalette(false); } },
    { name: 'Manage Food & Meal Categories', desc: 'Add breakfast/lunch schedules', action: () => { setActiveTab('categories'); setShowPalette(false); } },
    { name: 'Adjust Menu Item Stock Quantity', desc: 'Increase item inventory count', action: () => { setActiveTab('items'); setShowPalette(false); } },
    { name: 'Track Order Transaction History', desc: 'Log files and audit trails', action: () => { setActiveTab('transactions'); setShowPalette(false); } }
  ];

  const filteredActions = fastActions.filter(a => 
    a.name.toLowerCase().includes(paletteSearch.toLowerCase()) ||
    a.desc.toLowerCase().includes(paletteSearch.toLowerCase())
  );

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

      {/* Cmd+K visual hint panel */}
      <div style={{ background: '#F3E8FF', border: '1px solid #7C32FF', borderRadius: 8, padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#6D28D9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Command size={18} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>Quick Navigation Palette: Press <strong>Ctrl + K</strong> or <strong>Cmd + K</strong> to launch the fast action command bar.</span>
        </div>
        <button onClick={() => setShowPalette(true)} className="primary_btn btn_sm" style={{ padding: '4px 12px', fontSize: 12 }}>
          Open Palette
        </button>
      </div>

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

      {/* Global Cmd+K Search Palette Modal */}
      {showPalette && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
          <div style={{ background: '#fff', borderRadius: 8, width: '90%', maxWidth: 550, overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #eee' }}>
              <Search size={18} style={{ color: '#aaa', marginRight: 12 }} />
              <input 
                type="text" 
                className="form-control" 
                placeholder="Type a command or action name..." 
                value={paletteSearch}
                onChange={e => setPaletteSearch(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: 14 }}
                autoFocus
              />
              <button onClick={() => setShowPalette(false)} style={{ background: 'none', border: 'none', color: '#999', fontSize: 16, cursor: 'pointer' }}>ESC</button>
            </div>
            
            <div style={{ maxHeight: 300, overflowY: 'auto', padding: 10 }}>
              <p style={{ fontSize: 11, color: '#888', margin: '5px 10px', fontWeight: 600 }}>FAST ACTIONS</p>
              {filteredActions.length === 0 ? (
                <p style={{ padding: 15, color: '#999', textAlign: 'center', fontSize: 13 }}>No commands matching search query.</p>
              ) : (
                filteredActions.map((act, idx) => (
                  <div 
                    key={idx} 
                    onClick={act.action}
                    style={{ padding: '10px 15px', borderRadius: 6, cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f5f6fa'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ fontWeight: 600, fontSize: 13, color: '#333' }}>{act.name}</div>
                    <div style={{ fontSize: 11, color: '#777' }}>{act.desc}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
