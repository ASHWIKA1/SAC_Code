import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Coffee, ShoppingCart, CreditCard, Layers, BookOpen, Clock, 
  History, Search, ShieldAlert, CheckCircle2, AlertTriangle, 
  RotateCcw, DollarSign, Plus, X, Command, ArrowRight, Printer, AlertCircle, Sparkles, Edit2, Trash2
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { PageHeader, WhiteCard, Badge } from '../../components/UI';
import api from '../../utils/api';

export default function CanteenPage({ active }) {
  const navigate = useNavigate();
  const activeTab = active || 'dashboard';
  const setActiveTab = (tabId) => navigate(`/modules/canteen/${tabId}`);

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
    <div className="space-y-6">
      <PageHeader 
        title="Canteen Management" 
        breadcrumbs={[{ label: 'Modules' }, { label: 'Canteen' }]}
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
            <CanteenDashboard 
              stats={stats} 
              setActiveTab={setActiveTab} 
              fetchStats={fetchStats}
            />
          )}
          {activeTab === 'pos' && (
            <CanteenPos 
              items={items} 
              categories={categories} 
              wallets={wallets} 
              refreshData={fetchStats}
            />
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
    <div className="space-y-6">
      {/* Stat Cards matching style of InfixEdu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Today's Revenue", value: `₹${parseFloat(stats.todayRevenue || 0).toFixed(2)}`, icon: 'ti-wallet', color: 'purple', action: () => setActiveTab('transactions') },
          { title: 'Completed Orders', value: stats.completedOrders || 0, icon: 'ti-shopping-cart', color: 'blue', action: () => setActiveTab('pos') },
          { title: 'Active Wallets', value: stats.activeWallets || 0, icon: 'ti-credit-card', color: 'green', action: () => setActiveTab('wallets') },
          { title: 'Low Stock Items', value: stats.lowStockAlerts || 0, icon: 'ti-alert', color: 'red', action: () => setActiveTab('items') }
        ].map((card, idx) => (
          <div 
            key={idx} 
            onClick={card.action}
            className="stat_card cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className={`stat_icon_wrap ${card.color}`}>
              <span className={card.icon} style={{ fontSize: 22 }} />
            </div>
            <div className="stat_info">
              <div className="value">{card.value}</div>
              <div className="label">{card.title}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <WhiteCard title="Live Activity Stream">
            <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto pr-1">
              {stats.recentActivities && stats.recentActivities.length > 0 ? (
                stats.recentActivities.map((act) => (
                  <div key={act.id} className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        act.type === 'purchase' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'
                      }`}>
                        {act.type === 'purchase' ? <ShoppingCart className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {act.type === 'purchase' ? 'POS Purchase Complete' : 'Wallet Recharge'}
                        </p>
                        <p className="text-xs text-gray-500">Student ID: #{act.studentId} • {act.notes || 'No description'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${
                        act.type === 'purchase' ? 'text-gray-900' : 'text-emerald-600'
                      }`}>
                        {act.type === 'purchase' ? '-' : '+'}₹{parseFloat(act.amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">{new Date(act.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Coffee className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  No transactions completed today.
                </div>
              )}
            </div>
          </WhiteCard>
        </div>

        {/* Quick actions */}
        <WhiteCard title="Quick Operations">
          <div className="space-y-3">
            {[
              { label: 'POS checkout terminal', desc: 'Scan items & checkout student', tab: 'pos', icon: ShoppingCart },
              { label: 'Recharge a wallet', desc: 'Top up student daily balance', tab: 'wallets', icon: CreditCard },
              { label: 'Meal Categories', desc: 'Manage time schedules', tab: 'categories', icon: Layers }
            ].map((op, idx) => {
              const Icon = op.icon;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(op.tab)}
                  className="w-full text-left p-3.5 rounded border border-gray-100 hover:bg-purple-50/50 hover:border-purple-200 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded text-gray-600 group-hover:bg-white transition-colors">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{op.label}</p>
                      <p className="text-xs text-gray-500">{op.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-transform group-hover:translate-x-1" />
                </button>
              );
            })}
          </div>
        </WhiteCard>
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      {/* Products list */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <span className="ti-search absolute left-3 top-3.5 text-gray-400 text-sm" />
            <input 
              type="text" 
              placeholder="Search items or codes..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded focus:outline-none focus:border-purple-600 bg-white"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto w-full sm:w-auto pb-1">
            <button 
              onClick={() => setSelectedCat('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${
                selectedCat === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Meals
            </button>
            {activeCategories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCat(cat.id.toString())}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors whitespace-nowrap ${
                  selectedCat === cat.id.toString() ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Item Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredItems.map(item => {
            const outOfStock = item.isAvailable !== 1 || item.stock <= 0;
            return (
              <div 
                key={item.id}
                onClick={() => !outOfStock && addToCart(item)}
                className={`bg-white rounded border border-gray-200 overflow-hidden transition-all duration-200 ${
                  outOfStock 
                    ? 'opacity-60 cursor-not-allowed filter grayscale' 
                    : 'cursor-pointer hover:shadow hover:border-purple-400 active:scale-98'
                }`}
              >
                <div className="h-32 bg-gray-50 relative">
                  {item.image ? (
                    <img src={item.image} alt={item.itemName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Coffee className="h-10 w-10" />
                    </div>
                  )}
                  {outOfStock && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      OUT OF STOCK
                    </span>
                  )}
                  {item.isVegetarian === 1 && (
                    <span className="absolute bottom-2 left-2 bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      VEG
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-bold text-gray-900 truncate">{item.itemName}</h4>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-black text-purple-600">₹{parseFloat(item.price).toFixed(2)}</p>
                    <p className="text-[10px] text-gray-400 font-medium">Stock: {item.stock}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart Drawer */}
      <div className="bg-white rounded border border-gray-200 overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
          <ShoppingCart className="h-4.5 w-4.5 text-purple-600" />
          <h3 className="font-bold text-gray-900 text-sm">Current Order</h3>
          <span className="ml-auto bg-purple-100 text-purple-800 text-[11px] px-2 py-0.5 rounded-full font-bold">
            {cart.reduce((sum, i) => sum + i.quantity, 0)} Items
          </span>
        </div>

        <div className="flex-1 divide-y divide-gray-100 overflow-y-auto max-h-[300px] p-2">
          {cart.length > 0 ? (
            cart.map(item => (
              <div key={item.id} className="py-2.5 flex justify-between items-center px-2">
                <div className="max-w-[150px]">
                  <p className="text-xs font-semibold text-gray-800 truncate">{item.itemName}</p>
                  <p className="text-[11px] text-purple-600 font-bold">₹{parseFloat(item.price).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateCartQty(item.id, -1)}
                    className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold w-5 h-5 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-gray-900 w-5 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateCartQty(item.id, 1)}
                    className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold w-5 h-5 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-gray-400 text-xs">
              <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              Cart is empty. Click items to add.
            </div>
          )}
        </div>

        {/* Pricing Summary */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-4">
          <div className="space-y-1.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-sm pt-1.5 border-t border-dashed border-gray-200">
              <span>Total Cost</span>
              <span className="text-purple-600">₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Student Verification */}
          <div className="space-y-2 pt-1">
            <label className="text-[10px] font-bold text-gray-600 block">STUDENT WALLET VERIFICATION</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Enter Student ID"
                value={checkoutStudentId}
                onChange={(e) => setCheckoutStudentId(e.target.value)}
                className="flex-1 border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-purple-600 bg-white"
              />
              <button 
                onClick={verifyStudent}
                className="bg-gray-800 text-white rounded px-4 py-1.5 text-xs font-bold hover:bg-gray-900"
              >
                Verify
              </button>
            </div>

            {verificationResult && (
              <div className={`p-2.5 rounded border text-[11px] flex items-center gap-2 ${
                verificationResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {verificationResult.success ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <div>
                      <p className="font-bold">Verified: #{verificationResult.wallet.studentId}</p>
                      <p>Balance: ₹{parseFloat(verificationResult.wallet.balance).toFixed(2)} • Daily Cap: ₹{parseFloat(verificationResult.wallet.dailyLimit).toFixed(2)}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span>{verificationResult.message}</span>
                  </>
                )}
              </div>
            )}
          </div>

          {checkoutError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded text-xs flex items-center gap-2">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{checkoutError}</span>
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || !verificationResult?.success}
            className="primary_btn w-full flex items-center justify-center gap-2 py-2"
          >
            <CreditCard className="h-4 w-4" />
            Complete Checkout (Wallet)
          </button>
        </div>
      </div>

      {/* Receipt Modal */}
      {receipt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-sm w-full p-6 space-y-4 border shadow-2xl relative">
            <button 
              onClick={() => setReceipt(null)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="text-md font-bold text-gray-900">Purchase Completed!</h3>
              <p className="text-[11px] text-gray-400">Order ID: #{receipt.id}</p>
            </div>

            <div className="border-t border-b border-dashed border-gray-200 py-3 space-y-2 text-xs">
              <p className="flex justify-between"><span className="text-gray-500">Student:</span> <span className="font-bold">#{receipt.studentId}</span></p>
              <p className="flex justify-between"><span className="text-gray-500">Date:</span> <span>{new Date(receipt.timestamp).toLocaleString()}</span></p>
              
              <div className="pt-2 space-y-1.5 border-t border-gray-100">
                {receipt.items.map(item => (
                  <p key={item.id} className="flex justify-between text-gray-800">
                    <span>{item.itemName} x{item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <p className="flex justify-between"><span className="text-gray-500">Subtotal:</span> <span>₹{receipt.subtotal.toFixed(2)}</span></p>
              <p className="flex justify-between"><span className="text-gray-500">Tax (5%):</span> <span>₹{receipt.tax.toFixed(2)}</span></p>
              <p className="flex justify-between text-sm font-black text-purple-600 pt-1.5 border-t"><span className="text-gray-900">Total Paid:</span> <span>₹{receipt.total.toFixed(2)}</span></p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => window.print()}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 rounded text-xs flex items-center justify-center gap-1.5 border"
              >
                <Printer className="h-3.5 w-3.5" /> Print
              </button>
              <button 
                onClick={() => setReceipt(null)}
                className="primary_btn flex-1 py-2 rounded text-xs"
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-xs">
          <span className="ti-search absolute left-3 top-3 text-gray-400 text-xs" />
          <input 
            type="text" 
            placeholder="Search student ID or RFID UID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-1.5 w-full border border-gray-200 rounded focus:outline-none focus:border-purple-600 bg-white"
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
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(w => (
                <tr key={w.id}>
                  <td className="font-semibold text-gray-900">Student #{w.studentId}</td>
                  <td className="font-mono text-xs text-gray-500">{w.rfidCardUid || 'No Tag Assigned'}</td>
                  <td className="font-bold text-emerald-600">₹{parseFloat(w.balance).toFixed(2)}</td>
                  <td className="font-semibold text-gray-600">₹{parseFloat(w.dailyLimit).toFixed(2)}</td>
                  <td>
                    <Badge type={w.isActive === 1 ? 'success' : 'danger'}>
                      {w.isActive === 1 ? 'Active' : 'Locked'}
                    </Badge>
                  </td>
                  <td className="text-right space-x-2">
                    <button 
                      onClick={() => { setTopUpWallet(w); setTopUpAmount(''); }}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded border border-emerald-100 transition-colors"
                    >
                      Top-Up
                    </button>
                    <button 
                      onClick={() => { setRulesWallet(w); loadRestrictions(w.studentId); }}
                      className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded border border-purple-100 transition-colors"
                    >
                      Restrictions
                    </button>
                    <button 
                      onClick={() => toggleWalletActive(w.studentId)}
                      className={`px-2.5 py-1 text-xs font-bold rounded border transition-colors ${
                        w.isActive === 1 
                          ? 'bg-red-50 hover:bg-red-100 text-red-700 border-red-100' 
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-100'
                      }`}
                    >
                      {w.isActive === 1 ? 'Lock' : 'Unlock'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WhiteCard>

      {/* Top Up Modal */}
      {topUpWallet && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-sm w-full p-6 space-y-4 border shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setTopUpWallet(null)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-sm font-bold text-gray-900">Recharge Student Wallet</h3>
            <p className="text-xs text-gray-500">Add funds instantly to Student #{topUpWallet.studentId}'s daily account.</p>
            
            <div className="space-y-4">
              <div className="space-y-1 text-xs">
                <label className="font-bold text-gray-600 block">RECHARGE AMOUNT (₹)</label>
                <input 
                  type="number" 
                  placeholder="Enter amount"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full border rounded px-3 py-1.5 focus:outline-none focus:border-purple-600 bg-white"
                />
              </div>

              {/* Presets */}
              <div className="flex gap-2">
                {[10, 20, 50, 100].map(amt => (
                  <button 
                    key={amt}
                    onClick={() => setTopUpAmount(amt.toString())}
                    className="flex-1 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded border"
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleTopUp}
                className="primary_btn w-full py-2 text-xs"
              >
                Confirm Top-Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restrictions / Rules Modal */}
      {rulesWallet && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-md w-full p-6 space-y-4 border shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setRulesWallet(null)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-sm font-bold text-gray-900">Student Allergens & Block Rules</h3>
            <p className="text-xs text-gray-500">Configure blocked food items or entire categories for Student #{rulesWallet.studentId}.</p>

            <div className="space-y-4 text-xs">
              <div className="flex gap-4 border-b pb-2">
                <button 
                  onClick={() => { setBlockType('category'); setSelectedBlockId(''); }}
                  className={`font-semibold pb-1.5 border-b-2 transition-colors ${
                    blockType === 'category' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'
                  }`}
                >
                  Block Category
                </button>
                <button 
                  onClick={() => { setBlockType('item'); setSelectedBlockId(''); }}
                  className={`font-semibold pb-1.5 border-b-2 transition-colors ${
                    blockType === 'item' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500'
                  }`}
                >
                  Block Food Item
                </button>
              </div>

              {/* Blocks Config Form */}
              <div className="flex gap-2">
                <select
                  value={selectedBlockId}
                  onChange={(e) => setSelectedBlockId(e.target.value)}
                  className="flex-1 border rounded px-3 py-1.5 focus:outline-none focus:border-purple-600 bg-white"
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
                  className="primary_btn py-1.5 px-4 text-xs"
                >
                  Add
                </button>
              </div>

              {/* Active Rules List */}
              <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                <label className="font-bold text-gray-600 block">ACTIVE BLOCKS ({restrictions.length})</label>
                {restrictions.map(r => {
                  const labelName = r.restrictionType === 'category_block'
                    ? categories.find(c => c.id === r.categoryId)?.name || 'Category'
                    : items.find(i => i.id === r.itemId)?.itemName || 'Food Item';

                  return (
                    <div key={r.id} className="p-2 bg-red-50 border border-red-100 rounded flex justify-between items-center text-red-800">
                      <span>
                        <span className="font-bold uppercase mr-1.5">[{r.restrictionType.replace('_', ' ')}]</span>
                        {labelName}
                      </span>
                      <button 
                        onClick={() => deleteRestriction(r.id)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
                {restrictions.length === 0 && (
                  <p className="text-center py-6 text-gray-400 italic">No allergen or block rules set for this student.</p>
                )}
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-xs">
          <span className="ti-search absolute left-3 top-3 text-gray-400 text-xs" />
          <input 
            type="text" 
            placeholder="Search menu items..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-1.5 w-full border border-gray-200 rounded focus:outline-none focus:border-purple-600 bg-white"
          />
        </div>
        <button 
          onClick={() => openForm('create')}
          className="primary_btn py-1.5 px-4 rounded text-xs flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" /> Add Food Item
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
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td>
                    <p className="font-semibold text-gray-900">{item.itemName}</p>
                    <p className="text-xs text-gray-400">{item.itemCode || 'No Code'}</p>
                  </td>
                  <td className="text-gray-600 font-semibold">{item.categoryName || 'General'}</td>
                  <td className="font-bold text-purple-600">₹{parseFloat(item.price).toFixed(2)}</td>
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
                  <td className="text-right space-x-2">
                    <button 
                      onClick={() => toggleStatus(item.id)}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded"
                    >
                      Toggle Stock
                    </button>
                    <button 
                      onClick={() => openForm('edit', item)}
                      className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded border border-purple-100"
                    >
                      <span className="ti-pencil" /> Edit
                    </button>
                    <button 
                      onClick={() => deleteItem(item.id)}
                      className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded border border-red-100"
                    >
                      <span className="ti-trash" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WhiteCard>

      {/* Item Create/Edit Modal */}
      {itemModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-md w-full p-6 space-y-4 border shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setItemModal(null)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-sm font-bold text-gray-900">
              {itemModal === 'create' ? 'Create New Food Item' : 'Edit Food Item'}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 block">ITEM NAME</label>
                  <input 
                    type="text" 
                    value={formName} 
                    onChange={e => setFormName(e.target.value)}
                    className="w-full border rounded px-3 py-1.5 focus:outline-none focus:border-purple-600 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 block">ITEM CODE / SKU</label>
                  <input 
                    type="text" 
                    value={formCode} 
                    onChange={e => setFormCode(e.target.value)}
                    className="w-full border rounded px-3 py-1.5 focus:outline-none focus:border-purple-600 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600 block">DESCRIPTION</label>
                <textarea 
                  value={formDesc} 
                  onChange={e => setFormDesc(e.target.value)}
                  className="w-full border rounded px-3 py-1.5 focus:outline-none focus:border-purple-600 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 block">SELLING PRICE (₹)</label>
                  <input 
                    type="number" 
                    value={formPrice} 
                    onChange={e => setFormPrice(e.target.value)}
                    className="w-full border rounded px-3 py-1.5 focus:outline-none focus:border-purple-600 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 block">COST PRICE (₹)</label>
                  <input 
                    type="number" 
                    value={formCostPrice} 
                    onChange={e => setFormCostPrice(e.target.value)}
                    className="w-full border rounded px-3 py-1.5 focus:outline-none focus:border-purple-600 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 block">UNIT (e.g. piece, plate)</label>
                  <input 
                    type="text" 
                    value={formUnit} 
                    onChange={e => setFormUnit(e.target.value)}
                    className="w-full border rounded px-3 py-1.5 focus:outline-none focus:border-purple-600 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 block">INITIAL STOCK QUANTITY</label>
                  <input 
                    type="number" 
                    value={formStock} 
                    onChange={e => setFormStock(e.target.value)}
                    className="w-full border rounded px-3 py-1.5 focus:outline-none focus:border-purple-600 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 block">CATEGORY</label>
                  <select
                    value={formCategoryId}
                    onChange={e => setFormCategoryId(e.target.value)}
                    className="w-full border rounded px-3 py-1.5 focus:outline-none focus:border-purple-600 bg-white"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 block">DIETARY TYPE</label>
                  <select
                    value={formIsVeg}
                    onChange={e => setFormIsVeg(parseInt(e.target.value))}
                    className="w-full border rounded px-3 py-1.5 focus:outline-none focus:border-purple-600 bg-white"
                  >
                    <option value="1">Vegetarian</option>
                    <option value="0">Non-Vegetarian</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleSave}
                className="primary_btn w-full py-2.5 text-xs"
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Category List */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase">Food & Meal Categories</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white rounded border border-gray-200 p-5 shadow-sm space-y-3 relative group">
              <button 
                onClick={() => deleteCategory(cat.id)}
                className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-1">
                <h4 className="font-bold text-gray-900 text-sm">{cat.name}</h4>
                <p className="text-xs text-gray-500">{cat.description || 'No description provided.'}</p>
              </div>

              {cat.startTime && (
                <div className="flex items-center gap-1.5 text-[11px] text-purple-600 bg-purple-50 px-2 py-1 rounded w-max font-bold border border-purple-100">
                  <Clock className="h-3.5 w-3.5" />
                  Available: {cat.startTime.substring(0, 5)} - {cat.endTime.substring(0, 5)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Category Form */}
      <WhiteCard title="Add Meal Category">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-gray-600 block">CATEGORY NAME</label>
            <input 
              type="text" 
              placeholder="e.g. Breakfast, Snacks"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-purple-600 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-600 block">DESCRIPTION</label>
            <textarea 
              placeholder="Meal category details..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:border-purple-600 bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-gray-600 block">START TIME</label>
              <input 
                type="time" 
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:border-purple-600 bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-gray-600 block">END TIME</label>
              <input 
                type="time" 
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:border-purple-600 bg-white"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="primary_btn w-full py-2.5 text-xs font-bold"
          >
            Create Category
          </button>
        </form>
      </WhiteCard>
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

  const filtered = transactions.filter(t => {
    const matchesSearch = t.studentId.toString().includes(search) || (t.notes && t.notes.toLowerCase().includes(search.toLowerCase()));
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <span className="ti-search absolute left-3 top-3 text-gray-400 text-xs" />
          <input 
            type="text" 
            placeholder="Search Student ID or notes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-1.5 w-full border border-gray-200 rounded focus:outline-none focus:border-purple-600 bg-white"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'purchase', 'recharge', 'refund'].map(type => (
            <button 
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-xs font-semibold rounded capitalize transition-colors ${
                filterType === type ? 'bg-purple-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
              }`}
            >
              {type}s
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
                <th className="text-right">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td className="font-mono text-xs font-bold text-gray-500">#{t.id}</td>
                  <td className="font-semibold text-gray-900">Student #{t.studentId}</td>
                  <td>
                    <Badge type={t.type === 'purchase' ? 'purple' : t.type === 'recharge' ? 'success' : 'danger'}>
                      {t.type}
                    </Badge>
                  </td>
                  <td className={`font-bold ${
                    t.type === 'purchase' ? 'text-gray-900' : 'text-emerald-600'
                  }`}>
                    ₹{parseFloat(t.amount).toFixed(2)}
                  </td>
                  <td className="text-gray-500">₹{parseFloat(t.balanceAfter).toFixed(2)}</td>
                  <td className="text-gray-400 text-xs">{new Date(t.createdAt).toLocaleString()}</td>
                  <td className="text-right">
                    <button 
                      onClick={() => setActiveTxDetail(t)}
                      className="text-xs font-bold text-purple-600 hover:underline"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-sm w-full p-6 space-y-4 border shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setActiveTxDetail(null)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="text-sm font-bold text-gray-900">Receipt Details</h3>
            <p className="text-[11px] text-gray-400 font-mono">Tx ID: #{activeTxDetail.id}</p>

            <div className="space-y-2.5 text-xs border-t border-b border-dashed py-3">
              <p className="flex justify-between"><span className="text-gray-500">Transaction Type:</span> <span className="font-bold capitalize">{activeTxDetail.type}</span></p>
              <p className="flex justify-between"><span className="text-gray-500">Student Wallet:</span> <span className="font-bold">Student #{activeTxDetail.studentId}</span></p>
              <p className="flex justify-between"><span className="text-gray-500">Payment Option:</span> <span className="uppercase">{activeTxDetail.paymentMethod || 'Wallet'}</span></p>
              <p className="flex justify-between"><span className="text-gray-500">Timestamp:</span> <span>{new Date(activeTxDetail.createdAt).toLocaleString()}</span></p>
              
              {activeTxDetail.itemId && (
                <div className="pt-2 border-t mt-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">PURCHASE ITEM</p>
                  <p className="flex justify-between font-bold text-gray-900 mt-1">
                    <span>Item ID #{activeTxDetail.itemId} (x{activeTxDetail.quantity})</span>
                    <span>₹{parseFloat(activeTxDetail.amount).toFixed(2)}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="text-xs space-y-1">
              <p className="flex justify-between"><span className="text-gray-500">Transaction Value:</span> <span className="font-bold">₹{parseFloat(activeTxDetail.amount).toFixed(2)}</span></p>
              <p className="flex justify-between"><span className="text-gray-500">Post Balance:</span> <span className="font-bold text-purple-600">₹{parseFloat(activeTxDetail.balanceAfter).toFixed(2)}</span></p>
            </div>

            {activeTxDetail.type === 'purchase' && (
              <button 
                onClick={() => handleRefund(activeTxDetail.id)}
                className="w-full bg-red-600 text-white font-bold py-2 rounded text-xs flex items-center justify-center gap-1 hover:bg-red-700 transition-colors"
              >
                <RotateCcw className="h-4 w-4" /> Issue Refund / Cancel Sale
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
