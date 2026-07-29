import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, CreditCard, AlertTriangle, Plus, Edit2, Trash2 } from 'lucide-react';
import { PageHeader, WhiteCard, Badge } from '../../../components/UI';
import api from '../../../utils/api';

export default function AdminDashboard({ stats, setActiveTab, fetchStats }) {
  const [rawMaterials, setRawMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formData, setFormData] = useState({
    materialName: '',
    currentStockQuantity: 0,
    reorderThreshold: 5,
    unit: 'kg'
  });

  useEffect(() => {
    fetchRawMaterials();
  }, []);

  const fetchRawMaterials = async () => {
    try {
      const res = await api.get('/api/v1/canteen/raw-materials');
      let data = res.data || [];
      
      // Seed default raw materials if database has none
      if (data.length === 0) {
        const defaults = [
          { materialName: 'Wheat Flour', currentStockQuantity: 45.5, reorderThreshold: 10.0, unit: 'kg' },
          { materialName: 'Milk Dairy Pack', currentStockQuantity: 8.0, reorderThreshold: 15.0, unit: 'Litre' },
          { materialName: 'Cooking Sunflower Oil', currentStockQuantity: 22.0, reorderThreshold: 5.0, unit: 'Litre' },
          { materialName: 'Fresh Vegetables Mix', currentStockQuantity: 3.5, reorderThreshold: 8.0, unit: 'kg' }
        ];
        for (const item of defaults) {
          await api.post('/api/v1/canteen/raw-materials', item);
        }
        const freshRes = await api.get('/api/v1/canteen/raw-materials');
        data = freshRes.data || [];
      }
      
      setRawMaterials(data);
    } catch (e) {
      console.error("Failed to load raw materials:", e);
    }
  };

  const openAdd = () => {
    setEditingMaterial(null);
    setFormData({
      materialName: '',
      currentStockQuantity: 10,
      reorderThreshold: 5,
      unit: 'kg'
    });
    setShowModal(true);
  };

  const openEdit = (material) => {
    setEditingMaterial(material);
    setFormData({
      materialName: material.materialName,
      currentStockQuantity: material.currentStockQuantity,
      reorderThreshold: material.reorderThreshold,
      unit: material.unit
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this raw material?")) return;
    try {
      await api.delete(`/api/v1/canteen/raw-materials/${id}`);
      fetchRawMaterials();
    } catch (e) {
      alert("Failed to delete raw material: " + e.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = editingMaterial 
        ? { ...editingMaterial, ...formData } 
        : formData;
      
      await api.post('/api/v1/canteen/raw-materials', payload);
      setShowModal(false);
      fetchRawMaterials();
    } catch (e) {
      alert("Failed to save raw material: " + e.message);
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
          <WhiteCard 
            title="Recipe BOM Depletion (Raw Materials Inventory)"
            right={
              <button className="primary_btn btn_sm" onClick={openAdd} style={{ padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Plus size={13} /> Add Material
              </button>
            }
          >
            <div className="table-responsive">
              <table className="table" style={{ width: '100%', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f5f6fa', textAlign: 'left' }}>
                    <th style={{ padding: 12 }}>Material Name</th>
                    <th style={{ padding: 12 }}>Stock Quantity</th>
                    <th style={{ padding: 12 }}>Reorder Threshold</th>
                    <th style={{ padding: 12 }}>Status</th>
                    <th style={{ padding: 12, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rawMaterials.map(m => {
                    const isLow = m.currentStockQuantity < m.reorderThreshold;

                    return (
                      <tr key={m.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                        <td style={{ padding: 12, fontWeight: 600 }}>{m.materialName}</td>
                        <td style={{ padding: 12 }}>{m.currentStockQuantity} {m.unit}</td>
                        <td style={{ padding: 12 }}>{m.reorderThreshold} {m.unit}</td>
                        <td style={{ padding: 12 }}>
                          {isLow ? (
                            <Badge text="REORDER NOW" color="red" />
                          ) : (
                            <Badge text="STABLE" color="green" />
                          )}
                        </td>
                        <td style={{ padding: 12, textAlign: 'right' }}>
                          <button onClick={() => openEdit(m)} style={{ background: 'none', border: 'none', color: '#7C32FF', cursor: 'pointer', marginRight: 10 }}>
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => handleDelete(m.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                            <Trash2 size={13} />
                          </button>
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

      {/* Add / Edit Modal Popup */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', borderRadius: 6, width: '90%', maxWidth: 450, padding: 25, boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h5 style={{ fontWeight: 700, margin: 0 }}>
                {editingMaterial ? 'Edit Raw Material' : 'Add Raw Material'}
              </h5>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>×</button>
            </div>
            
            <form onSubmit={handleSave}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Material Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={formData.materialName} 
                    onChange={e => setFormData(prev => ({ ...prev, materialName: e.target.value }))} 
                    required 
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Current Stock</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="form-control" 
                      value={formData.currentStockQuantity} 
                      onChange={e => setFormData(prev => ({ ...prev, currentStockQuantity: parseFloat(e.target.value) }))} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Reorder Threshold</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="form-control" 
                      value={formData.reorderThreshold} 
                      onChange={e => setFormData(prev => ({ ...prev, reorderThreshold: parseFloat(e.target.value) }))} 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 4 }}>Unit of Measure</label>
                  <select 
                    className="form-control" 
                    value={formData.unit} 
                    onChange={e => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  >
                    <option value="kg">kg</option>
                    <option value="Litre">Litre</option>
                    <option value="piece">piece</option>
                    <option value="Pack">Pack</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 15 }}>
                  <button type="button" className="btn-secondary-outline btn_sm" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="primary_btn btn_sm">Save Material</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
