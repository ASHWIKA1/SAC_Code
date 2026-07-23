import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader, WhiteCard, DataTable, Badge, ActionBtn, StatCard, FormGroup, Alert } from '../../components/UI';
import api from '../../utils/api';

export default function VendorManagement() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from URL path
  const getTabFromPath = (path) => {
    const parts = path.split('/');
    return parts[parts.length - 1] || 'dashboard';
  };

  const activeTab = getTabFromPath(location.pathname);
  const setActiveTab = (tabName) => {
    navigate(`/vendor/${tabName}`);
  };

  // --- STATE FOR MOCK DATA / BACKEND FALLBACKS ---
  const [loading, setLoading] = useState(false);
  const [useMocks, setUseMocks] = useState(false);
  const [alert, setAlert] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [ndas, setNdas] = useState([]);
  const [mous, setMous] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [grns, setGrns] = useState([]);
  const [payments, setPayments] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);

  // Form Modals
  const [showModal, setShowModal] = useState(null); // 'vendor', 'doc', 'nda', 'mou', 'agreement', 'consultant', 'pr', 'po', 'delivery', 'grn', 'payment', 'perf'
  const [form, setForm] = useState({});
  const [search, setSearch] = useState('');
  const [detailItem, setDetailItem] = useState(null);

  // --- API INTEGRATION ---
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const fetchOrMock = async (apiPromise, mockData) => {
        try {
          const res = await apiPromise;
          if (res && res.data) {
            const content = res.data.content !== undefined ? res.data.content : res.data;
            if (content !== null && content !== undefined) {
              return { data: content, failed: false };
            }
          }
          return { data: mockData, failed: false };
        } catch (err) {
          console.warn("API request failed, falling back to mock dataset.", err);
          return { data: mockData, failed: true };
        }
      };

      const [vRes, dRes, nRes, mRes, aRes, cRes, prRes, poRes, delRes, grnRes, payRes, audRes, perfRes, dashRes] = await Promise.all([
        fetchOrMock(api.get('/api/v1/vendors'), MOCK_VENDORS),
        fetchOrMock(api.get('/api/v1/vendors/documents/expired'), MOCK_DOCUMENTS),
        fetchOrMock(api.get('/api/v1/vendors/ndas/active'), MOCK_NDAS),
        fetchOrMock(api.get('/api/v1/vendors/mous/active'), MOCK_MOUS),
        fetchOrMock(api.get('/api/v1/vendors/agreements/active'), MOCK_AGREEMENTS),
        fetchOrMock(api.get('/api/v1/vendors/consultants'), MOCK_CONSULTANTS),
        fetchOrMock(api.get('/api/v1/vendors/procurement/requests'), MOCK_PR),
        fetchOrMock(api.get('/api/v1/vendors/procurement/orders'), MOCK_PO),
        fetchOrMock(api.get('/api/v1/vendors/procurement/deliveries'), MOCK_DELIVERIES),
        fetchOrMock(api.get('/api/v1/vendors/procurement/grns'), MOCK_GRNS),
        fetchOrMock(api.get('/api/v1/vendors/payments'), MOCK_PAYMENTS),
        fetchOrMock(api.get('/api/v1/vendors/audit-logs'), MOCK_AUDITS),
        fetchOrMock(api.get('/api/v1/vendors/performance/all'), MOCK_PERFORMANCES),
        fetchOrMock(api.get('/api/v1/vendors/dashboard'), MOCK_DASHBOARD)
      ]);

      setVendors(vRes.data);
      setDocuments(dRes.data);
      setNdas(nRes.data);
      setMous(mRes.data);
      setAgreements(aRes.data);
      setConsultants(cRes.data);
      setPurchaseRequests(prRes.data);
      setPurchaseOrders(poRes.data);
      setDeliveries(delRes.data);
      setGrns(grnRes.data);
      setPayments(payRes.data);
      setAuditLogs(audRes.data);
      setPerformances(perfRes.data);
      setDashboardData(dashRes.data);

      setUseMocks(vRes.failed);
    } catch (e) {
      console.error("Critical error in fetchAllData", e);
      setUseMocks(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [activeTab]);

  // Form Submit
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form };
    if (payload.vendorType === 'Others' && payload.customVendorType) {
      payload.vendorType = payload.customVendorType;
    }
    try {
      let path = '';
      if (showModal === 'vendor') path = '/api/v1/vendors';
      else if (showModal === 'doc') path = '/api/v1/vendors/documents';
      else if (showModal === 'nda') path = '/api/v1/vendors/ndas';
      else if (showModal === 'mou') path = '/api/v1/vendors/mous';
      else if (showModal === 'agreement') path = '/api/v1/vendors/agreements';
      else if (showModal === 'consultant') path = '/api/v1/vendors/consultants';
      else if (showModal === 'pr') path = '/api/v1/vendors/procurement/requests';
      else if (showModal === 'po') path = '/api/v1/vendors/procurement/orders';
      else if (showModal === 'grn') path = '/api/v1/vendors/procurement/grns';
      else if (showModal === 'payment') path = '/api/v1/vendors/payments';
      else if (showModal === 'perf') path = '/api/v1/vendors/performance';

      const response = await api.post(path, payload);
      setAlert({ type: 'success', msg: 'Record saved successfully in ERP Backend!' });
      setTimeout(() => setAlert(null), 3000);
      setShowModal(null);
      setForm({});
      fetchAllData();
    } catch (err) {
      // Offline fallback simulations
      const newRecord = { ...payload, id: Date.now() };
      if (showModal === 'vendor') {
        newRecord.vendorCode = 'VEND-' + Math.floor(Math.random() * 9000 + 1000);
        newRecord.status = 'Active';
        setVendors(prev => [newRecord, ...prev]);
      } else if (showModal === 'doc') setDocuments(prev => [newRecord, ...prev]);
      else if (showModal === 'nda') setNdas(prev => [newRecord, ...prev]);
      else if (showModal === 'mou') setMous(prev => [newRecord, ...prev]);
      else if (showModal === 'agreement') setAgreements(prev => [newRecord, ...prev]);
      else if (showModal === 'consultant') {
        newRecord.consultantIdStr = 'CONS-' + Math.floor(Math.random() * 9000 + 1000);
        setConsultants(prev => [newRecord, ...prev]);
      }
      else if (showModal === 'pr') {
        newRecord.requestNumber = 'PR-' + Math.floor(Math.random() * 9000 + 1000);
        newRecord.approvalStatus = 'Pending';
        setPurchaseRequests(prev => [newRecord, ...prev]);
      } else if (showModal === 'po') {
        newRecord.poNumber = 'PO-' + Math.floor(Math.random() * 9000 + 1000);
        newRecord.poStatus = 'Draft';
        newRecord.revisionNumber = 0;
        setPurchaseOrders(prev => [newRecord, ...prev]);
      } else if (showModal === 'grn') {
        newRecord.grnNumber = 'GRN-' + Math.floor(Math.random() * 9000 + 1000);
        setGrns(prev => [newRecord, ...prev]);
      } else if (showModal === 'payment') {
        newRecord.paymentRequestStatus = 'Pending Approval';
        newRecord.paymentStatus = 'Unpaid';
        setPayments(prev => [newRecord, ...prev]);
      }

      setAlert({ type: 'success', msg: 'Simulated record creation locally!' });
      setTimeout(() => setAlert(null), 3000);
      setShowModal(null);
      setForm({});
    } finally {
      setLoading(false);
    }
  };

  // Actions
  const handleApprove = async (type, id, status) => {
    if (!window.confirm(`Are you sure you want to set status to ${status}?`)) return;
    try {
      let path = '';
      if (type === 'mou') path = `/api/v1/vendors/mous/${id}/approve?status=${status}`;
      else if (type === 'agreement') path = `/api/v1/vendors/agreements/${id}/approve?status=${status}`;
      else if (type === 'pr') path = `/api/v1/vendors/procurement/requests/${id}/approve?status=${status}`;
      else if (type === 'po') path = `/api/v1/vendors/procurement/orders/${id}/status?status=${status}`;
      else if (type === 'payment') path = `/api/v1/vendors/payments/${id}/verify?status=${status}`;

      await api.put(path);
      setAlert({ type: 'success', msg: 'Action processed successfully!' });
      fetchAllData();
    } catch (e) {
      if (type === 'pr') {
        setPurchaseRequests(prev => prev.map(r => r.id === id ? { ...r, approvalStatus: status } : r));
      } else if (type === 'po') {
        setPurchaseOrders(prev => prev.map(r => r.id === id ? { ...r, poStatus: status } : r));
      } else if (type === 'payment') {
        setPayments(prev => prev.map(r => r.id === id ? { ...r, paymentRequestStatus: status } : r));
      }
      setAlert({ type: 'success', msg: 'Simulated status update locally!' });
    }
  };

  const handlePay = async (id) => {
    const details = window.prompt("Enter Bank Transfer Details / Transaction reference ID:", "TXN-" + Date.now());
    if (!details) return;
    try {
      await api.post(`/api/v1/vendors/payments/${id}/pay?bankTransferDetails=${details}`);
      setAlert({ type: 'success', msg: 'Payment processed successfully!' });
      fetchAllData();
    } catch (e) {
      setPayments(prev => prev.map(r => r.id === id ? { ...r, paymentStatus: 'Paid', bankTransferDetails: details, outstandingBalance: 0 } : r));
      setAlert({ type: 'success', msg: 'Simulated paid transaction locally!' });
    }
  };

  // Export report
  const handleExport = (type) => {
    window.open(`/api/v1/vendors/reports/export?type=${type}&format=csv`);
    // Simulated direct browser CSV trigger
    let csvContent = "data:text/csv;charset=utf-8,";
    if (type === 'vendor') {
      csvContent += "Vendor Code,Vendor Name,Company Name,Type,Contact Person,Mobile,Email,Status\n";
      vendors.forEach(v => {
        csvContent += `${v.vendorCode},"${v.vendorName}","${v.companyName}",${v.vendorType},"${v.contactPerson}",${v.mobile},${v.email},${v.status}\n`;
      });
    } else {
      csvContent += "PO Number,Vendor Name,Quantity,Rate,GST,Discount,PO Status\n";
      purchaseOrders.forEach(po => {
        csvContent += `${po.poNumber},"${po.vendor?.vendorName || 'N/A'}",${po.quantity},${po.rate},${po.gst},${po.discount},${po.poStatus}\n`;
      });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${type}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Search filter
  const filterList = (list) => {
    return list.filter(row =>
      Object.values(row).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
    );
  };

  // --- SUB-SECTIONS RENDERING ---
  const renderDashboard = () => {
    const dash = dashboardData || MOCK_DASHBOARD;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          <StatCard value={dash.totalVendors} label="Total Vendors" icon="ti-briefcase" colorClass="blue" />
          <StatCard value={dash.activeVendors} label="Active Vendors" icon="ti-check" colorClass="green" />
          <StatCard value={dash.expiredAgreements} label="Expired Agreements" icon="ti-alert" colorClass="red" />
          <StatCard value={dash.pendingPos} label="Pending POs" icon="ti-timer" colorClass="yellow" />
          <StatCard value={dash.pendingPayments} label="Pending Payments" icon="ti-receipt" colorClass="purple" />
        </div>

        {/* Charts and Lists Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: 24 }}>
          {/* Chart 1: Monthly Procurement Spends */}
          <WhiteCard title="Monthly Procurement Volume (USD)">
            <div style={{ padding: '20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 180, paddingBottom: 20, borderBottom: '1px solid #f0f0f0' }}>
                {dash.monthlyProcurement.map((p, i) => {
                  const pct = (p.amount / 550000) * 100;
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 10, color: '#666' }}>${(p.amount / 1000).toFixed(0)}k</span>
                      <div style={{
                        width: 32,
                        height: `${pct}%`,
                        background: 'linear-gradient(180deg, #7c3aed 0%, #a78bfa 100%)',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.3s ease'
                      }} />
                      <span style={{ fontSize: 11, fontWeight: 600 }}>{p.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </WhiteCard>

          {/* Chart 2: Top Spends by Department */}
          <WhiteCard title="Department Expenditure Distribution">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '10px 0' }}>
              {dash.departmentWisePurchase.map((d, i) => {
                const max = 350000;
                const pct = (d.value / max) * 100;
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ fontWeight: 600 }}>{d.department}</span>
                      <span style={{ color: '#7c3aed', fontWeight: 700 }}>${d.value.toLocaleString()}</span>
                    </div>
                    <div style={{ width: '100%', height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #7c3aed, #ec4899)', borderRadius: 4 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </WhiteCard>

          {/* Delayed Deliveries Check */}
          <WhiteCard title="Late Deliveries & Performance Alerts">
            <div className="table-responsive">
              <table className="data_table">
                <thead>
                  <tr>
                    <th>Vendor Name</th>
                    <th>PO ID</th>
                    <th>Days Delayed</th>
                    <th>Action Link</th>
                  </tr>
                </thead>
                <tbody>
                  {dash.delayedDeliveries.map((dl, idx) => (
                    <tr key={idx}>
                      <td><strong>{dl.vendor}</strong></td>
                      <td><code>{dl.po}</code></td>
                      <td><span className="badge badge-danger">{dl.days} Days Late</span></td>
                      <td>
                        <button className="primary_btn" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => setActiveTab('delivery-tracking')}>
                          Track Delivery
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </WhiteCard>

          {/* Top Suppliers ratings */}
          <WhiteCard title="Top Performing Suppliers">
            <div className="table-responsive">
              <table className="data_table">
                <thead>
                  <tr>
                    <th>Vendor Name</th>
                    <th>Monthly Billing</th>
                    <th>Quality Index</th>
                  </tr>
                </thead>
                <tbody>
                  {dash.topVendors.map((tv, idx) => (
                    <tr key={idx}>
                      <td><strong>{tv.vendorName}</strong></td>
                      <td>${tv.amount.toLocaleString()}</td>
                      <td>
                        <span className="badge badge-success">★★★★★ Excellent</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </WhiteCard>
        </div>
      </div>
    );
  };

  const renderVendors = () => {
    return (
      <WhiteCard title="Vendor Directory" actions={
        <button className="primary_btn" onClick={() => { setForm({}); setShowModal('vendor'); }}>+ Register Vendor</button>
      }>
        <div style={{ marginBottom: 16, display: 'flex', gap: 10 }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search vendor name, code, contact..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 300 }}
          />
        </div>
        <DataTable
          columns={[
            { label: 'Code', key: 'vendorCode' },
            { label: 'Name', key: 'vendorName' },
            { label: 'Company', key: 'companyName' },
            { label: 'Type', key: 'vendorType' },
            { label: 'Contact Person', key: 'contactPerson' },
            { label: 'Email', key: 'email' },
            { label: 'Mobile', key: 'mobile' },
            { label: 'Status', render: r => <Badge type={r.status === 'Active' ? 'success' : 'warning'}>{r.status}</Badge> }
          ]}
          data={filterList(vendors)}
        />
      </WhiteCard>
    );
  };

  const renderDocs = () => {
    return (
      <WhiteCard title="Vendor Compliance Verification Hub" actions={
        <button className="primary_btn" onClick={() => { setForm({}); setShowModal('doc'); }}>+ Upload Document</button>
      }>
        <DataTable
          columns={[
            { label: 'Vendor ID', key: 'vendorId' },
            { label: 'Document Type', key: 'documentType' },
            { label: 'Doc Number', key: 'documentNumber' },
            { label: 'Expiry Date', key: 'expiryDate' },
            { label: 'Status', render: r => <Badge type={r.status === 'Verified' ? 'success' : 'warning'}>{r.status}</Badge> },
            { label: 'Remarks', key: 'remarks' },
            { label: 'Action', render: r => (
              <div style={{ display: 'flex', gap: 6 }}>
                <ActionBtn type="edit" icon="ti-check" title="Verify Document" onClick={() => handleApprove('doc', r.id, 'Verified')} />
                <ActionBtn type="delete" icon="ti-close" title="Reject" onClick={() => handleApprove('doc', r.id, 'Rejected')} />
              </div>
            )}
          ]}
          data={documents}
        />
      </WhiteCard>
    );
  };

  const renderNdas = () => {
    return (
      <WhiteCard title="Non-Disclosure Agreements (NDA)" actions={
        <button className="primary_btn" onClick={() => { setForm({}); setShowModal('nda'); }}>+ Add NDA Contract</button>
      }>
        <DataTable
          columns={[
            { label: 'NDA Number', key: 'ndaNumber' },
            { label: 'Vendor Name', render: r => r.vendor?.vendorName || `Vendor ID: ${r.vendorId}` },
            { label: 'Effective Date', key: 'effectiveDate' },
            { label: 'Expiry Date', key: 'expiryDate' },
            { label: 'Confidentiality Level', render: r => <Badge type="danger">{r.confidentialityLevel || 'High'}</Badge> },
            { label: 'Status', render: r => <Badge type={r.status === 'Active' ? 'success' : 'secondary'}>{r.status}</Badge> }
          ]}
          data={ndas}
        />
      </WhiteCard>
    );
  };

  const renderMous = () => {
    return (
      <WhiteCard title="Memorandum of Understanding (MOU)" actions={
        <button className="primary_btn" onClick={() => { setForm({}); setShowModal('mou'); }}>+ Add MOU</button>
      }>
        <DataTable
          columns={[
            { label: 'MOU Number', key: 'mouNumber' },
            { label: 'Vendor', render: r => r.vendor?.vendorName || `Vendor ID: ${r.vendorId}` },
            { label: 'Purpose', key: 'purpose' },
            { label: 'Start Date', key: 'startDate' },
            { label: 'End Date', key: 'endDate' },
            { label: 'Value', render: r => `$${r.contractValue}` },
            { label: 'Approval Status', render: r => <Badge type={r.approvalStatus === 'Approved' ? 'success' : 'warning'}>{r.approvalStatus}</Badge> },
            { label: 'Action', render: r => r.approvalStatus === 'Pending' && (
              <div style={{ display: 'flex', gap: 6 }}>
                <ActionBtn type="edit" icon="ti-check" title="Approve" onClick={() => handleApprove('mou', r.id, 'Approved')} />
                <ActionBtn type="delete" icon="ti-close" title="Reject" onClick={() => handleApprove('mou', r.id, 'Rejected')} />
              </div>
            )}
          ]}
          data={mous}
        />
      </WhiteCard>
    );
  };

  const renderAgreements = () => {
    return (
      <WhiteCard title="Agreement Contracts Management" actions={
        <button className="primary_btn" onClick={() => { setForm({}); setShowModal('agreement'); }}>+ New Agreement</button>
      }>
        <DataTable
          columns={[
            { label: 'Agreement No', key: 'agreementNumber' },
            { label: 'Type', key: 'agreementType' },
            { label: 'Effective Date', key: 'effectiveDate' },
            { label: 'Expiry Date', key: 'expiryDate' },
            { label: 'Renewal Date', key: 'renewalDate' },
            { label: 'Value', render: r => `$${r.contractValue}` },
            { label: 'Approval Status', render: r => <Badge type={r.approvalStatus === 'Approved' ? 'success' : 'warning'}>{r.approvalStatus}</Badge> },
            { label: 'Action', render: r => r.approvalStatus === 'Pending' && (
              <div style={{ display: 'flex', gap: 6 }}>
                <ActionBtn type="edit" icon="ti-check" title="Approve" onClick={() => handleApprove('agreement', r.id, 'Approved')} />
                <ActionBtn type="delete" icon="ti-close" title="Reject" onClick={() => handleApprove('agreement', r.id, 'Rejected')} />
              </div>
            )}
          ]}
          data={agreements}
        />
      </WhiteCard>
    );
  };

  const renderConsultants = () => {
    return (
      <WhiteCard title="Consultants Management Directory" actions={
        <button className="primary_btn" onClick={() => { setForm({}); setShowModal('consultant'); }}>+ Register Consultant</button>
      }>
        <DataTable
          columns={[
            { label: 'Consultant ID', key: 'consultantIdStr' },
            { label: 'Name', key: 'name' },
            { label: 'Specialization', key: 'specialization' },
            { label: 'Exp (Years)', key: 'experienceYears' },
            { label: 'Hourly Rate', render: r => `$${r.hourlyRate}/hr` },
            { label: 'Rating', render: r => <span style={{ color: '#fbbf24', fontWeight: 700 }}>★ {r.performanceRating || '0.00'}</span> },
            { label: 'Paid Amount', render: r => `$${r.totalPayments}` },
            { label: 'Status', render: r => <Badge type={r.status === 'Active' ? 'success' : 'secondary'}>{r.status}</Badge> }
          ]}
          data={consultants}
        />
      </WhiteCard>
    );
  };

  const renderPurchaseRequests = () => {
    return (
      <WhiteCard title="Purchase Requests (PR)" actions={
        <button className="primary_btn" onClick={() => { setForm({}); setShowModal('pr'); }}>+ Raise Purchase Request</button>
      }>
        <DataTable
          columns={[
            { label: 'PR Number', key: 'requestNumber' },
            { label: 'Priority', render: r => <Badge type={r.priority === 'Urgent' ? 'danger' : 'info'}>{r.priority}</Badge> },
            { label: 'Required Date', key: 'requiredDate' },
            { label: 'Est. Cost', render: r => `$${r.estimatedCost}` },
            { label: 'Justification', key: 'justification' },
            { label: 'Status', render: r => <Badge type={r.approvalStatus === 'Approved' ? 'success' : 'warning'}>{r.approvalStatus}</Badge> },
            { label: 'Action', render: r => r.approvalStatus === 'Pending' && (
              <div style={{ display: 'flex', gap: 6 }}>
                <ActionBtn type="edit" icon="ti-check" title="Approve PR" onClick={() => handleApprove('pr', r.id, 'Approved')} />
                <ActionBtn type="delete" icon="ti-close" title="Reject PR" onClick={() => handleApprove('pr', r.id, 'Rejected')} />
              </div>
            )}
          ]}
          data={purchaseRequests}
        />
      </WhiteCard>
    );
  };

  const renderPurchaseOrders = () => {
    return (
      <WhiteCard title="Purchase Orders (PO)" actions={
        <button className="primary_btn" onClick={() => { setForm({}); setShowModal('po'); }}>+ Create Purchase Order</button>
      }>
        <DataTable
          columns={[
            { label: 'PO Number', key: 'poNumber' },
            { label: 'Vendor Code', render: r => r.vendor?.vendorCode || 'N/A' },
            { label: 'Items JSON', key: 'items' },
            { label: 'Base Rate', render: r => `$${r.rate}` },
            { label: 'GST', render: r => `$${r.gst}` },
            { label: 'Discount', render: r => `$${r.discount}` },
            { label: 'Delivery Date', key: 'deliveryDate' },
            { label: 'PO Status', render: r => <Badge type={r.poStatus === 'Draft' ? 'warning' : 'success'}>{r.poStatus}</Badge> },
            { label: 'Rev No', key: 'revisionNumber' },
            { label: 'Action', render: r => r.poStatus === 'Draft' && (
              <button className="primary_btn" style={{ padding: '6px 12px', fontSize: 12 }} onClick={() => handleApprove('po', r.id, 'Sent')}>
                Send PO
              </button>
            )}
          ]}
          data={purchaseOrders}
        />
      </WhiteCard>
    );
  };

  const renderDeliveryTracking = () => {
    return (
      <WhiteCard title="Vendor Delivery Tracker" actions={
        <button className="primary_btn" onClick={() => { setForm({}); setShowModal('delivery'); }}>+ Log Dispatch</button>
      }>
        <DataTable
          columns={[
            { label: 'PO ID', render: r => r.purchaseOrder?.poNumber || `PO ID: ${r.poId}` },
            { label: 'Expected Date', key: 'expectedDate' },
            { label: 'Dispatch Date', key: 'dispatchDate' },
            { label: 'Courier Details', key: 'courierDetails' },
            { label: 'Tracking No', key: 'trackingNumber' },
            { label: 'Received Date', key: 'receivedDate' },
            { label: 'Delivery Status', render: r => <Badge type={r.deliveryStatus === 'Delivered' ? 'success' : 'warning'}>{r.deliveryStatus}</Badge> }
          ]}
          data={deliveries}
        />
      </WhiteCard>
    );
  };

  const renderGRN = () => {
    return (
      <WhiteCard title="Goods Receipt Notes (GRN)" actions={
        <button className="primary_btn" onClick={() => { setForm({}); setShowModal('grn'); }}>+ Generate GRN</button>
      }>
        <DataTable
          columns={[
            { label: 'GRN Number', key: 'grnNumber' },
            { label: 'PO Reference', render: r => r.purchaseOrder?.poNumber || `PO ID: ${r.poId}` },
            { label: 'Received Qty', key: 'receivedQuantity' },
            { label: 'Accepted Qty', key: 'acceptedQuantity' },
            { label: 'Rejected Qty', key: 'rejectedQuantity' },
            { label: 'Remarks', key: 'inspectionRemarks' },
            { label: 'Store Location ID', key: 'storeLocationId' }
          ]}
          data={grns}
        />
      </WhiteCard>
    );
  };

  const renderPerformance = () => {
    return (
      <WhiteCard title="Vendor Performance Evaluations" actions={
        <button className="primary_btn" onClick={() => { setForm({}); setShowModal('perf'); }}>+ Evaluate Performance</button>
      }>
        <DataTable
          columns={[
            { label: 'Vendor Name', render: r => r.vendor?.vendorName || `Vendor: ${r.vendorId}` },
            { label: 'Delivery Score (1-5)', key: 'deliveryPerformance' },
            { label: 'Quality Score (1-5)', key: 'qualityRating' },
            { label: 'Pricing Score (1-5)', key: 'pricing' },
            { label: 'Complaints', key: 'complaintCount' },
            { label: 'Overall Score', render: r => <span style={{ fontWeight: 700, color: '#7c3aed' }}>{r.overallRating || '0.00'}</span> },
            { label: 'Level', render: r => <Badge type={r.ratingLevel === 'Excellent' || r.ratingLevel === 'Good' ? 'success' : 'warning'}>{r.ratingLevel}</Badge> },
            { label: 'Evaluation Report / AI Review', render: r => r.feedback ? <div style={{ fontSize: 11, color: '#555', whiteSpace: 'pre-wrap', maxWidth: 260 }}>{r.feedback}</div> : <span style={{ color: '#aaa', fontStyle: 'italic' }}>No review recorded</span> },
            { label: 'Recommendation', render: r => r.blacklistRecommendation ? <Badge type="danger">Blacklist Recommended</Badge> : <Badge type="success">Safe</Badge> }
          ]}
          data={performances}
        />
      </WhiteCard>
    );
  };

  const renderPayments = () => {
    return (
      <WhiteCard title="Invoices & Payments Finance Integration" actions={
        <button className="primary_btn" onClick={() => { setForm({}); setShowModal('payment'); }}>+ Log Invoice</button>
      }>
        <DataTable
          columns={[
            { label: 'Invoice No', key: 'invoiceNumber' },
            { label: 'Vendor Code', render: r => r.vendor?.vendorCode || 'N/A' },
            { label: 'Invoice Amt', render: r => `$${r.invoiceAmount}` },
            { label: 'GST Tax', render: r => `$${r.gstAmount}` },
            { label: 'TDS Deducted', render: r => `$${r.tdsAmount}` },
            { label: 'Verify Status', render: r => <Badge type={r.paymentRequestStatus === 'Approved' ? 'success' : 'warning'}>{r.paymentRequestStatus}</Badge> },
            { label: 'Pay Status', render: r => <Badge type={r.paymentStatus === 'Paid' ? 'success' : 'danger'}>{r.paymentStatus}</Badge> },
            { label: 'Bank Ref', key: 'bankTransferDetails' },
            { label: 'Outstanding Balance', render: r => `$${r.outstandingBalance}` },
            { label: 'Action', render: r => (
              <div style={{ display: 'flex', gap: 6 }}>
                {r.paymentRequestStatus === 'Pending Approval' && (
                  <button className="primary_btn" style={{ padding: '6px 12px', fontSize: 11 }} onClick={() => handleApprove('payment', r.id, 'Approved')}>
                    Approve
                  </button>
                )}
                {r.paymentRequestStatus === 'Approved' && r.paymentStatus !== 'Paid' && (
                  <button className="btn-secondary-outline" style={{ padding: '6px 12px', fontSize: 11, background: '#7c3aed', color: '#fff', border: 'none' }} onClick={() => handlePay(r.id)}>
                    Pay Invoice
                  </button>
                )}
              </div>
            )}
          ]}
          data={payments}
        />
      </WhiteCard>
    );
  };

  const renderReports = () => {
    return (
      <WhiteCard title="Exportable Procurement & Compliance Reports">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, padding: '20px 0' }}>
          <div className="white_card" style={{ border: '1px solid #eee', padding: 20 }}>
            <h5>Vendor Master List</h5>
            <p style={{ fontSize: 12, color: '#666' }}>Generates complete details of registered vendors, tax certifications, contact, and billing.</p>
            <button className="primary_btn" onClick={() => handleExport('vendor')}>Download CSV</button>
          </div>
          <div className="white_card" style={{ border: '1px solid #eee', padding: 20 }}>
            <h5>Purchase Order Ledger</h5>
            <p style={{ fontSize: 12, color: '#666' }}>Generates complete list of purchase orders raised, totals, delivery terms, and state.</p>
            <button className="primary_btn" onClick={() => handleExport('purchase')}>Download CSV</button>
          </div>
          <div className="white_card" style={{ border: '1px solid #eee', padding: 20 }}>
            <h5>Financial Payments</h5>
            <p style={{ fontSize: 12, color: '#666' }}>TDS calculations, outstanding ledger balances, bank references for payment audit audits.</p>
            <button className="primary_btn" onClick={() => handleExport('payment')}>Download CSV</button>
          </div>
        </div>
      </WhiteCard>
    );
  };

  const renderAuditLogs = () => {
    return (
      <WhiteCard title="ERP Vendor System Audit Trail">
        <DataTable
          columns={[
            { label: 'Timestamp', key: 'createdAt' },
            { label: 'Operation', render: r => <Badge type="info">{r.action}</Badge> },
            { label: 'Performed By', key: 'performedBy' },
            { label: 'Details', key: 'details' }
          ]}
          data={auditLogs}
        />
      </WhiteCard>
    );
  };

  const handleAiFeedbackGenerate = () => {
    const delivery = parseFloat(form.deliveryPerformance) || 0;
    const quality = parseFloat(form.qualityRating) || 0;
    const pricing = parseFloat(form.pricing) || 0;
    const comms = parseFloat(form.communication) || 0;
    const response = parseFloat(form.responseTime) || 0;
    const compliance = parseFloat(form.compliance) || 0;
    const complaints = parseInt(form.complaintCount) || 0;
    const rejected = parseInt(form.rejectedMaterials) || 0;

    const scores = [delivery, quality, pricing, comms, response, compliance].filter(s => s > 0);
    if (scores.length === 0) {
      alert("Please fill in at least one score to generate an AI review.");
      return;
    }
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

    let vendorName = 'the vendor';
    if (form.vendorId) {
      const v = vendors.find(vend => String(vend.id) === String(form.vendorId));
      if (v) vendorName = v.vendorName;
    }

    let review = `AI PERFORMANCE ASSESSMENT REPORT FOR ${vendorName.toUpperCase()}\n`;
    review += `==========================================\n`;
    review += `• Overall Score Index: ${avg.toFixed(2)}/5.00\n`;
    
    if (quality >= 4.0) {
      review += `• Quality standards are excellent. Product reliability is high.\n`;
    } else if (quality > 0 && quality < 3.0) {
      review += `• Quality score is concerning (${quality}/5.0). Significant product defects observed.\n`;
    }

    if (delivery >= 4.0) {
      review += `• Dispatch times and delivery performance are highly consistent.\n`;
    } else if (delivery > 0 && delivery < 3.0) {
      review += `• Delivery delays are frequent. SLA timelines not met.\n`;
    }

    if (rejected > 0) {
      review += `• ALERT: ${rejected} rejected material units logged in this session.\n`;
    }
    if (complaints > 0) {
      review += `• WARNING: ${complaints} unresolved customer/store manager complaints logged.\n`;
    }

    if (avg >= 4.0) {
      review += `\nRECOMMENDATION: Highly recommended supplier. Safe to renew and expand agreements.`;
    } else if (avg >= 3.0) {
      review += `\nRECOMMENDATION: Passable performance. Regular monthly monitoring recommended to improve competitiveness.`;
    } else {
      review += `\nRECOMMENDATION: CRITICAL. Poor compliance indices. Initiate warning notices. Blacklist review recommended.`;
    }

    setForm(p => ({ ...p, feedback: review }));
  };

  // --- MODALS RENDERING ---
  const renderModals = () => {
    if (!showModal) return null;
    let fields = [];
    let title = '';

    if (showModal === 'vendor') {
      title = 'Register Vendor Profile';
      fields = [
        { key: 'vendorName', label: 'Vendor Name', required: true },
        { key: 'companyName', label: 'Company Name', required: true },
        { key: 'vendorType', label: 'Vendor Type', type: 'select', required: true, options: [
          { value: 'Supplier (Goods & Equipment)', label: 'Supplier (Goods & Equipment)' },
          { value: 'Service Provider', label: 'Service Provider' },
          { value: 'Consultant', label: 'Consultant (Professional/Advisor)' },
          { value: 'Contractor', label: 'Contractor (Infrastructure/Projects)' },
          { value: 'Software Vendor', label: 'Software/SaaS Vendor' },
          { value: 'IT Hardware Vendor', label: 'IT Hardware & Equipment' },
          { value: 'Office & Stationery Supplies', label: 'Office & Stationery Supplies' },
          { value: 'Logistics & Transport', label: 'Logistics & Transport' },
          { value: 'Facility & Maintenance', label: 'Facility & Maintenance (AMC)' },
          { value: 'Others', label: 'Others' }
        ]},
        { key: 'gstNumber', label: 'GST Number' },
        { key: 'panNumber', label: 'PAN Number' },
        { key: 'tanNumber', label: 'TAN Number' },
        { key: 'msmeStatus', label: 'MSME Status', type: 'select', options: [{value:'Yes', label:'Yes'}, {value:'No', label:'No'}] },
        { key: 'msmeRegistrationNumber', label: 'MSME Reg No' },
        { key: 'udyamNumber', label: 'Udyam Number' },
        { key: 'contactPerson', label: 'Contact Person Name', required: true },
        { key: 'mobile', label: 'Mobile No', required: true },
        { key: 'email', label: 'Email Address', required: true, type: 'email' },
        { key: 'billingAddress', label: 'Billing Address', type: 'textarea', fullWidth: true },
        { key: 'accountHolder', label: 'Bank Account Holder Name' },
        { key: 'accountNumber', label: 'Account Number' },
        { key: 'ifsc', label: 'IFSC Code' },
        { key: 'bankName', label: 'Bank Name' }
      ];
    } else if (showModal === 'doc') {
      title = 'Upload Compliance Document';
      fields = [
        { key: 'vendorId', label: 'Vendor ID Link', type: 'select', required: true, options: vendors.map(v => ({ value: v.id, label: `${v.vendorCode} - ${v.vendorName}` })) },
        { key: 'documentType', label: 'Document Name', type: 'select', required: true, options: [
          { value: 'GST Certificate', label: 'GST Certificate' },
          { value: 'PAN Card', label: 'PAN Card' },
          { value: 'Bank Passbook', label: 'Bank Passbook' },
          { value: 'Cancelled Cheque', label: 'Cancelled Cheque' },
          { value: 'MSME Certificate', label: 'MSME Certificate' },
          { value: 'IEC Certificate', label: 'IEC Certificate' },
          { value: 'Trade License', label: 'Trade License' },
          { value: 'Company Registration', label: 'Company Registration' },
          { value: 'ISO Certificate', label: 'ISO Certificate' }
        ]},
        { key: 'documentNumber', label: 'Document Reference Number' },
        { key: 'fileUrl', label: 'Document Link URL / Name', required: true, placeholder: 'e.g. /uploads/docs/gst.pdf' },
        { key: 'issueDate', label: 'Issue Date', type: 'date' },
        { key: 'expiryDate', label: 'Expiry Date', type: 'date' },
        { key: 'remarks', label: 'Remarks', type: 'textarea', fullWidth: true }
      ];
    } else if (showModal === 'nda') {
      title = 'Upload Non-Disclosure Agreement (NDA)';
      fields = [
        { key: 'vendorId', label: 'Vendor ID Link', type: 'select', required: true, options: vendors.map(v => ({ value: v.id, label: v.vendorName })) },
        { key: 'ndaNumber', label: 'NDA Contract Number', required: true },
        { key: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
        { key: 'expiryDate', label: 'Expiry Date', type: 'date', required: true },
        { key: 'confidentialityLevel', label: 'Confidentiality Level', type: 'select', options: [
          { value: 'Low', label: 'Low' },
          { value: 'Medium', label: 'Medium' },
          { value: 'High', label: 'High' },
          { value: 'Critical', label: 'Critical' }
        ]},
        { key: 'fileUrl', label: 'NDA Digital Scan URL', placeholder: '/uploads/ndas/doc.pdf' }
      ];
    } else if (showModal === 'mou') {
      title = 'Upload Memorandum of Understanding (MOU)';
      fields = [
        { key: 'vendorId', label: 'Vendor ID Link', type: 'select', required: true, options: vendors.map(v => ({ value: v.id, label: v.vendorName })) },
        { key: 'mouNumber', label: 'MOU Number', required: true },
        { key: 'purpose', label: 'Purpose of MOU', type: 'textarea', required: true, fullWidth: true },
        { key: 'startDate', label: 'Start Date', type: 'date', required: true },
        { key: 'endDate', label: 'End Date', type: 'date', required: true },
        { key: 'contractValue', label: 'Contract Capital Value ($)', type: 'number' },
        { key: 'fileUrl', label: 'MOU Document Path', placeholder: '/uploads/mous/doc.pdf' }
      ];
    } else if (showModal === 'agreement') {
      title = 'Configure Vendor Contract / Agreement';
      fields = [
        { key: 'vendorId', label: 'Vendor ID Link', type: 'select', required: true, options: vendors.map(v => ({ value: v.id, label: v.vendorName })) },
        { key: 'agreementNumber', label: 'Agreement Number', required: true },
        { key: 'agreementType', label: 'Agreement Type', type: 'select', required: true, options: [
          { value: 'Purchase Agreement', label: 'Purchase Agreement' },
          { value: 'Service Agreement', label: 'Service Agreement' },
          { value: 'Annual Maintenance Contract', label: 'Annual Maintenance Contract (AMC)' },
          { value: 'Rental Agreement', label: 'Rental Agreement' },
          { value: 'Consultant Agreement', label: 'Consultant Agreement' }
        ]},
        { key: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
        { key: 'expiryDate', label: 'Expiry Date', type: 'date', required: true },
        { key: 'contractValue', label: 'Contract Value ($)', type: 'number' },
        { key: 'penaltyClause', label: 'Penalty Clauses details', type: 'textarea', fullWidth: true },
        { key: 'termsConditions', label: 'Terms & Conditions', type: 'textarea', fullWidth: true },
        { key: 'fileUrl', label: 'Digital Copy Link', placeholder: '/uploads/agreements/doc.pdf' }
      ];
    } else if (showModal === 'consultant') {
      title = 'Register Consultant Profile';
      fields = [
        { key: 'name', label: 'Consultant Name', required: true },
        { key: 'specialization', label: 'Specialization Scope', required: true },
        { key: 'experienceYears', label: 'Experience Years', type: 'number' },
        { key: 'hourlyRate', label: 'Hourly Charging Rate ($/hr)', type: 'number', required: true },
        { key: 'contractStartDate', label: 'Contract Start', type: 'date' },
        { key: 'contractEndDate', label: 'Contract End', type: 'date' }
      ];
    } else if (showModal === 'pr') {
      title = 'Raise Department Purchase Request';
      fields = [
        { key: 'departmentId', label: 'Department reference', type: 'select', required: true, options: [{ value: 1, label: 'IT Department' }, { value: 2, label: 'Administration' }, { value: 3, label: 'Science Lab' }] },
        { key: 'requestedById', label: 'Requested Staff member', type: 'select', required: true, options: [{ value: 1, label: 'Staff member 1' }, { value: 2, label: 'Department Head' }] },
        { key: 'priority', label: 'Priority', type: 'select', options: [{ value: 'Low', label: 'Low' }, { value: 'Medium', label: 'Medium' }, { value: 'High', label: 'High' }, { value: 'Urgent', label: 'Urgent' }] },
        { key: 'requiredDate', label: 'Required Date', type: 'date', required: true },
        { key: 'items', label: 'Requested Items JSON', type: 'textarea', required: true, fullWidth: true, placeholder: 'e.g. [{"name":"Laptops","qty":5}]' },
        { key: 'estimatedCost', label: 'Estimated cost budget ($)', type: 'number', required: true },
        { key: 'justification', label: 'Justification for procurement', type: 'textarea', fullWidth: true }
      ];
    } else if (showModal === 'po') {
      title = 'Generate Purchase Order';
      fields = [
        { key: 'vendorId', label: 'Select Vendor', type: 'select', required: true, options: vendors.map(v => ({ value: v.id, label: v.vendorName })) },
        { key: 'items', label: 'PO Items block', type: 'textarea', required: true, fullWidth: true, placeholder: 'e.g. [{"item":"Dell Laptop","rate":800,"qty":5}]' },
        { key: 'quantity', label: 'Total Quantity count', type: 'number', required: true },
        { key: 'rate', label: 'Base Rate total ($)', type: 'number', required: true },
        { key: 'gst', label: 'GST tax total ($)', type: 'number' },
        { key: 'discount', label: 'Discount ($)', type: 'number' },
        { key: 'deliveryDate', label: 'Expected Delivery Date', type: 'date' },
        { key: 'paymentTerms', label: 'Payment Terms T&Cs', type: 'textarea', fullWidth: true },
        { key: 'deliveryAddress', label: 'Shipping / Store Address', type: 'textarea', fullWidth: true }
      ];
    } else if (showModal === 'delivery') {
      title = 'Log Dispatch / Delivery Tracking';
      fields = [
        { key: 'poId', label: 'Select Purchase Order Link', type: 'select', required: true, options: purchaseOrders.map(po => ({ value: po.id, label: po.poNumber })) },
        { key: 'expectedDate', label: 'Expected Delivery Date', type: 'date', required: true },
        { key: 'dispatchDate', label: 'Dispatch Date', type: 'date' },
        { key: 'courierDetails', label: 'Courier / Transport Details', placeholder: 'e.g. Fedex, BlueDart, DTDC' },
        { key: 'trackingNumber', label: 'Waybill / Tracking Number' },
        { key: 'receivedDate', label: 'Received Date (optional)', type: 'date' },
        { key: 'deliveryStatus', label: 'Delivery Status', type: 'select', required: true, options: [
          { value: 'Pending', label: 'Pending' },
          { value: 'Shipped', label: 'Shipped' },
          { value: 'Delivered', label: 'Delivered' },
          { value: 'Delayed', label: 'Delayed' }
        ]}
      ];
    } else if (showModal === 'grn') {
      title = 'Generate Goods Receipt Note (GRN)';
      fields = [
        { key: 'poId', label: 'Select Purchase Order', type: 'select', required: true, options: purchaseOrders.map(po => ({ value: po.id, label: po.poNumber })) },
        { key: 'receivedQuantity', label: 'Received Qty', type: 'number', required: true },
        { key: 'acceptedQuantity', label: 'Accepted Qty', type: 'number', required: true },
        { key: 'rejectedQuantity', label: 'Rejected / Damaged Qty', type: 'number' },
        { key: 'inspectionRemarks', label: 'Quality inspection remarks', type: 'textarea', fullWidth: true },
        { key: 'storeLocationId', label: 'Assign store location', type: 'select', options: [{ value: 1, label: 'Main Storehouse' }, { value: 2, label: 'Electronics Vault' }] }
      ];
    } else if (showModal === 'payment') {
      title = 'Register Invoice payment';
      fields = [
        { key: 'invoiceNumber', label: 'Invoice Reference No', required: true },
        { key: 'vendorId', label: 'Select Vendor', type: 'select', required: true, options: vendors.map(v => ({ value: v.id, label: v.vendorName })) },
        { key: 'poId', label: 'Select Purchase Order Link', type: 'select', options: purchaseOrders.map(po => ({ value: po.id, label: po.poNumber })) },
        { key: 'invoiceAmount', label: 'Invoice Base Amount ($)', type: 'number', required: true },
        { key: 'gstAmount', label: 'GST Tax ($)' },
        { key: 'tdsAmount', label: 'TDS Withholding Tax ($)' }
      ];
    } else if (showModal === 'perf') {
      title = 'Save Vendor Evaluation Ratings';
      fields = [
        { key: 'vendorId', label: 'Select Vendor', type: 'select', required: true, options: vendors.map(v => ({ value: v.id, label: v.vendorName })) },
        { key: 'deliveryPerformance', label: 'Delivery Rating (1-5)', type: 'number' },
        { key: 'qualityRating', label: 'Quality Rating (1-5)', type: 'number' },
        { key: 'pricing', label: 'Pricing Score (1-5)', type: 'number' },
        { key: 'communication', label: 'Communication Rating (1-5)', type: 'number' },
        { key: 'responseTime', label: 'Response time Rating (1-5)', type: 'number' },
        { key: 'compliance', label: 'Compliance Index (1-5)', type: 'number' },
        { key: 'complaintCount', label: 'Active complaints logs count', type: 'number' },
        { key: 'rejectedMaterials', label: 'Rejected materials count', type: 'number' },
        { key: 'feedback', label: 'Evaluation Feedback / AI Review Report', type: 'textarea', fullWidth: true, placeholder: 'Write a manual score review or generate it automatically using AI...' }
      ];
    }

    return (
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: 20
      }}>
        <div style={{ background: '#fff', borderRadius: 8, width: '100%', maxWidth: 700, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontWeight: 700, fontSize: 16 }}>{title}</h4>
            <button onClick={() => setShowModal(null)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#999' }}>×</button>
          </div>
          <form onSubmit={handleSave} style={{ padding: 24 }}>
            <div className="row">
              {fields.map(f => (
                <div key={f.key} className={f.fullWidth ? 'col-12' : 'col-6'}>
                  <FormGroup label={f.label} required={f.required}>
                    {f.type === 'select' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
                        <select
                          className="form-control"
                          value={form[f.key] || ''}
                          onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                          required={f.required}
                        >
                          <option value="">-- Select --</option>
                          {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        {f.key === 'vendorType' && form[f.key] === 'Others' && (
                          <input
                            type="text"
                            className="form-control"
                            value={form.customVendorType || ''}
                            onChange={e => setForm(p => ({ ...p, customVendorType: e.target.value }))}
                            placeholder="Enter Custom Vendor Type *"
                            required
                            style={{ borderColor: '#7c3aed', background: '#fdfaff' }}
                          />
                        )}
                      </div>
                    ) : f.type === 'textarea' ? (
                      <textarea
                        className="form-control"
                        rows={3}
                        value={form[f.key] || ''}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                      />
                    ) : f.key === 'fileUrl' ? (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input
                          type="text"
                          className="form-control"
                          value={form[f.key] || ''}
                          onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                          placeholder={f.placeholder || 'Choose a file or enter path...'}
                          required={f.required}
                          style={{ flex: 1 }}
                        />
                        <label style={{
                          padding: '8px 12px',
                          background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
                          color: '#fff',
                          borderRadius: 4,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          boxShadow: '0 4px 10px rgba(124,58,237,0.2)',
                          whiteSpace: 'nowrap',
                          userSelect: 'none'
                        }}>
                          Choose File
                          <input
                            type="file"
                            style={{ display: 'none' }}
                            onChange={e => {
                              const file = e.target.files[0];
                              if (file) {
                                setForm(p => ({ ...p, [f.key]: `/uploads/${showModal}s/${file.name}` }));
                              }
                            }}
                          />
                        </label>
                      </div>
                    ) : f.key === 'feedback' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, color: '#666' }}>You can edit manually or click generate:</span>
                          <button
                            type="button"
                            className="primary_btn"
                            style={{
                              padding: '4px 10px',
                              background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
                              border: 'none',
                              color: '#fff',
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                            onClick={handleAiFeedbackGenerate}
                          >
                            🤖 Generate AI Review
                          </button>
                        </div>
                        <textarea
                          className="form-control"
                          rows={5}
                          value={form[f.key] || ''}
                          onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                        />
                      </div>
                    ) : (
                      <input
                        type={f.type || 'text'}
                        className="form-control"
                        value={form[f.key] || ''}
                        onChange={e => {
                          let val = e.target.value;
                          if (f.key === 'mobile') {
                            val = val.replace(/\D/g, '').substring(0, 10);
                          }
                          setForm(p => ({ ...p, [f.key]: val }));
                        }}
                        placeholder={f.placeholder}
                        required={f.required}
                        maxLength={f.key === 'mobile' ? 10 : undefined}
                      />
                    )}
                  </FormGroup>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
              <button type="button" className="btn-secondary-outline" onClick={() => setShowModal(null)}>Cancel</button>
              <button type="submit" className="primary_btn" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      <PageHeader
        title="Vendor Management Module"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Vendor Management' }]}
      />

      {alert && (
        <div style={{ marginBottom: 20 }}>
          <Alert type={alert.type} msg={alert.msg} onClose={() => setAlert(null)} />
        </div>
      )}

      {/* Connection Mode Indicator */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        {useMocks ? (
          <span style={{ fontSize: 11, padding: '4px 10px', background: '#fff7ed', color: '#c2410c', borderRadius: 12, border: '1px solid #ffedd5', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            ⚠️ Sandbox Mode (Offline Mock Database)
          </span>
        ) : (
          <span style={{ fontSize: 11, padding: '4px 10px', background: '#f0fdf4', color: '#15803d', borderRadius: 12, border: '1px solid #dcfce7', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            🟢 Connected: Live MySQL Database
          </span>
        )}
      </div>

      {useMocks && (
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fef3c7',
          borderRadius: 8,
          padding: '16px 20px',
          marginBottom: 20,
          color: '#b45309',
          fontSize: 13,
          lineHeight: '1.5',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
          <strong>⚠️ Session Note: Mock Sandbox Mode Active</strong>
          <p style={{ margin: '6px 0 12px 0' }}>
            To save and view data in your local MySQL Workbench database, you must sign out of the demo session and log in using the real database administrator account:
          </p>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 16 }}>
            <div><strong>Username:</strong> <code style={{ background: '#fef3c7', padding: '2px 6px', borderRadius: 4, marginLeft: 4 }}>admin</code></div>
            <div><strong>Password:</strong> <code style={{ background: '#fef3c7', padding: '2px 6px', borderRadius: 4, marginLeft: 4 }}>password</code></div>
          </div>
          <button 
            type="button"
            onClick={() => {
              localStorage.removeItem('sac_token');
              localStorage.removeItem('sac_user');
              const basename = window.location.port === '5173' ? '' : '/testing_of_sac';
              window.location.href = basename + '/login';
            }}
            style={{
              padding: '8px 16px',
              background: '#b45309',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            🔒 Sign Out & Redirect to Login Page
          </button>
        </div>
      )}

      {/* Tabs area */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24, borderBottom: '1px solid #ddd', paddingBottom: 10 }}>
        {TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setActiveTab(t.value)}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: activeTab === t.value ? 'linear-gradient(90deg, #7c3aed, #ec4899)' : '#fff',
              color: activeTab === t.value ? '#fff' : '#666',
              borderRadius: 4,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: activeTab === t.value ? '0 4px 12px rgba(124,58,237,0.3)' : '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Page Content area */}
      <div style={{ minHeight: 400 }}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'registration' && renderVendors()}
        {activeTab === 'documents' && renderDocs()}
        {activeTab === 'nda' && renderNdas()}
        {activeTab === 'mou' && renderMous()}
        {activeTab === 'agreements' && renderAgreements()}
        {activeTab === 'consultants' && renderConsultants()}
        {activeTab === 'purchase-request' && renderPurchaseRequests()}
        {activeTab === 'purchase-order' && renderPurchaseOrders()}
        {activeTab === 'delivery-tracking' && renderDeliveryTracking()}
        {activeTab === 'grn' && renderGRN()}
        {activeTab === 'performance' && renderPerformance()}
        {activeTab === 'payment' && renderPayments()}
        {activeTab === 'reports' && renderReports()}
        {activeTab === 'audit-logs' && renderAuditLogs()}
      </div>

      {renderModals()}
    </>
  );
}

// --- STATIC TABS ---
const TABS = [
  { label: 'Analytics Dashboard', value: 'dashboard' },
  { label: 'Vendor Directory', value: 'registration' },
  { label: 'Documents Hub', value: 'documents' },
  { label: 'NDA Logs', value: 'nda' },
  { label: 'MOU Logs', value: 'mou' },
  { label: 'Agreements', value: 'agreements' },
  { label: 'Consultants Directory', value: 'consultants' },
  { label: 'Purchase Request', value: 'purchase-request' },
  { label: 'Purchase Order', value: 'purchase-order' },
  { label: 'Delivery Tracking', value: 'delivery-tracking' },
  { label: 'GRN Log', value: 'grn' },
  { label: 'Performance Rating', value: 'performance' },
  { label: 'Invoices & Payments', value: 'payment' },
  { label: 'Reports Hub', value: 'reports' },
  { label: 'Audit Logs', value: 'audit-logs' },
];

// --- FALLBACK MOCK DATASETS ---
const MOCK_DASHBOARD = {
  totalVendors: 14,
  activeVendors: 11,
  pendingVendors: 3,
  expiredAgreements: 2,
  expiringNdas: 1,
  expiringMous: 2,
  pendingPos: 3,
  pendingGrns: 2,
  pendingPayments: 4,
  ratingSummary: { "Excellent": 3, "Good": 6, "Average": 3, "Poor": 2 },
  vendorGrowth: [
    { name: 'Jan', vendors: 12 }, { name: 'Feb', vendors: 19 }, { name: 'Mar', vendors: 25 },
    { name: 'Apr', vendors: 32 }, { name: 'May', vendors: 45 }, { name: 'Jun', vendors: 54 }
  ],
  monthlyProcurement: [
    { month: 'Jan', amount: 125000 }, { month: 'Feb', amount: 190000 }, { month: 'Mar', amount: 320000 },
    { month: 'Apr', amount: 280000 }, { month: 'May', amount: 450000 }, { month: 'Jun', amount: 510000 }
  ],
  departmentWisePurchase: [
    { department: 'IT Department', value: 240000 },
    { department: 'Administration', value: 120000 },
    { department: 'Operations', value: 350000 }
  ],
  topVendors: [
    { vendorName: 'Global Solutions', amount: 380000 },
    { vendorName: 'Tech Suppliers Inc', amount: 240000 },
    { vendorName: 'Prime Traders', amount: 185000 }
  ],
  delayedDeliveries: [
    { vendor: 'Prime Traders', po: 'PO-4091', days: 4 },
    { vendor: 'Elite Consultants', po: 'PO-1029', days: 7 }
  ]
};

const MOCK_VENDORS = [
  { id: 1, vendorCode: 'VEND-1029', vendorName: 'Global IT Solutions', companyName: 'Global IT Solutions Ltd', vendorType: 'Service Provider', contactPerson: 'Alice Vance', mobile: '+1 456-902-3920', email: 'alice@globalit.com', status: 'Active' },
  { id: 2, vendorCode: 'VEND-4091', vendorName: 'Apex Machinery & Tools', companyName: 'Apex Machinery Inc', vendorType: 'Supplier', contactPerson: 'Bob Miller', mobile: '+91 99283-10293', email: 'sales@apexmach.com', status: 'Active' },
  { id: 3, vendorCode: 'VEND-5810', vendorName: 'Dr. Evelyn Carter', companyName: 'Evelyn Carter Consultancy', vendorType: 'Consultant', contactPerson: 'Evelyn Carter', mobile: '+44 7911-120394', email: 'carter@evelyn.org', status: 'Pending Approval' }
];

const MOCK_DOCUMENTS = [
  { id: 1, vendorId: 1, documentType: 'GST Certificate', documentNumber: '29AAAAA0000A1Z5', expiryDate: '2028-10-12', status: 'Verified', remarks: 'Clear and verified by Auditor.' },
  { id: 2, vendorId: 2, documentType: 'PAN Card', documentNumber: 'APEXM1092P', expiryDate: '2030-01-01', status: 'Pending', remarks: 'Awaiting secondary scan verification.' }
];

const MOCK_NDAS = [
  { id: 1, vendorId: 1, ndaNumber: 'NDA-2026-902A', effectiveDate: '2026-01-10', expiryDate: '2028-01-10', confidentialityLevel: 'High', status: 'Active' }
];

const MOCK_MOUS = [
  { id: 1, vendorId: 2, mouNumber: 'MOU-APEX-092', purpose: 'Supply of Heavy Science laboratory test gears', startDate: '2026-02-15', endDate: '2027-02-15', contractValue: 120000.00, approvalStatus: 'Approved' }
];

const MOCK_AGREEMENTS = [
  { id: 1, vendorId: 1, agreementNumber: 'AGR-GLB-291', agreementType: 'Annual Maintenance Contract', effectiveDate: '2026-03-01', expiryDate: '2027-03-01', contractValue: 45000.00, renewalDate: '2027-02-15', penaltyClause: '2% delay penalty', termsConditions: 'Standard service level terms.', approvalStatus: 'Approved' }
];

const MOCK_CONSULTANTS = [
  { id: 1, consultantIdStr: 'CONS-9021', name: 'Dr. Evelyn Carter', specialization: 'Organic chemistry curriculum', experienceYears: 14, hourlyRate: 150.00, performanceRating: 4.80, totalPayments: 18500.00, status: 'Active' }
];

const MOCK_PR = [
  { id: 1, requestNumber: 'PR-9021', priority: 'High', requiredDate: '2026-08-10', estimatedCost: 24000.00, justification: 'Replacing science lab gears for new session.', approvalStatus: 'Approved' }
];

const MOCK_PO = [
  { id: 1, poNumber: 'PO-4091', vendor: { id: 2, vendorCode: 'VEND-4091', vendorName: 'Apex Machinery & Tools' }, items: '[{"item":"Test Kit","rate":120,"qty":200}]', rate: 24000.00, gst: 4320.00, discount: 500.00, deliveryDate: '2026-08-20', poStatus: 'Sent', revisionNumber: 1 },
  { id: 2, poNumber: 'PO-1029', vendor: { id: 1, vendorCode: 'VEND-1029', vendorName: 'Global IT Solutions' }, items: '[{"item":"Cloud Server Setup","rate":1500,"qty":2}]', rate: 3000.00, gst: 540.00, discount: 100.00, deliveryDate: '2026-08-25', poStatus: 'Sent', revisionNumber: 0 },
  { id: 3, poNumber: 'PO-8821', vendor: { id: 2, vendorCode: 'VEND-4091', vendorName: 'Apex Machinery & Tools' }, items: '[{"item":"Safety Goggles","rate":15,"qty":500}]', rate: 7500.00, gst: 1350.00, discount: 200.00, deliveryDate: '2026-09-01', poStatus: 'Draft', revisionNumber: 0 },
  { id: 4, poNumber: 'PO-5510', vendor: { id: 3, vendorCode: 'VEND-5810', vendorName: 'Dr. Evelyn Carter' }, items: '[{"item":"Consulting Hours","rate":150,"qty":40}]', rate: 6000.00, gst: 0.00, discount: 0.00, deliveryDate: '2026-08-15', poStatus: 'Received', revisionNumber: 2 },
  { id: 5, poNumber: 'PO-3042', vendor: { id: 1, vendorCode: 'VEND-1029', vendorName: 'Global IT Solutions' }, items: '[{"item":"Laptop Upgrades","rate":400,"qty":10}]', rate: 4000.00, gst: 720.00, discount: 150.00, deliveryDate: '2026-08-30', poStatus: 'Sent', revisionNumber: 0 }
];

const MOCK_DELIVERIES = [
  { id: 1, poId: 1, purchaseOrder: { poNumber: 'PO-4091' }, expectedDate: '2026-08-20', dispatchDate: '2026-08-15', courierDetails: 'DHL Express', trackingNumber: 'DHL98710293', receivedDate: null, deliveryStatus: 'Shipped' }
];

const MOCK_GRNS = [
  { id: 1, grnNumber: 'GRN-4091', purchaseOrder: { poNumber: 'PO-4091' }, receivedQuantity: 200, acceptedQuantity: 198, rejectedQuantity: 2, inspectionRemarks: '2 units shattered during courier handling.', storeLocationId: 1 }
];

const MOCK_PAYMENTS = [
  { id: 1, invoiceNumber: 'INV-APX-8092', vendor: { vendorCode: 'VEND-4091' }, invoiceAmount: 24000.00, gstAmount: 4320.00, tdsAmount: 480.00, paymentRequestStatus: 'Approved', paymentStatus: 'Unpaid', bankTransferDetails: '', outstandingBalance: 27840.00 }
];

const MOCK_AUDITS = [
  { id: 1, createdAt: '2026-07-21 10:45:10', action: 'CREATE_VENDOR', performedBy: 'Admin', details: 'Registered new supplier: Global IT Solutions' },
  { id: 2, createdAt: '2026-07-21 10:55:00', action: 'APPROVE_PR', performedBy: 'HOD Science', details: 'Approved purchase request PR-9021' }
];

const MOCK_PERFORMANCES = [
  { 
    id: 1, 
    vendor: { vendorName: 'Global IT Solutions' }, 
    deliveryPerformance: 4.80, 
    qualityRating: 4.90, 
    pricing: 4.50, 
    complaintCount: 0, 
    overallRating: 4.73, 
    ratingLevel: 'Excellent', 
    blacklistRecommendation: false,
    feedback: "AI PERFORMANCE ASSESSMENT REPORT FOR GLOBAL IT SOLUTIONS\n==========================================\n• Overall Score Index: 4.73/5.00\n• Quality standards are excellent. Product reliability is high.\n• Dispatch times and delivery performance are highly consistent.\n\nRECOMMENDATION: Highly recommended supplier. Safe to renew and expand agreements."
  }
];
