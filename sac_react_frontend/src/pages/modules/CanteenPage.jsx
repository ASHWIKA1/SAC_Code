import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Coffee, ShoppingCart, CreditCard, Layers, BookOpen, Clock, 
  History, Search, ShieldAlert, CheckCircle2, AlertTriangle, 
  RotateCcw, DollarSign, Plus, X, Command, ArrowRight, Printer, AlertCircle, Sparkles, Edit2, Trash2
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { PageHeader, WhiteCard, DataTable, Badge, ActionBtn, FormGroup, Alert } from '../../components/UI';
import api from '../../utils/api';
import AdminDashboard from './canteen/AdminDashboard';
import PosTerminal from './canteen/PosTerminal';
import StudentApp from './canteen/StudentApp';
import KitchenDisplaySystem from './canteen/KitchenDisplaySystem';

export default function CanteenPage({ active }) {
  const navigate = useNavigate();
  const activeTab = active || 'dashboard';
  const setActiveTab = (tabId) => navigate(`/modules/canteen/${tabId}`);

  const tabTitles = {
    dashboard: 'Canteen Dashboard',
    pos: 'POS Terminal',
    wallets: 'Student Wallets',
    items: 'Menu Items',
    categories: 'Food & Meal Categories',
    transactions: 'Transaction History',
    'student-app': 'Student Portal & Live Tracking',
    kds: 'Kitchen Display System (KDS)'
  };
  const currentTitle = tabTitles[activeTab] || 'Canteen Management';

  const [stats, setStats] = useState({
    todayRevenue: 0,
    completedOrders: 0,
    activeWallets: 0,
    lowStockAlerts: 0,
    recentActivities: []
  });

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  // Real-time EventSource connection
  useEffect(() => {
    const sse = new EventSource('/api/v1/canteen/realtime/stream');
    
    sse.addEventListener('INIT', (e) => {
      console.log('SSE Stream connected:', e.data);
    });

    const refreshData = () => {
      fetchStats();
      fetchCategories();
      fetchItems();
      fetchWallets();
      fetchTransactions();
    };

    sse.addEventListener('ITEM_UPDATE', () => fetchItems());
    sse.addEventListener('CATEGORY_UPDATE', () => fetchCategories());
    sse.addEventListener('WALLET_UPDATE', () => fetchWallets());
    sse.addEventListener('PURCHASE_COMPLETED', refreshData);
    sse.addEventListener('TRANSACTION_REFUND', refreshData);

    sse.onerror = (err) => {
      console.error("SSE Connection Error", err);
    };

    return () => {
      sse.close();
    };
  }, []);

  // Initial Fetching
  useEffect(() => {
    fetchStats();
    fetchCategories();
    fetchItems();
    fetchWallets();
    fetchTransactions();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/v1/canteen/dashboard/stats');
      setStats(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/v1/canteen/categories');
      setCategories(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await api.get('/api/v1/canteen/items');
      setItems(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchWallets = async () => {
    try {
      const res = await api.get('/api/v1/canteen/wallets');
      setWallets(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/api/v1/canteen/transactions');
      setTransactions(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <style>{`
        /* Custom scoped vanilla CSS specifically for Canteen module */
        /* Custom scoped vanilla CSS specifically for Canteen module */
        .canteen-row {
          display: flex;
          flex-wrap: wrap;
          margin-right: -15px;
          margin-left: -15px;
          row-gap: 20px;
        }
        .canteen-col-12 { width: 100%; padding-right: 15px; padding-left: 15px; }
        .canteen-col-8 { width: 66.666667%; padding-right: 15px; padding-left: 15px; }
        .canteen-col-6 { width: 50%; padding-right: 15px; padding-left: 15px; }
        .canteen-col-4 { width: 33.333333%; padding-right: 15px; padding-left: 15px; }
        .canteen-col-3 { width: 25%; padding-right: 15px; padding-left: 15px; }
        
        @media (max-width: 991px) {
          .canteen-col-8, .canteen-col-6, .canteen-col-4, .canteen-col-3 {
            width: 100%;
          }
        }

        .canteen-flex-between {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .canteen-flex-gap {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        /* Items list & Category Filter */
        .canteen-cat-scroll {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 5px;
        }

        .canteen-cat-btn {
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid #e8e8e8;
          background: #fff;
          color: #555;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .canteen-cat-btn.active {
          background: var(--primary-gradient);
          color: #fff;
          border-color: transparent;
        }
        .canteen-cat-btn:hover:not(.active) {
          background: #f5f6fa;
        }

        /* POS grid items */
        .canteen-pos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .canteen-card-item {
          background: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .canteen-card-item:hover {
          transform: translateY(-2px);
          box-shadow: var(--card-shadow);
          border-color: var(--primary-color);
        }
        .canteen-card-item.disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .canteen-card-item .item-visual {
          height: 100px;
          background: #fafafa;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #999;
          font-size: 28px;
          border-bottom: 1px solid #f1f1f1;
        }
        .canteen-card-item .item-body {
          padding: 12px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .canteen-card-item .item-title {
          font-weight: 600;
          font-size: 13px;
          color: #333;
          margin-bottom: 3px;
        }
        .canteen-card-item .item-meta {
          font-size: 11px;
          color: #888;
          margin-bottom: 8px;
        }
        .canteen-card-item .item-price-stock {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }
        .canteen-card-item .price {
          font-weight: 700;
          color: var(--primary-color);
          font-size: 14px;
        }
        .canteen-card-item .stock {
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 4px;
          background: #f1f1f1;
          color: #666;
        }

        /* Cart details */
        .canteen-cart-box {
          background: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 6px;
          padding: 15px;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .canteen-cart-list {
          max-height: 250px;
          overflow-y: auto;
          margin-bottom: 15px;
        }
        .canteen-cart-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f9f9f9;
        }
        .canteen-cart-row-title {
          font-size: 13px;
          font-weight: 500;
        }
        .canteen-cart-qty {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .canteen-qty-btn {
          width: 20px;
          height: 20px;
          border: 1px solid #ddd;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 11px;
        }
        .canteen-qty-btn:hover {
          background: #f5f6fa;
        }

        .canteen-cart-summary {
          background: #fafafa;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 15px;
        }
        .canteen-summary-line {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          margin-bottom: 6px;
        }
        .canteen-summary-line.total {
          font-weight: 700;
          font-size: 14px;
          border-top: 1px solid #e8e8e8;
          padding-top: 8px;
          margin-top: 8px;
          color: var(--primary-color);
        }

        /* General Forms & Tables alignment */
        .canteen-form-group {
          margin-bottom: 20px;
        }
        .canteen-form-group label {
          display: block;
          font-weight: 500;
          font-size: 12px;
          margin-bottom: 6px;
          color: var(--text-dark);
          text-transform: uppercase;
        }
        .canteen-form-control {
          width: 100%;
          padding: 9px 14px;
          border: 1px solid #BBC1C9;
          border-radius: 4px;
          font-family: var(--font);
          font-size: 13px;
          color: var(--text-dark);
          background: #fff;
          outline: none;
          transition: border-color 0.2s;
        }
        .canteen-form-control:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(124,50,255,0.08);
        }

        /* Modal popups */
        .canteen-popup-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          backdrop-filter: blur(4px);
        }
        .canteen-popup-content {
          background: #fff;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          padding: 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
          border: 1px solid #e8e8e8;
        }
      `}</style>
      <PageHeader 
        title={currentTitle} 
        breadcrumbs={[{ label: 'Modules' }, { label: 'Canteen' }, { label: currentTitle }]}
      />

      {/* Main Tab Workspace */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {activeTab === 'dashboard' && (
            <AdminDashboard 
              stats={stats} 
              setActiveTab={setActiveTab} 
              fetchStats={fetchStats}
            />
          )}
          {activeTab === 'pos' && (
            <PosTerminal />
          )}
          {activeTab === 'student-app' && (
            <StudentApp />
          )}
          {activeTab === 'kds' && (
            <KitchenDisplaySystem />
          )}
          {activeTab === 'wallets' && (
            <CanteenWallets 
              wallets={wallets} 
              fetchWallets={fetchWallets}
              categories={categories}
              items={items}
            />
          )}
          {activeTab === 'items' && (
            <CanteenItems 
              items={items} 
              categories={categories} 
              fetchItems={fetchItems}
            />
          )}
          {activeTab === 'categories' && (
            <CanteenCategories 
              categories={categories} 
              fetchCategories={fetchCategories}
            />
          )}
          {activeTab === 'transactions' && (
            <CanteenTransactions 
              transactions={transactions} 
              fetchTransactions={fetchTransactions}
              wallets={wallets}
              items={items}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Command Palette listener */}
      <CommandPalette 
        setActiveTab={setActiveTab} 
        wallets={wallets} 
        items={items}
        fetchWallets={fetchWallets}
      />
    </div>
  );
}

/* ==========================================
   SUB-COMPONENT: DASHBOARD
   ========================================== */
function CanteenDashboard({ stats, setActiveTab, fetchStats }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Stat Cards matching style of InfixEdu */}
      <div className="canteen-row">
        {[
          { title: "Today's Revenue", value: `₹${parseFloat(stats.todayRevenue || 0).toFixed(2)}`, icon: 'ti-wallet', color: 'purple', action: () => setActiveTab('transactions') },
          { title: 'Completed Orders', value: stats.completedOrders || 0, icon: 'ti-shopping-cart', color: 'blue', action: () => setActiveTab('pos') },
          { title: 'Active Wallets', value: stats.activeWallets || 0, icon: 'ti-credit-card', color: 'green', action: () => setActiveTab('wallets') },
          { title: 'Low Stock Items', value: stats.lowStockAlerts || 0, icon: 'ti-alert', color: 'red', action: () => setActiveTab('items') }
        ].map((card, idx) => (
          <div 
            key={idx} 
            onClick={card.action}
            className="canteen-col-3"
            style={{ cursor: 'pointer' }}
          >
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

      <div className="canteen-row">
        {/* Activity Feed */}
        <div className="canteen-col-8">
          <WhiteCard title="Live Activity Stream">
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {stats.recentActivities && stats.recentActivities.length > 0 ? (
                stats.recentActivities.map((act) => (
                  <div key={act.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 8px', borderBottom: '1px solid #f1f1f1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '8px', borderRadius: '50%', background: act.type === 'purchase' ? '#F3E8FF' : '#D1FAE5', color: act.type === 'purchase' ? '#7C32FF' : '#10B981' }}>
                        <span className={act.type === 'purchase' ? 'ti-shopping-cart' : 'ti-credit-card'} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>
                          {act.type === 'purchase' ? 'POS Purchase Complete' : 'Wallet Recharge'}
                        </p>
                        <p style={{ margin: 0, fontSize: '11px', color: '#777' }}>Student ID: #{act.studentId} • {act.notes || 'No description'}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: act.type === 'purchase' ? '#333' : '#10B981' }}>
                        {act.type === 'purchase' ? '-' : '+'}₹{parseFloat(act.amount).toFixed(2)}
                      </p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#999' }}>{new Date(act.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#777' }}>
                  <span className="ti-cup" style={{ fontSize: '32px', color: '#ccc', display: 'block', marginBottom: '8px' }} />
                  No transactions completed today.
                </div>
              )}
            </div>
          </WhiteCard>
        </div>

        {/* Quick actions */}
        <div className="canteen-col-4">
          <WhiteCard title="Quick Operations">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'POS checkout terminal', desc: 'Scan items & checkout student', tab: 'pos', icon: 'ti-shopping-cart' },
                { label: 'Recharge a wallet', desc: 'Top up student daily balance', tab: 'wallets', icon: 'ti-credit-card' },
                { label: 'Meal Categories', desc: 'Manage time schedules', tab: 'categories', icon: 'ti-layers' }
              ].map((op, idx) => {
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(op.tab)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '12px',
                      background: '#fff',
                      border: '1px solid #e8e8e8',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary-color)';
                      e.currentTarget.style.background = '#fcfaff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = '#e8e8e8';
                      e.currentTarget.style.background = '#fff';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '8px', background: '#f5f6fa', borderRadius: '4px', color: '#555' }}>
                        <span className={op.icon} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#333' }}>{op.label}</p>
                        <p style={{ margin: 0, fontSize: '11px', color: '#777' }}>{op.desc}</p>
                      </div>
                    </div>
                    <span className="ti-angle-right" style={{ color: '#aaa' }} />
                  </button>
                );
              })}
            </div>
          </WhiteCard>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   SUB-COMPONENT: POS / TOUCH SCREEN
   ========================================== */
function CanteenPos({ items, categories, wallets, refreshData }) {
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [checkoutStudentId, setCheckoutStudentId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [checkoutError, setCheckoutError] = useState('');
  const [receipt, setReceipt] = useState(null);

  const activeCategories = categories.filter(c => c.activeStatus === 1);
  const filteredItems = items.filter(item => {
    const matchesCat = selectedCat === 'all' || item.categoryId === parseInt(selectedCat);
    const matchesSearch = item.itemName.toLowerCase().includes(search.toLowerCase()) || 
                          (item.itemCode && item.itemCode.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const addToCart = (item) => {
    if (item.isAvailable !== 1 || item.stock <= 0) return;
    
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        if (existing.quantity >= item.stock) return prev;
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateCartQty = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const next = i.quantity + delta;
        if (next <= 0) return null;
        if (next > i.stock) return i;
        return { ...i, quantity: next };
      }
      return i;
    }).filter(Boolean));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const verifyStudent = () => {
    setCheckoutError('');
    if (!checkoutStudentId) return;
    const stdWallet = wallets.find(w => w.studentId === parseInt(checkoutStudentId));
    if (!stdWallet) {
      setVerificationResult({ success: false, message: 'Student Wallet not found' });
      return;
    }
    if (stdWallet.isActive !== 1) {
      setVerificationResult({ success: false, message: 'Wallet Account is currently locked' });
      return;
    }
    setVerificationResult({ success: true, wallet: stdWallet });
  };

  const handleCheckout = async () => {
    setCheckoutError('');
    if (!checkoutStudentId) {
      setCheckoutError('Please enter Student ID');
      return;
    }
    try {
      const payload = {
        studentId: checkoutStudentId,
        items: cart.map(i => ({ id: i.id, quantity: i.quantity })),
        paymentMethod: 'wallet',
        notes: 'POS checkout Terminal'
      };

      const res = await api.post('/api/v1/canteen/pos/checkout', payload);
      setReceipt({
        id: res.data.id,
        studentId: checkoutStudentId,
        items: [...cart],
        subtotal,
        tax,
        total,
        timestamp: new Date()
      });
      
      setCart([]);
      setCheckoutStudentId('');
      setVerificationResult(null);
      refreshData();
    } catch (e) {
      const msg = e.response?.data?.message || 'Checkout failed due to rule violation';
      setCheckoutError(msg);
    }
  };

  return (
    <div className="canteen-row">
      {/* Products list */}
      <div className="canteen-col-8" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div className="canteen-flex-between">
          <div className="pos-search-wrapper">
            <span className="ti-search" />
            <input 
              type="text" 
              placeholder="Search items or codes..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="canteen-form-control"
            />
          </div>

          <div className="canteen-cat-scroll">
            <button 
              onClick={() => setSelectedCat('all')}
              className={`canteen-cat-btn ${selectedCat === 'all' ? 'active' : ''}`}
            >
              All Meals
            </button>
            {activeCategories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCat(cat.id.toString())}
                className={`canteen-cat-btn ${selectedCat === cat.id.toString() ? 'active' : ''}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Item Cards Grid */}
        <div className="canteen-pos-grid">
          {filteredItems.map(item => {
            const outOfStock = item.isAvailable !== 1 || item.stock <= 0;
            return (
              <div 
                key={item.id}
                onClick={() => !outOfStock && addToCart(item)}
                className={`canteen-card-item ${outOfStock ? 'disabled' : ''}`}
              >
                <div className="item-visual">
                  {item.image ? (
                    <img src={item.image} alt={item.itemName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span className="ti-cup" />
                  )}
                  {outOfStock && (
                    <span style={{ position: 'absolute', top: '8px', right: '8px', background: '#ef5f5f', color: '#fff', fontSize: '9px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '3px' }}>
                      OUT OF STOCK
                    </span>
                  )}
                  {item.isVegetarian === 1 && (
                    <span style={{ position: 'absolute', bottom: '8px', left: '8px', background: '#D1FAE5', border: '1px solid #6EE7B7', color: '#065F46', fontSize: '9px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '3px' }}>
                      VEG
                    </span>
                  )}
                </div>
                <div className="item-body">
                  <div className="item-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.itemName}</div>
                  <div className="item-meta">Code: {item.itemCode || 'N/A'}</div>
                  <div className="item-price-stock">
                    <span className="price">₹{parseFloat(item.price).toFixed(2)}</span>
                    <span className="stock">Qty: {item.stock}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart Box */}
      <div className="canteen-col-4">
        <div className="canteen-cart-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid #f1f1f1', marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="ti-shopping-cart" style={{ color: 'var(--primary-color)', fontSize: '16px' }} />
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>Current Order</h4>
            </div>
            <span style={{ background: '#f5f6fa', color: '#555', fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '12px' }}>
              {cart.reduce((sum, i) => sum + i.quantity, 0)} Items
            </span>
          </div>

          <div className="canteen-cart-list">
            {cart.length > 0 ? (
              cart.map(item => (
                <div key={item.id} className="canteen-cart-row">
                  <div>
                    <div className="canteen-cart-row-title" style={{ maxWidth: '140px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.itemName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--primary-color)', fontWeight: 600 }}>₹{parseFloat(item.price).toFixed(2)}</div>
                  </div>
                  <div className="canteen-cart-qty">
                    <button 
                      onClick={() => updateCartQty(item.id, -1)}
                      className="canteen-qty-btn"
                    >
                      -
                    </button>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQty(item.id, 1)}
                      className="canteen-qty-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999', fontSize: '12px' }}>
                <span className="ti-shopping-cart" style={{ display: 'block', fontSize: '24px', marginBottom: '8px', color: '#ccc' }} />
                Cart is empty. Click items to add.
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          <div className="canteen-cart-summary">
            <div className="canteen-summary-line">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="canteen-summary-line">
              <span>Tax (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="canteen-summary-line total">
              <span>Total Cost</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Student Verification */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#555' }}>STUDENT WALLET VERIFICATION</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="number" 
                placeholder="Enter Student ID"
                value={checkoutStudentId}
                onChange={(e) => setCheckoutStudentId(e.target.value)}
                className="canteen-form-control"
                style={{ flex: 1 }}
              />
              <button 
                onClick={verifyStudent}
                className="primary_btn"
                style={{ padding: '8px 15px' }}
              >
                Verify
              </button>
            </div>

            {verificationResult && (
              <div style={{
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid',
                fontSize: '11px',
                background: verificationResult.success ? '#ECFDF5' : '#FEF2F2',
                borderColor: verificationResult.success ? '#A7F3D0' : '#FCA5A5',
                color: verificationResult.success ? '#065F46' : '#991B1B'
              }}>
                {verificationResult.success ? (
                  <div>
                    <strong style={{ display: 'block' }}>Verified Student: #{verificationResult.wallet.studentId}</strong>
                    <span>Balance: ₹{parseFloat(verificationResult.wallet.balance).toFixed(2)} • Limit: ₹{parseFloat(verificationResult.wallet.dailyLimit).toFixed(2)}</span>
                  </div>
                ) : (
                  <span>{verificationResult.message}</span>
                )}
              </div>
            )}
          </div>

          {checkoutError && (
            <div style={{
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #FCA5A5',
              background: '#FEF2F2',
              color: '#991B1B',
              fontSize: '11px',
              marginBottom: '15px'
            }}>
              {checkoutError}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || !verificationResult?.success}
            className="primary_btn"
            style={{ width: '100%', justifyContent: 'center', opacity: (cart.length === 0 || !verificationResult?.success) ? 0.6 : 1 }}
          >
            <span className="ti-check" style={{ marginRight: '6px' }} />
            Complete Checkout (Wallet)
          </button>
        </div>
      </div>

      {/* Receipt Modal */}
      {receipt && (
        <div className="canteen-popup-overlay">
          <div className="canteen-popup-content" style={{ maxWidth: '380px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ margin: 0, fontWeight: 700 }}>Receipt Details</h4>
              <button 
                onClick={() => setReceipt(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#999' }}
              >
                &times;
              </button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <div style={{ width: '40px', height: '40px', background: '#D1FAE5', color: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                <span className="ti-check" style={{ fontSize: '20px' }} />
              </div>
              <h4 style={{ margin: 0, fontWeight: 700 }}>Purchase Completed!</h4>
              <p style={{ margin: 0, fontSize: '11px', color: '#999' }}>Order ID: #{receipt.id}</p>
            </div>

            <div style={{ borderTop: '1px dashed #ddd', borderBottom: '1px dashed #ddd', padding: '12px 0', margin: '15px 0', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#777' }}>Student ID:</span>
                <span style={{ fontWeight: 600 }}>#{receipt.studentId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#777' }}>Date:</span>
                <span>{new Date(receipt.timestamp).toLocaleString()}</span>
              </div>

              <div style={{ borderTop: '1px solid #f1f1f1', paddingTop: '8px' }}>
                {receipt.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span>{item.itemName} x{item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#777' }}>Subtotal:</span>
                <span>₹{receipt.subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#777' }}>Tax (5%):</span>
                <span>₹{receipt.tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700, color: 'var(--primary-color)', borderTop: '1px solid #eee', paddingTop: '6px', marginTop: '4px' }}>
                <span style={{ color: '#333' }}>Total Paid:</span>
                <span>₹{receipt.total.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => window.print()}
                className="btn-secondary-outline"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <span className="ti-printer" style={{ marginRight: '6px' }} /> Print
              </button>
              <button 
                onClick={() => setReceipt(null)}
                className="primary_btn"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   SUB-COMPONENT: WALLETS
   ========================================== */
function CanteenWallets({ wallets, fetchWallets, categories, items }) {
  const [search, setSearch] = useState('');
  const [topUpWallet, setTopUpWallet] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [rulesWallet, setRulesWallet] = useState(null);
  
  const [restrictions, setRestrictions] = useState([]);
  const [blockType, setBlockType] = useState('category');
  const [selectedBlockId, setSelectedBlockId] = useState('');

  const filtered = wallets.filter(w => 
    w.studentId.toString().includes(search) || 
    (w.rfidCardUid && w.rfidCardUid.toLowerCase().includes(search.toLowerCase()))
  );

  const handleTopUp = async () => {
    if (!topUpWallet || !topUpAmount) return;
    try {
      await api.post(`/api/v1/canteen/wallets/${topUpWallet.studentId}/recharge`, null, {
        params: {
          amount: topUpAmount,
          paymentMethod: 'cash',
          rechargedBy: 'superadmin',
          notes: 'Admin Wallet Top-up'
        }
      });
      setTopUpWallet(null);
      setTopUpAmount('');
      fetchWallets();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleWalletActive = async (studentId) => {
    try {
      await api.post(`/api/v1/canteen/wallets/${studentId}/toggle-active`);
      fetchWallets();
    } catch (e) {
      console.error(e);
    }
  };

  const loadRestrictions = async (studentId) => {
    try {
      const res = await api.get(`/api/v1/canteen/restrictions/${studentId}`);
      setRestrictions(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const addRestriction = async () => {
    if (!rulesWallet || !selectedBlockId) return;
    try {
      const payload = {
        studentId: rulesWallet.studentId,
        restrictionType: blockType === 'category' ? 'category_block' : 'item_block',
        isActive: 1,
        schoolId: '1'
      };

      if (blockType === 'category') {
        payload.categoryId = parseInt(selectedBlockId);
      } else {
        payload.itemId = parseInt(selectedBlockId);
      }

      await api.post('/api/v1/canteen/restrictions', payload);
      loadRestrictions(rulesWallet.studentId);
      setSelectedBlockId('');
    } catch (e) {
      console.error(e);
    }
  };

  const deleteRestriction = async (id) => {
    try {
      await api.delete(`/api/v1/canteen/restrictions/${id}`);
      if (rulesWallet) loadRestrictions(rulesWallet.studentId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="pos-search-wrapper" style={{ marginBottom: 0 }}>
          <span className="ti-search" />
          <input 
            type="text" 
            placeholder="Search student ID or RFID UID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="canteen-form-control"
            style={{ width: '250px' }}
          />
        </div>
      </div>

      <WhiteCard bodyPadding={false}>
        <div className="table-responsive">
          <table className="data_table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>RFID Card Tag</th>
                <th>Current Balance</th>
                <th>Daily Spend Limit</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(w => (
                <tr key={w.id}>
                  <td style={{ fontWeight: 600 }}>Student #{w.studentId}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '12px', color: '#777' }}>{w.rfidCardUid || 'No Tag Assigned'}</td>
                  <td style={{ fontWeight: 700, color: '#10B981' }}>₹{parseFloat(w.balance).toFixed(2)}</td>
                  <td style={{ fontWeight: 600, color: '#555' }}>₹{parseFloat(w.dailyLimit).toFixed(2)}</td>
                  <td>
                    <Badge type={w.isActive === 1 ? 'success' : 'danger'}>
                      {w.isActive === 1 ? 'Active' : 'Locked'}
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button 
                        onClick={() => { setTopUpWallet(w); setTopUpAmount(''); }}
                        className="btn-secondary-outline"
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                      >
                        Top-Up
                      </button>
                      <button 
                        onClick={() => { setRulesWallet(w); loadRestrictions(w.studentId); }}
                        className="btn-secondary-outline"
                        style={{ padding: '4px 10px', fontSize: '11px', color: 'var(--primary-color)' }}
                      >
                        Restrictions
                      </button>
                      <button 
                        onClick={() => toggleWalletActive(w.studentId)}
                        className="btn-secondary-outline"
                        style={{ padding: '4px 10px', fontSize: '11px', color: w.isActive === 1 ? '#ef5f5f' : '#10B981' }}
                      >
                        {w.isActive === 1 ? 'Lock' : 'Unlock'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WhiteCard>

      {/* Top Up Modal */}
      {topUpWallet && (
        <div className="canteen-popup-overlay">
          <div className="canteen-popup-content" style={{ maxWidth: '350px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ margin: 0, fontWeight: 700 }}>Recharge Student Wallet</h4>
              <button 
                onClick={() => setTopUpWallet(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#999' }}
              >
                &times;
              </button>
            </div>
            <p style={{ margin: '0 0 15px', fontSize: '12px', color: '#666' }}>Add funds instantly to Student #{topUpWallet.studentId}'s daily account.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="canteen-form-group" style={{ marginBottom: 0 }}>
                <label>RECHARGE AMOUNT (₹)</label>
                <input 
                  type="number" 
                  placeholder="Enter amount"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="canteen-form-control"
                />
              </div>

              {/* Presets */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {[10, 20, 50, 100].map(amt => (
                  <button 
                    key={amt}
                    onClick={() => setTopUpAmount(amt.toString())}
                    className="btn-secondary-outline"
                    style={{ flex: 1, padding: '5px', fontSize: '11px', justifyContent: 'center' }}
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleTopUp}
                className="primary_btn"
                style={{ justifyContent: 'center', padding: '10px' }}
              >
                Confirm Top-Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restrictions / Rules Modal */}
      {rulesWallet && (
        <div className="canteen-popup-overlay">
          <div className="canteen-popup-content" style={{ maxWidth: '420px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ margin: 0, fontWeight: 700 }}>Allergens & Block Rules</h4>
              <button 
                onClick={() => setRulesWallet(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#999' }}
              >
                &times;
              </button>
            </div>
            <p style={{ margin: '0 0 15px', fontSize: '12px', color: '#666' }}>Configure blocked food items or entire categories for Student #{rulesWallet.studentId}.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '15px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                <button 
                  onClick={() => { setBlockType('category'); setSelectedBlockId(''); }}
                  style={{
                    background: 'none', border: 'none', paddingBottom: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                    color: blockType === 'category' ? 'var(--primary-color)' : '#666',
                    borderBottom: blockType === 'category' ? '2px solid var(--primary-color)' : 'none'
                  }}
                >
                  Block Category
                </button>
                <button 
                  onClick={() => { setBlockType('item'); setSelectedBlockId(''); }}
                  style={{
                    background: 'none', border: 'none', paddingBottom: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                    color: blockType === 'item' ? 'var(--primary-color)' : '#666',
                    borderBottom: blockType === 'item' ? '2px solid var(--primary-color)' : 'none'
                  }}
                >
                  Block Food Item
                </button>
              </div>

              {/* Blocks Config Form */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={selectedBlockId}
                  onChange={(e) => setSelectedBlockId(e.target.value)}
                  className="canteen-form-control"
                  style={{ flex: 1 }}
                >
                  <option value="">Select target...</option>
                  {blockType === 'category' ? (
                    categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                  ) : (
                    items.map(i => <option key={i.id} value={i.id}>{i.itemName}</option>)
                  )}
                </select>
                <button 
                  onClick={addRestriction}
                  className="primary_btn"
                  style={{ padding: '8px 15px' }}
                >
                  Add
                </button>
              </div>

              {/* Active Rules List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#555' }}>ACTIVE BLOCKS ({restrictions.length})</label>
                <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {restrictions.map(r => {
                    const labelName = r.restrictionType === 'category_block'
                      ? categories.find(c => c.id === r.categoryId)?.name || 'Category'
                      : items.find(i => i.id === r.itemId)?.itemName || 'Food Item';

                    return (
                      <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '4px', fontSize: '12px', color: '#991B1B' }}>
                        <span>
                          <strong style={{ marginRight: '5px' }}>[{r.restrictionType.replace('_', ' ').toUpperCase()}]</strong>
                          {labelName}
                        </span>
                        <button 
                          onClick={() => deleteRestriction(r.id)}
                          style={{ background: 'none', border: 'none', color: '#ef5f5f', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                  {restrictions.length === 0 && (
                    <p style={{ margin: 0, textAlign: 'center', padding: '20px 0', color: '#999', fontStyle: 'italic', fontSize: '12px' }}>No allergen or block rules set.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   SUB-COMPONENT: MENU ITEMS
   ========================================== */
function CanteenItems({ items, categories, fetchItems }) {
  const [search, setSearch] = useState('');
  const [itemModal, setItemModal] = useState(null);

  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCostPrice, setFormCostPrice] = useState('');
  const [formUnit, setFormUnit] = useState('piece');
  const [formIsVeg, setFormIsVeg] = useState(1);
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formStock, setFormStock] = useState('50');

  const filtered = items.filter(item => 
    item.itemName.toLowerCase().includes(search.toLowerCase()) || 
    (item.itemCode && item.itemCode.toLowerCase().includes(search.toLowerCase()))
  );

  const openForm = (action, item = null) => {
    if (action === 'edit' && item) {
      setItemModal(item);
      setFormName(item.itemName);
      setFormCode(item.itemCode || '');
      setFormDesc(item.description || '');
      setFormPrice(item.price.toString());
      setFormCostPrice(item.costPrice?.toString() || '0');
      setFormUnit(item.unit || 'piece');
      setFormIsVeg(item.isVegetarian);
      setFormCategoryId(item.categoryId?.toString() || '');
      setFormStock(item.stock?.toString() || '0');
    } else {
      setItemModal('create');
      setFormName('');
      setFormCode('');
      setFormDesc('');
      setFormPrice('');
      setFormCostPrice('0');
      setFormUnit('piece');
      setFormIsVeg(1);
      setFormCategoryId(categories[0]?.id?.toString() || '');
      setFormStock('50');
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        itemName: formName,
        itemCode: formCode,
        description: formDesc,
        price: parseFloat(formPrice),
        costPrice: parseFloat(formCostPrice),
        unit: formUnit,
        isVegetarian: formIsVeg,
        categoryId: parseInt(formCategoryId),
        stock: parseFloat(formStock)
      };

      if (itemModal !== 'create') {
        payload.id = itemModal.id;
      }

      await api.post('/api/v1/canteen/items', payload);
      setItemModal(null);
      fetchItems();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.post(`/api/v1/canteen/items/${id}/toggle-status`);
      fetchItems();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    try {
      await api.delete(`/api/v1/canteen/items/${id}`);
      fetchItems();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="pos-search-wrapper" style={{ marginBottom: 0 }}>
          <span className="ti-search" />
          <input 
            type="text" 
            placeholder="Search menu items..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="canteen-form-control"
            style={{ width: '250px' }}
          />
        </div>
        <button 
          onClick={() => openForm('create')}
          className="primary_btn"
        >
          <span className="ti-plus" /> Add Food Item
        </button>
      </div>

      <WhiteCard bodyPadding={false}>
        <div className="table-responsive">
          <table className="data_table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Selling Price</th>
                <th>Stock</th>
                <th>Dietary</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td>
                    <p style={{ margin: 0, fontWeight: 600 }}>{item.itemName}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#888' }}>{item.itemCode || 'No Code'}</p>
                  </td>
                  <td style={{ fontWeight: 600, color: '#555' }}>{item.categoryName || 'General'}</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary-color)' }}>₹{parseFloat(item.price).toFixed(2)}</td>
                  <td>
                    <Badge type={item.stock <= 10 ? 'danger' : 'success'}>
                      {item.stock} qty
                    </Badge>
                  </td>
                  <td>
                    <Badge type={item.isVegetarian === 1 ? 'success' : 'purple'}>
                      {item.isVegetarian === 1 ? 'Veg' : 'Non-Veg'}
                    </Badge>
                  </td>
                  <td>
                    <Badge type={item.isAvailable === 1 ? 'success' : 'danger'}>
                      {item.isAvailable === 1 ? 'Available' : 'Out of Stock'}
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button 
                        onClick={() => toggleStatus(item.id)}
                        className="btn-secondary-outline"
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                      >
                        Toggle Stock
                      </button>
                      <button 
                        onClick={() => openForm('edit', item)}
                        className="btn-secondary-outline"
                        style={{ padding: '4px 10px', fontSize: '11px', color: 'var(--primary-color)' }}
                      >
                        <span className="ti-pencil" /> Edit
                      </button>
                      <button 
                        onClick={() => deleteItem(item.id)}
                        className="btn-secondary-outline"
                        style={{ padding: '4px 10px', fontSize: '11px', color: '#ef5f5f' }}
                      >
                        <span className="ti-trash" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WhiteCard>

      {/* Item Create/Edit Modal */}
      {itemModal && (
        <div className="canteen-popup-overlay">
          <div className="canteen-popup-content" style={{ maxWidth: '450px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ margin: 0, fontWeight: 700 }}>
                {itemModal === 'create' ? 'Create New Food Item' : 'Edit Food Item'}
              </h4>
              <button 
                onClick={() => setItemModal(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#999' }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="canteen-row">
                <div className="canteen-col-6">
                  <div className="canteen-form-group">
                    <label>ITEM NAME</label>
                    <input 
                      type="text" 
                      value={formName} 
                      onChange={e => setFormName(e.target.value)}
                      className="canteen-form-control"
                    />
                  </div>
                </div>
                <div className="canteen-col-6">
                  <div className="canteen-form-group">
                    <label>ITEM CODE / SKU</label>
                    <input 
                      type="text" 
                      value={formCode} 
                      onChange={e => setFormCode(e.target.value)}
                      className="canteen-form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="canteen-form-group">
                <label>DESCRIPTION</label>
                <textarea 
                  value={formDesc} 
                  onChange={e => setFormDesc(e.target.value)}
                  className="canteen-form-control"
                  style={{ height: '60px' }}
                />
              </div>

              <div className="canteen-row">
                <div className="canteen-col-6">
                  <div className="canteen-form-group">
                    <label>SELLING PRICE (₹)</label>
                    <input 
                      type="number" 
                      value={formPrice} 
                      onChange={e => setFormPrice(e.target.value)}
                      className="canteen-form-control"
                    />
                  </div>
                </div>
                <div className="canteen-col-6">
                  <div className="canteen-form-group">
                    <label>COST PRICE (₹)</label>
                    <input 
                      type="number" 
                      value={formCostPrice} 
                      onChange={e => setFormCostPrice(e.target.value)}
                      className="canteen-form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="canteen-row">
                <div className="canteen-col-6">
                  <div className="canteen-form-group">
                    <label>UNIT (e.g. piece, plate)</label>
                    <input 
                      type="text" 
                      value={formUnit} 
                      onChange={e => setFormUnit(e.target.value)}
                      className="canteen-form-control"
                    />
                  </div>
                </div>
                <div className="canteen-col-6">
                  <div className="canteen-form-group">
                    <label>INITIAL STOCK QUANTITY</label>
                    <input 
                      type="number" 
                      value={formStock} 
                      onChange={e => setFormStock(e.target.value)}
                      className="canteen-form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="canteen-row">
                <div className="canteen-col-6">
                  <div className="canteen-form-group">
                    <label>CATEGORY</label>
                    <select
                      value={formCategoryId}
                      onChange={e => setFormCategoryId(e.target.value)}
                      className="canteen-form-control"
                    >
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="canteen-col-6">
                  <div className="canteen-form-group">
                    <label>DIETARY TYPE</label>
                    <select
                      value={formIsVeg}
                      onChange={e => setFormIsVeg(parseInt(e.target.value))}
                      className="canteen-form-control"
                    >
                      <option value="1">Vegetarian</option>
                      <option value="0">Non-Vegetarian</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSave}
                className="primary_btn"
                style={{ justifyContent: 'center', padding: '10px' }}
              >
                Save Food Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   SUB-COMPONENT: CATEGORIES
   ========================================== */
function CanteenCategories({ categories, fetchCategories }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('14:30');

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      const payload = {
        name,
        description: desc,
        activeStatus: 1,
        startTime: startTime + ":00",
        endTime: endTime + ":00"
      };

      await api.post('/api/v1/canteen/categories', payload);
      setName('');
      setDesc('');
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await api.delete(`/api/v1/canteen/categories/${id}`);
      fetchCategories();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="canteen-row">
      {/* Category List */}
      <div className="canteen-col-8" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h4 style={{ margin: 0, fontWeight: 700, textTransform: 'uppercase', fontSize: '13px', color: '#555' }}>Food & Meal Categories</h4>
        
        <div className="canteen-row">
          {categories.map(cat => (
            <div key={cat.id} className="canteen-col-6">
              <div className="white_card" style={{ padding: '15px', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                  onClick={() => deleteCategory(cat.id)}
                  style={{
                    position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none',
                    fontSize: '16px', color: '#999', cursor: 'pointer', transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#ef5f5f'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#999'}
                >
                  &times;
                </button>

                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: '#333' }}>{cat.name}</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#777' }}>{cat.description || 'No description provided.'}</p>
                </div>

                {cat.startTime && (
                  <div style={{
                    marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px',
                    fontSize: '11px', fontWeight: 600, color: 'var(--primary-color)',
                    background: '#fcfaff', border: '1px solid #f3eeff', padding: '3px 8px', borderRadius: '4px', width: 'max-content'
                  }}>
                    <span className="ti-time" />
                    Available: {cat.startTime.substring(0, 5)} - {cat.endTime.substring(0, 5)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Form */}
      <div className="canteen-col-4">
        <WhiteCard title="Add Meal Category">
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="canteen-form-group">
              <label>CATEGORY NAME</label>
              <input 
                type="text" 
                placeholder="e.g. Breakfast, Snacks"
                value={name}
                onChange={e => setName(e.target.value)}
                className="canteen-form-control"
              />
            </div>

            <div className="canteen-form-group">
              <label>DESCRIPTION</label>
              <textarea 
                placeholder="Meal category details..."
                value={desc}
                onChange={e => setDesc(e.target.value)}
                className="canteen-form-control"
                style={{ height: '60px' }}
              />
            </div>

            <div className="canteen-row">
              <div className="canteen-col-6">
                <div className="canteen-form-group">
                  <label>START TIME</label>
                  <input 
                    type="time" 
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="canteen-form-control"
                  />
                </div>
              </div>
              <div className="canteen-col-6">
                <div className="canteen-form-group">
                  <label>END TIME</label>
                  <input 
                    type="time" 
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="canteen-form-control"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="primary_btn"
              style={{ justifyContent: 'center', padding: '10px' }}
            >
              Create Category
            </button>
          </form>
        </WhiteCard>
      </div>
    </div>
  );
}

/* ==========================================
   SUB-COMPONENT: TRANSACTIONS LIST
   ========================================== */
function CanteenTransactions({ transactions, fetchTransactions, wallets, items }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeTxDetail, setActiveTxDetail] = useState(null);
  const [purchasedItems, setPurchasedItems] = useState([]);

  useEffect(() => {
    if (activeTxDetail && activeTxDetail.type === 'purchase' && activeTxDetail.referenceNo) {
      api.get(`/api/v1/canteen/orders/${activeTxDetail.referenceNo}/items`)
        .then(res => setPurchasedItems(res.data || []))
        .catch(err => {
          console.error(err);
          setPurchasedItems([]);
        });
    } else {
      setPurchasedItems([]);
    }
  }, [activeTxDetail]);

  const filtered = transactions.filter(t => {
    const matchesSearch = (t.studentId && t.studentId.toString().includes(search)) || (t.notes && t.notes.toLowerCase().includes(search.toLowerCase()));
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleRefund = async (id) => {
    if (!window.confirm("Refund this purchase? This will restore student balance and item stock counts.")) return;
    try {
      await api.post(`/api/v1/canteen/transactions/${id}/refund`);
      setActiveTxDetail(null);
      fetchTransactions();
    } catch (e) {
      alert("Refund failed: " + (e.response?.data?.message || e.message));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div className="pos-search-wrapper" style={{ marginBottom: 0 }}>
          <span className="ti-search" />
          <input 
            type="text" 
            placeholder="Search Student ID or notes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="canteen-form-control"
            style={{ width: '250px' }}
          />
        </div>

        <div style={{ display: 'inline-flex', gap: '8px' }}>
          {['all', 'purchase', 'recharge', 'refund'].map(type => (
            <button 
              key={type}
              onClick={() => setFilterType(type)}
              className={`canteen-cat-btn ${filterType === type ? 'active' : ''}`}
            >
              {type.toUpperCase()}S
            </button>
          ))}
        </div>
      </div>

      <WhiteCard bodyPadding={false}>
        <div className="table-responsive">
          <table className="data_table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Student ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Balance After</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold' }}>#{t.id}</td>
                  <td style={{ fontWeight: 600 }}>{t.studentId ? `Student #${t.studentId}` : 'Guest / Walking'}</td>
                  <td>
                    <Badge type={t.type === 'purchase' ? 'purple' : t.type === 'recharge' ? 'success' : 'danger'}>
                      {t.type}
                    </Badge>
                  </td>
                  <td style={{ fontWeight: 700, color: t.type === 'purchase' ? '#333' : '#10B981' }}>
                    ₹{parseFloat(t.amount).toFixed(2)}
                  </td>
                  <td style={{ color: '#555' }}>₹{parseFloat(t.balanceAfter).toFixed(2)}</td>
                  <td style={{ color: '#777', fontSize: '11px' }}>{new Date(t.createdAt).toLocaleString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      onClick={() => setActiveTxDetail(t)}
                      className="btn-secondary-outline"
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WhiteCard>

      {/* Transaction Details Modal */}
      {activeTxDetail && (
        <div className="canteen-popup-overlay">
          <div className="canteen-popup-content" style={{ maxWidth: '365px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h4 style={{ margin: 0, fontWeight: 700 }}>Receipt Details</h4>
              <button 
                onClick={() => setActiveTxDetail(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#999' }}
              >
                &times;
              </button>
            </div>
            
            <p style={{ margin: '0 0 15px', fontSize: '11px', color: '#999', fontFamily: 'monospace' }}>Tx ID: #{activeTxDetail.id}</p>

            <div style={{ borderTop: '1px dashed #ddd', borderBottom: '1px dashed #ddd', padding: '12px 0', margin: '15px 0', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#777' }}>Transaction Type:</span> <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{activeTxDetail.type}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#777' }}>Student Wallet:</span> <span style={{ fontWeight: 600 }}>{activeTxDetail.studentId ? `Student #${activeTxDetail.studentId}` : 'Guest / Walking'}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#777' }}>Payment Option:</span> <span style={{ textTransform: 'uppercase' }}>{activeTxDetail.paymentMethod || 'Wallet'}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#777' }}>Timestamp:</span> <span>{new Date(activeTxDetail.createdAt).toLocaleString()}</span></div>
              
              {activeTxDetail.type === 'purchase' && purchasedItems.length > 0 && (
                <div style={{ borderTop: '1px solid #f1f1f1', paddingTop: '8px', marginTop: '4px' }}>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#999', textTransform: 'uppercase', marginBottom: '6px' }}>PURCHASE DETAILS</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {purchasedItems.map(item => {
                      const menuItem = items.find(m => String(m.id) === String(item.menuItemId));
                      const name = menuItem ? menuItem.itemName : `Item #${item.menuItemId}`;
                      return (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#333' }}>
                          <span>{item.quantity}x {name}</span>
                          <span>₹{(parseFloat(item.priceOrdered || 0) * item.quantity).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#777' }}>Transaction Value:</span> <span style={{ fontWeight: 600 }}>₹{parseFloat(activeTxDetail.amount).toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: 'var(--primary-color)' }}><span style={{ color: '#333' }}>Post Balance:</span> <span>₹{parseFloat(activeTxDetail.balanceAfter).toFixed(2)}</span></div>
            </div>

            {activeTxDetail.type === 'purchase' && (
              <button 
                onClick={() => handleRefund(activeTxDetail.id)}
                className="primary_btn"
                style={{ width: '100%', justifyContent: 'center', background: '#ef5f5f' }}
              >
                <span className="ti-reload" style={{ marginRight: '6px' }} /> Issue Refund / Cancel Sale
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   SUB-COMPONENT: KEYBOARD COMMAND PALETTE
   ========================================== */
function CommandPalette({ setActiveTab, wallets, items, fetchWallets }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [topUpTarget, setTopUpTarget] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const handleTopUpSubmit = async () => {
    if (!topUpTarget || !topUpAmount) return;
    try {
      await api.post(`/api/v1/canteen/wallets/${topUpTarget.studentId}/recharge`, null, {
        params: {
          amount: topUpAmount,
          paymentMethod: 'cash',
          rechargedBy: 'superadmin'
        }
      });
      setIsOpen(false);
      setTopUpTarget(null);
      setTopUpAmount('');
      fetchWallets();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
      <div className="bg-white rounded max-w-lg w-full overflow-hidden border shadow-2xl flex flex-col max-h-[450px]">
        <div className="p-4 border-b flex items-center gap-2">
          <Command className="h-4.5 w-4.5 text-purple-600 animate-spin" />
          <input 
            type="text" 
            placeholder="Type 'pos', 'wallets', 'recharge student'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-xs border-none focus:outline-none focus:ring-0 bg-white"
            autoFocus
          />
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 text-xs font-bold"
          >
            Esc
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="space-y-1">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Navigation Shortcuts</h4>
            {[
              { label: 'Go to POS Terminal', tab: 'pos', desc: 'Place orders and scan students' },
              { label: 'Go to Student Wallets', tab: 'wallets', desc: 'Top up balances & restrictions' },
              { label: 'Go to Menu Catalog', tab: 'items', desc: 'Add food items and stock control' }
            ].filter(nav => nav.label.toLowerCase().includes(query.toLowerCase())).map((nav, idx) => (
              <button 
                key={idx}
                onClick={() => { setActiveTab(nav.tab); setIsOpen(false); }}
                className="w-full text-left px-3 py-2 rounded hover:bg-purple-50 hover:text-purple-700 flex justify-between items-center text-xs group"
              >
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-purple-700">{nav.label}</p>
                  <p className="text-[10px] text-gray-500">{nav.desc}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>

          {query.toLowerCase().includes('recharge') || query.toLowerCase().includes('top') ? (
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quick Wallet Recharge</h4>
              <div className="space-y-2">
                {wallets.slice(0, 3).map(w => (
                  <div key={w.id} className="p-3 bg-gray-50 border rounded flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-gray-900">Student #{w.studentId}</p>
                      <p className="text-[10px] text-gray-500">Balance: ₹{parseFloat(w.balance).toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => setTopUpTarget(w)}
                      className="px-3 py-1 bg-purple-600 text-white rounded font-bold hover:bg-purple-700"
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {topUpTarget && (
            <div className="p-4 bg-purple-50 rounded border border-purple-100 space-y-3">
              <p className="text-xs font-bold text-purple-900">Recharging Student #{topUpTarget.studentId}</p>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  placeholder="Recharge Amount (₹)"
                  value={topUpAmount}
                  onChange={e => setTopUpAmount(e.target.value)}
                  className="flex-1 border border-purple-200 rounded px-3 py-1 text-xs focus:outline-none bg-white"
                />
                <button 
                  onClick={handleTopUpSubmit}
                  className="primary_btn py-1 px-4 text-xs"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
