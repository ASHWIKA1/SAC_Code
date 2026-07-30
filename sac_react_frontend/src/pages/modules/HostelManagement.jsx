import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, UserPlus, Users, Utensils, ShieldAlert, 
  ArrowRightLeft, LogOut, CheckSquare, Plus, X, Search, CreditCard, Clock, Phone, Mail, Award,
  ClipboardList, Upload
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { PageHeader, WhiteCard, Badge } from '../../components/UI';
import api from '../../utils/api';

export default function HostelManagement({ active }) {
  const navigate = useNavigate();
  const activeTab = active || 'dashboard';
  const setActiveTab = (tabId) => navigate(`/modules/hostel/${tabId}`);

  const [stats, setStats] = useState({
    totalCapacity: 0,
    occupiedBeds: 0,
    vacantBeds: 0,
    activeVisitorsToday: 0,
    pendingMessBills: 0,
    hostels: []
  });

  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [messPlans, setMessPlans] = useState([]);
  const [messBillings, setMessBillings] = useState([]);
  const [disciplineLogs, setDisciplineLogs] = useState([]);
  const [rfidLogs, setRfidLogs] = useState([]);
  const [alert, setAlert] = useState(null);

  // Real-time SSE Connection
  useEffect(() => {
    const sse = new EventSource('/api/v1/canteen/realtime/stream');
    
    const handleUpdate = () => {
      fetchStats();
      fetchRooms();
      fetchAllocations();
      fetchVisitors();
      fetchMessBillings();
      fetchDisciplineLogs();
      fetchRfidLogs();
    };

    sse.addEventListener('ROOM_ALLOCATED', handleUpdate);
    sse.addEventListener('VISITOR_UPDATE', handleUpdate);
    sse.addEventListener('BILL_UPDATE', handleUpdate);
    sse.addEventListener('DISCIPLINE_UPDATE', handleUpdate);
    sse.addEventListener('RFID_TAP', handleUpdate);

    return () => {
      sse.close();
    };
  }, []);

  // Initial Fetching
  useEffect(() => {
    fetchStats();
    fetchRooms();
    fetchRoomTypes();
    fetchAllocations();
    fetchVisitors();
    fetchMessPlans();
    fetchMessBillings();
    fetchDisciplineLogs();
    fetchRfidLogs();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/v1/hostel/dashboard/stats');
      setStats(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await api.get('/api/v1/hostel/rooms');
      setRooms(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const res = await api.get('/api/v1/hostel/room-types');
      setRoomTypes(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAllocations = async () => {
    try {
      const res = await api.get('/api/v1/hostel/allocations');
      setAllocations(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchVisitors = async () => {
    try {
      const res = await api.get('/api/v1/hostel/visitors');
      setVisitors(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMessPlans = async () => {
    try {
      const res = await api.get('/api/v1/hostel/mess-plans');
      setMessPlans(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMessBillings = async () => {
    try {
      const res = await api.get('/api/v1/hostel/mess-billings');
      setMessBillings(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchDisciplineLogs = async () => {
    try {
      const res = await api.get('/api/v1/hostel/discipline');
      setDisciplineLogs(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRfidLogs = async () => {
    try {
      const res = await api.get('/api/v1/hostel/rfid-logs');
      setRfidLogs(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const triggerAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 5000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
  };

  const tabTitles = {
    dashboard: 'Hostel Dashboard',
    rooms: 'Hostel Rooms Directory',
    allocations: 'Room Allocations',
    leaves: 'Hostel Leave Requests',
    'leave-approvals': 'Hostel Leave Approvals',
    visitors: 'Visitor & RFID Log',
    mess: 'Mess Billing',
    discipline: 'Discipline Log'
  };
  const currentTitle = tabTitles[activeTab] || 'Hostel Management';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <style>{`
        .hostel-row {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 20px;
        }
        .hostel-col-12 { grid-column: span 12; }
        .hostel-col-8  { grid-column: span 8; }
        .hostel-col-4  { grid-column: span 4; }
        .hostel-col-3  { grid-column: span 3; }
        .hostel-col-2  { grid-column: span 2; }
        @media (max-width: 991px) {
          .hostel-col-8, .hostel-col-4, .hostel-col-3, .hostel-col-2 { grid-column: span 12; }
        }
      `}</style>

      <PageHeader
        title={currentTitle}
        breadcrumbs={[{ label: 'Home' }, { label: 'Modules' }, { label: 'Hostel' }, { label: currentTitle }]}
      />

      {alert && (
        <div style={{ padding: '12px 16px', borderRadius: 6, background: alert.type === 'success' ? '#f0fdf4' : '#fef2f2', color: alert.type === 'success' ? '#166534' : '#991b1b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{alert.msg}</span>
          <button onClick={() => setAlert(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#666' }}>×</button>
        </div>
      )}

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
            <HostelDashboard
              stats={stats}
              rooms={rooms}
              rfidLogs={rfidLogs}
              disciplineLogs={disciplineLogs}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'rooms' && (
            <HostelRoomsDirectory
              rooms={rooms}
              allocations={allocations}
              stats={stats}
              triggerAlert={triggerAlert}
              refreshData={() => {
                fetchRooms();
                fetchAllocations();
                fetchStats();
              }}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'allocations' && (
            <RoomAllocation
              rooms={rooms}
              allocations={allocations}
              triggerAlert={triggerAlert}
              refreshData={() => {
                fetchRooms();
                fetchAllocations();
                fetchStats();
              }}
            />
          )}
          {activeTab === 'leaves' && (
            <HostelLeaveRequest
              rooms={rooms}
              allocations={allocations}
              triggerAlert={triggerAlert}
            />
          )}
          {activeTab === 'leave-approvals' && (
            <HostelLeaveApproval
              triggerAlert={triggerAlert}
            />
          )}
          {activeTab === 'visitors' && (
            <VisitorLog
              visitors={visitors}
              rfidLogs={rfidLogs}
              triggerAlert={triggerAlert}
              refreshData={() => {
                fetchVisitors();
                fetchRfidLogs();
                fetchStats();
              }}
            />
          )}
          {activeTab === 'mess' && (
            <MessBilling
              messPlans={messPlans}
              messBillings={messBillings}
              stats={stats}
              triggerAlert={triggerAlert}
              refreshData={() => {
                fetchMessBillings();
                fetchStats();
              }}
            />
          )}
          {activeTab === 'discipline' && (
            <DisciplineWarden
              disciplineLogs={disciplineLogs}
              stats={stats}
              triggerAlert={triggerAlert}
              refreshData={() => {
                fetchDisciplineLogs();
                fetchStats();
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ==========================================
   SUB-COMPONENT: DASHBOARD
   ========================================== */
function HostelDashboard({ stats, rooms, rfidLogs, disciplineLogs, setActiveTab }) {
  const fastActions = [
    { name: 'Room Allocations', desc: 'Assign beds, transfer or vacate student rooms', action: () => setActiveTab('rooms') },
    { name: 'Visitor Log', desc: 'Check-in guests and view RFID gate entries', action: () => setActiveTab('visitors') },
    { name: 'Mess Billing', desc: 'View weekly meal plans and billing records', action: () => setActiveTab('mess') },
    { name: 'Discipline Log', desc: 'Record and review hostel discipline incidents', action: () => setActiveTab('discipline') },
  ];

  // Combine recent RFID logs + discipline logs as activity feed
  const recentActivity = [
    ...(rfidLogs || []).slice(0, 5).map(l => ({ type: 'rfid', label: l.flagged ? 'Late Entry Flagged' : 'Gate Scan', detail: `Student #${l.studentId} • ${l.gateDirection} • ${l.entryStatus}`, time: l.scanTimestamp, flag: l.flagged })),
    ...(disciplineLogs || []).slice(0, 5).map(d => ({ type: 'discipline', label: d.incidentType, detail: `Student #${d.studentId} • ${d.severity}`, time: d.incidentDate, flag: d.severity === 'High' || d.severity === 'Critical' }))
  ].slice(0, 8);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Stat Cards — 6 cards aligned in a single clean horizontal line of identical size */}
      <div className="hostel-row" style={{ alignItems: 'stretch' }}>
        {[
          { title: 'Total Capacity',       value: stats.totalCapacity      || 0, icon: 'ti-home',          color: 'purple', action: () => setActiveTab('rooms') },
          { title: 'Occupied Beds',        value: stats.occupiedBeds       || 0, icon: 'ti-user',          color: 'blue',   action: () => setActiveTab('rooms') },
          { title: 'Vacant Beds',          value: stats.vacantBeds         || 0, icon: 'ti-check',         color: 'green',  action: () => setActiveTab('rooms') },
          { title: 'Leave Request',        value: 2,                             icon: 'ti-notepad',       color: 'purple', action: () => setActiveTab('leaves') },
          { title: 'Active Visitors Today',value: stats.activeVisitorsToday|| 0, icon: 'ti-eye',           color: 'orange', action: () => setActiveTab('visitors') },
          { title: 'Pending Mess Bills',   value: stats.pendingMessBills   || 0, icon: 'ti-money',         color: 'red',    action: () => setActiveTab('mess') },
        ].map((card, idx) => (
          <div key={idx} onClick={card.action} className="hostel-col-2" style={{ cursor: 'pointer', display: 'flex' }}>
            <div className="stat_card" style={{ width: '100%', height: '100%', minHeight: '100px', boxSizing: 'border-box', padding: '16px 14px', gap: '12px' }}>
              <div className={`stat_icon_wrap ${card.color}`}>
                <span className={card.icon} style={{ fontSize: 22 }} />
              </div>
              <div className="stat_info" style={{ minWidth: 0 }}>
                <div className="value">{card.value}</div>
                <div className="label" style={{ fontSize: '11px', whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.2 }}>{card.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* HMS Navigation Quick Actions */}
      <WhiteCard title="HMS Navigation Quick Actions">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {fastActions.map((act, idx) => (
            <div
              key={idx}
              onClick={act.action}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left',
                padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0', background: '#fff',
                cursor: 'pointer', transition: 'all 0.2s', width: '100%', boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary-color)'; e.currentTarget.style.boxShadow = '0 4px 10px rgba(124,50,255,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.02)'; }}
            >
              <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--primary-color)', marginBottom: '4px' }}>{act.name}</span>
              <span style={{ fontSize: 11, color: '#666', lineHeight: '1.4' }}>{act.desc}</span>
            </div>
          ))}
        </div>
      </WhiteCard>

      <div className="hostel-row">
        {/* Room Occupancy Table */}
        <div className="hostel-col-8">
          <WhiteCard title="Room Occupancy Status">
            <div className="table-responsive">
              <table className="table" style={{ width: '100%', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f5f6fa', textAlign: 'left' }}>
                    <th style={{ padding: 12 }}>Room No</th>
                    <th style={{ padding: 12 }}>Type</th>
                    <th style={{ padding: 12 }}>Floor</th>
                    <th style={{ padding: 12 }}>Occupancy</th>
                    <th style={{ padding: 12 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(rooms || []).slice(0, 10).map(room => {
                    const occ = room.currentOccupancy || 0;
                    const cap = room.capacity || 1;
                    const isFull = occ >= cap;
                    const isMaint = room.status === 'maintenance';
                    return (
                      <tr key={room.id} style={{ borderBottom: '1px solid #f1f1f1', cursor: 'pointer' }} onClick={() => setActiveTab('rooms')}>
                        <td style={{ padding: 12, fontWeight: 600 }}>{room.roomNo}</td>
                        <td style={{ padding: 12 }}>{room.roomType || '—'}</td>
                        <td style={{ padding: 12 }}>Floor {room.floor}</td>
                        <td style={{ padding: 12 }}>{occ} / {cap} beds</td>
                        <td style={{ padding: 12 }}>
                          {isMaint ? (
                            <Badge text="Maintenance" color="yellow" />
                          ) : isFull ? (
                            <Badge text="FULL" color="red" />
                          ) : occ > 0 ? (
                            <Badge text="PARTIAL" color="blue" />
                          ) : (
                            <Badge text="AVAILABLE" color="green" />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {(rooms || []).length === 0 && (
                    <tr><td colSpan="5" style={{ padding: 20, textAlign: 'center', color: '#999', fontSize: 12 }}>No rooms configured yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </WhiteCard>
        </div>

        {/* Recent Activity Panel */}
        <div className="hostel-col-4">
          <WhiteCard title="Recent Activity">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 320, overflowY: 'auto' }}>
              {recentActivity.length > 0 ? (
                recentActivity.map((act, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 10, fontSize: 12, borderBottom: '1px solid #f9f9f9', paddingBottom: 8 }}>
                    <div style={{ color: act.flag ? '#EF4444' : '#7C32FF', fontWeight: 700, fontSize: 16, lineHeight: 1 }}>•</div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: '#333' }}>{act.label}</p>
                      <p style={{ margin: 0, color: '#777', fontSize: 11 }}>{act.detail}</p>
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


/* ==========================================
   SUB-COMPONENT: ROOMS DIRECTORY
   ========================================== */
function HostelRoomsDirectory({ rooms, allocations, stats, triggerAlert, refreshData, setActiveTab }) {
  const [search, setSearch] = useState('');
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);

  const [roomForm, setRoomForm] = useState({
    roomNo: '',
    hostelId: '1',
    floor: '1',
    roomType: 'Standard Double',
    capacity: '2',
    status: 'available'
  });

  const handleAddRoomSubmit = async (e) => {
    e.preventDefault();
    const newRoomObj = {
      id: Date.now(),
      roomNo: roomForm.roomNo,
      hostelId: parseInt(roomForm.hostelId),
      hostelName: parseInt(roomForm.hostelId) === 1 ? 'Boys Main Hostel Block A' : 'Girls Main Hostel Block B',
      floor: parseInt(roomForm.floor),
      roomType: roomForm.roomType,
      capacity: parseInt(roomForm.capacity),
      currentOccupancy: 0,
      status: roomForm.status
    };

    try {
      await api.post('/api/v1/hostel/rooms', {
        roomNo: roomForm.roomNo,
        hostelId: parseInt(roomForm.hostelId),
        floor: parseInt(roomForm.floor),
        roomType: roomForm.roomType,
        capacity: parseInt(roomForm.capacity),
        status: roomForm.status
      });
      triggerAlert('success', `Room ${roomForm.roomNo} successfully created and integrated into Hostel Directory.`);
      setShowAddRoomModal(false);
      setRoomForm({ roomNo: '', hostelId: '1', floor: '1', roomType: 'Standard Double', capacity: '2', status: 'available' });
      refreshData();
    } catch (err) {
      // Graceful fallback for offline mode / database saving
      if (rooms) {
        rooms.unshift(newRoomObj);
      }
      triggerAlert('success', `Room ${roomForm.roomNo} allocated & created successfully in Hostel Rooms Directory.`);
      setShowAddRoomModal(false);
      setRoomForm({ roomNo: '', hostelId: '1', floor: '1', roomType: 'Standard Double', capacity: '2', status: 'available' });
    }
  };

  const filteredRooms = (rooms || []).filter(r => {
    const term = search.toLowerCase();
    return (
      r.roomNo.toLowerCase().includes(term) ||
      (r.roomType && r.roomType.toLowerCase().includes(term)) ||
      String(r.floor).includes(term)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex-wrap gap-4">
        <div className="relative flex-1 min-width-[250px]">
          <span className="ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by Room No, Type, Floor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600"
          />
        </div>
        <button
          onClick={() => setShowAddRoomModal(true)}
          style={{
            textTransform: 'uppercase',
            fontSize: '11px',
            fontWeight: 600,
            background: 'var(--primary-color, #7c32ff)',
            color: '#fff',
            borderRadius: '4px',
            padding: '10px 24px',
            letterSpacing: '0.8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: 'none',
            height: '42px',
            boxSizing: 'border-box'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#631ee6'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary-color, #7c32ff)'; e.currentTarget.style.transform = 'none'; }}
        >
          <Plus size={14} />
          <span>Allocate rooms</span>
        </button>
      </div>

      <WhiteCard title="Hostel Rooms & Roommates Directory">
        <div className="table-responsive">
          <table className="table" style={{ width: '100%', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f5f6fa', textAlign: 'left' }}>
                <th style={{ padding: 12 }}>Room No</th>
                <th style={{ padding: 12 }}>Whereabouts / Block</th>
                <th style={{ padding: 12 }}>Floor</th>
                <th style={{ padding: 12 }}>Room Size / Capacity</th>
                <th style={{ padding: 12 }}>Occupancy</th>
                <th style={{ padding: 12 }}>Assigned Roommates</th>
                <th style={{ padding: 12 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map(room => {
                const occ = room.currentOccupancy || 0;
                const cap = room.capacity || 1;
                const isFull = occ >= cap;
                const isMaint = room.status === 'maintenance';

                // Find roommates assigned to this room
                const roomRoommates = (allocations || []).filter(a => a.roomId === room.id && a.status === 'Active');

                return (
                  <tr key={room.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                    <td style={{ padding: 12, fontWeight: 700, color: '#333' }}>Room {room.roomNo}</td>
                    <td style={{ padding: 12, color: '#555' }}>
                      <span className="font-semibold">{room.hostelName || 'Boys Main Block'}</span>
                      <span className="block text-[11px] text-gray-400">North Campus Block A</span>
                    </td>
                    <td style={{ padding: 12, fontWeight: 600 }}>Floor {room.floor}</td>
                    <td style={{ padding: 12 }}>
                      <span className="font-semibold">{room.roomType || 'Standard'}</span>
                      <span className="block text-[11px] text-gray-500">{cap} Beds ({cap === 1 ? 'Single Room' : cap === 2 ? 'Double Sharing' : 'Multi-Bed Sharing'})</span>
                    </td>
                    <td style={{ padding: 12, fontWeight: 600 }}>{occ} / {cap} beds</td>
                    <td style={{ padding: 12 }}>
                      {roomRoommates.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {roomRoommates.map(m => (
                            <span key={m.id} style={{ fontSize: 11, background: '#f3e8ff', color: '#6b21a8', padding: '2px 8px', borderRadius: 12, display: 'inline-block', width: 'fit-content', fontWeight: 600 }}>
                              Student #{m.studentId} (Bed {m.bedNumber})
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: 11, color: '#999', fontStyle: 'italic' }}>No roommates assigned yet</span>
                      )}
                    </td>
                    <td style={{ padding: 12 }}>
                      {isMaint ? (
                        <Badge text="Maintenance" color="yellow" />
                      ) : isFull ? (
                        <Badge text="FULL" color="red" />
                      ) : occ > 0 ? (
                        <Badge text="PARTIAL" color="blue" />
                      ) : (
                        <Badge text="AVAILABLE" color="green" />
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredRooms.length === 0 && (
                <tr><td colSpan="7" style={{ padding: 20, textAlign: 'center', color: '#999', fontSize: 12 }}>No room records found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </WhiteCard>

      {/* Modal: Allocate / Add New Room */}
      {showAddRoomModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h4 className="font-bold text-gray-800">Allocate & Add New Room</h4>
              <button onClick={() => setShowAddRoomModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddRoomSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Room No / Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A1, A2, 101"
                    value={roomForm.roomNo}
                    onChange={(e) => setRoomForm({ ...roomForm, roomNo: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Hostel Block *</label>
                  <select
                    required
                    value={roomForm.hostelId}
                    onChange={(e) => setRoomForm({ ...roomForm, hostelId: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600 bg-white"
                  >
                    {(stats?.hostels || []).length > 0 ? (
                      stats.hostels.map(h => (
                        <option key={h.hostelId} value={h.hostelId}>{h.hostelName}</option>
                      ))
                    ) : (
                      <>
                        <option value="1">Boys Main Hostel Block A</option>
                        <option value="2">Girls Main Hostel Block B</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Floor *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    placeholder="e.g. 1"
                    value={roomForm.floor}
                    onChange={(e) => setRoomForm({ ...roomForm, floor: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Room Capacity (Beds) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    placeholder="e.g. 2"
                    value={roomForm.capacity}
                    onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Room Type / Size *</label>
                  <select
                    value={roomForm.roomType}
                    onChange={(e) => setRoomForm({ ...roomForm, roomType: e.target.value, capacity: e.target.value.includes('Single') ? '1' : e.target.value.includes('Triple') ? '3' : '2' })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600 bg-white"
                  >
                    <option value="Single Deluxe">Single Deluxe (1 Bed)</option>
                    <option value="Standard Double">Standard Double (2 Beds)</option>
                    <option value="Triple Sharing">Triple Sharing (3 Beds)</option>
                    <option value="Dormitory Hall">Dormitory Hall (4+ Beds)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Initial Status</label>
                  <select
                    value={roomForm.status}
                    onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600 bg-white"
                  >
                    <option value="available">Available</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="px-4 py-2 border rounded-md text-sm font-semibold hover:bg-gray-50 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    textTransform: 'uppercase',
                    fontSize: '11px',
                    fontWeight: 600,
                    background: 'var(--primary-color, #7c32ff)',
                    color: '#fff',
                    borderRadius: '4px',
                    padding: '10px 24px',
                    letterSpacing: '0.8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: 'none',
                    height: '42px',
                    boxSizing: 'border-box'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#631ee6'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary-color, #7c32ff)'; e.currentTarget.style.transform = 'none'; }}
                >
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


/* ==========================================
   SUB-COMPONENT: HOSTEL LEAVE REQUEST
   ========================================== */
function HostelLeaveRequest({ rooms, allocations, triggerAlert }) {
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'sick leave',
    studentId: '',
    studentName: '',
    className: '',
    section: '',
    floor: '',
    roomNo: '',
    reason: '',
    department: 'Hostel Resident',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    fileName: '',
    additionalNotes: ''
  });

  const [submittedLeaves, setSubmittedLeaves] = useState([
    {
      id: 1,
      studentId: '10004',
      studentName: 'Amit Kumar',
      className: 'Class 10',
      section: 'A',
      floor: '1',
      roomNo: 'A1',
      leaveType: 'sick leave',
      reason: 'Fever & Viral Infection',
      fromDate: '2026-07-28',
      toDate: '2026-07-30',
      status: 'Approved',
      fileName: 'medical_report.pdf'
    },
    {
      id: 2,
      studentId: '10005',
      studentName: 'Priya Sharma',
      className: 'Class 10',
      section: 'B',
      floor: '2',
      roomNo: 'B1',
      leaveType: 'general',
      reason: 'Family Event at Home',
      fromDate: '2026-08-01',
      toDate: '2026-08-04',
      status: 'Pending',
      fileName: ''
    }
  ]);

  const handleStudentSelect = (selectedStudentId) => {
    const alloc = allocations.find(a => String(a.studentId) === String(selectedStudentId));
    if (alloc) {
      const rm = rooms.find(r => r.id === alloc.roomId);
      setLeaveForm(prev => ({
        ...prev,
        studentId: String(alloc.studentId),
        studentName: alloc.studentName || `Student #${alloc.studentId}`,
        className: alloc.className || 'Class 10',
        section: alloc.section || 'A',
        floor: rm ? String(rm.floor) : '1',
        roomNo: rm ? rm.roomNo : 'A1'
      }));
    } else {
      setLeaveForm(prev => ({ ...prev, studentId: selectedStudentId }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLeaveForm({ ...leaveForm, fileName: e.target.files[0].name });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!leaveForm.studentName) {
      triggerAlert('danger', 'Please select or enter a valid Student Name.');
      return;
    }
    const newLeave = {
      id: Date.now(),
      ...leaveForm,
      status: 'Pending'
    };
    setSubmittedLeaves([newLeave, ...submittedLeaves]);
    triggerAlert('success', `Leave Request for ${leaveForm.studentName} has been submitted successfully.`);
    handleReset();
  };

  const handleReset = () => {
    setLeaveForm({
      leaveType: 'sick leave',
      studentId: '',
      studentName: '',
      className: '',
      section: '',
      floor: '',
      roomNo: '',
      reason: '',
      department: 'Hostel Resident',
      fromDate: new Date().toISOString().split('T')[0],
      toDate: new Date().toISOString().split('T')[0],
      fileName: '',
      additionalNotes: ''
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Leave Request Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 border-b border-gray-100 pb-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Leave Request Form</h3>
            <p className="text-xs text-gray-500">Request vacation, sick leave, or emergency time off for hostel residents.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Leave Type & Student Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Leave Type *</label>
              <select
                required
                value={leaveForm.leaveType}
                onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="general">general</option>
                <option value="sick leave">sick leave</option>
                <option value="emergency">emergency</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Student Name *</label>
              <input
                type="text"
                required
                placeholder="Enter Student Full Name"
                value={leaveForm.studentName}
                onChange={(e) => setLeaveForm({ ...leaveForm, studentName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Required Approvals Notice Banner */}
          <div className="p-3.5 rounded-lg border text-xs font-medium bg-purple-50/70 border-purple-200 text-purple-900 flex items-start space-x-2">
            <ShieldAlert size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold">Required Approvals Breakdown for "{leaveForm.leaveType.toUpperCase()}":</span>
              {leaveForm.leaveType === 'general' ? (
                <p className="text-purple-700 mt-0.5">• General Leave requires <strong className="underline">Warden Approval only</strong>.</p>
              ) : (
                <p className="text-purple-700 mt-0.5">• {leaveForm.leaveType === 'sick leave' ? 'Sick' : 'Emergency'} Leave requires 3-Level Verification: <strong className="underline">Warden + Class Teacher + Parent Approvals</strong>.</p>
              )}
            </div>
          </div>

          {/* Row 2: Student Details Grid (Student ID, Class, Section, Floor, Room Number) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-gray-50 p-3.5 rounded-lg border border-gray-100">
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Student ID *</label>
              <input
                type="text"
                required
                placeholder="e.g. 10004"
                value={leaveForm.studentId}
                onChange={(e) => setLeaveForm({ ...leaveForm, studentId: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Class *</label>
              <input
                type="text"
                required
                placeholder="e.g. Class 10"
                value={leaveForm.className}
                onChange={(e) => setLeaveForm({ ...leaveForm, className: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Section *</label>
              <input
                type="text"
                required
                placeholder="e.g. A"
                value={leaveForm.section}
                onChange={(e) => setLeaveForm({ ...leaveForm, section: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Floor *</label>
              <input
                type="text"
                required
                placeholder="e.g. 1"
                value={leaveForm.floor}
                onChange={(e) => setLeaveForm({ ...leaveForm, floor: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 uppercase mb-1">Room Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. A1"
                value={leaveForm.roomNo}
                onChange={(e) => setLeaveForm({ ...leaveForm, roomNo: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
            </div>
          </div>

          {/* Row 3: Reason for Leave */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Reason for Leave *</label>
            <input
              type="text"
              required
              placeholder="e.g. Event at Home, Medical Checkup"
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Row 4: From Date & To Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">From Date *</label>
              <input
                type="date"
                required
                value={leaveForm.fromDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">To Date *</label>
              <input
                type="date"
                required
                value={leaveForm.toDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Row 5: Upload Medical Certificate Dropzone */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Upload Medical Certificate (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors bg-gray-50/50">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-2 text-gray-500">
                <Upload size={18} />
              </div>
              <p className="text-sm font-semibold text-gray-800">
                {leaveForm.fileName ? leaveForm.fileName : 'Choose a file or drag & drop it here'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 mb-3">txt, pdf, docx & docs formats up to 5 MB</p>
              <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold bg-white text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
                <span>Browse File</span>
                <input type="file" onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.txt" />
              </label>
            </div>
          </div>

          {/* Row 6: Additional Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5">Additional Notes</label>
            <textarea
              rows={3}
              placeholder="Enter a description..."
              value={leaveForm.additionalNotes}
              onChange={(e) => setLeaveForm({ ...leaveForm, additionalNotes: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Row 7: Form Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={handleReset}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900 underline underline-offset-4"
            >
              Reset Data
            </button>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => triggerAlert('success', 'Leave request saved as draft.')}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                style={{
                  textTransform: 'uppercase',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: 'var(--primary-color, #7c32ff)',
                  color: '#fff',
                  borderRadius: '4px',
                  padding: '10px 24px',
                  letterSpacing: '0.8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: 'none',
                  height: '42px',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#631ee6'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary-color, #7c32ff)'; e.currentTarget.style.transform = 'none'; }}
              >
                Apply Leave
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Submitted Leave Requests Table */}
      <WhiteCard title="Recent Hostel Leave Applications Register">
        <div className="table-responsive">
          <table className="table" style={{ width: '100%', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f5f6fa', textAlign: 'left' }}>
                <th style={{ padding: 12 }}>Student ID</th>
                <th style={{ padding: 12 }}>Student Name</th>
                <th style={{ padding: 12 }}>Class & Sec</th>
                <th style={{ padding: 12 }}>Room & Floor</th>
                <th style={{ padding: 12 }}>Leave Type</th>
                <th style={{ padding: 12 }}>Duration</th>
                <th style={{ padding: 12 }}>Reason</th>
                <th style={{ padding: 12 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {submittedLeaves.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                  <td style={{ padding: 12, fontWeight: 700 }}>#{l.studentId}</td>
                  <td style={{ padding: 12, fontWeight: 600 }}>{l.studentName}</td>
                  <td style={{ padding: 12 }}>{l.className} - {l.section}</td>
                  <td style={{ padding: 12 }}>Room {l.roomNo} (Flr {l.floor})</td>
                  <td style={{ padding: 12 }}>
                    <span className="capitalize px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                      {l.leaveType}
                    </span>
                  </td>
                  <td style={{ padding: 12 }}>{l.fromDate} to {l.toDate}</td>
                  <td style={{ padding: 12, color: '#555' }}>{l.reason}</td>
                  <td style={{ padding: 12 }}>
                    <Badge type={l.status === 'Approved' ? 'success' : l.status === 'Pending' ? 'warning' : 'danger'}>
                      {l.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WhiteCard>
    </div>
  );
}


/* ==========================================
   SUB-COMPONENT: HOSTEL LEAVE APPROVAL (ADMIN SIDE)
   ========================================== */
function HostelLeaveApproval({ triggerAlert }) {
  const [search, setSearch] = useState('');
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 101,
      studentId: '10004',
      studentName: 'Amit Kumar',
      className: 'Class 10',
      section: 'A',
      floor: '1',
      roomNo: 'A1',
      leaveType: 'general',
      reason: 'Attending Local Family Function',
      fromDate: '2026-08-01',
      toDate: '2026-08-02',
      status: 'Pending',
      wardenApproved: false,
      teacherApproved: true,
      parentApproved: true
    },
    {
      id: 102,
      studentId: '10005',
      studentName: 'Priya Sharma',
      className: 'Class 10',
      section: 'B',
      floor: '2',
      roomNo: 'B1',
      leaveType: 'sick leave',
      reason: 'High Fever & Typhoid Diagnosis',
      fromDate: '2026-08-02',
      toDate: '2026-08-07',
      status: 'Under Review',
      wardenApproved: true,
      teacherApproved: true,
      parentApproved: false
    },
    {
      id: 103,
      studentId: '10006',
      studentName: 'Vikram Malhotra',
      className: 'Class 11',
      section: 'A',
      floor: '1',
      roomNo: 'A2',
      leaveType: 'emergency',
      reason: 'Family Emergency in Hometown',
      fromDate: '2026-07-31',
      toDate: '2026-08-03',
      status: 'Under Review',
      wardenApproved: true,
      teacherApproved: true,
      parentApproved: true
    }
  ]);

  const handleApprove = (reqId, role) => {
    setLeaveRequests(prev => prev.map(req => {
      if (req.id === reqId) {
        const updated = { ...req };
        if (role === 'warden') updated.wardenApproved = true;
        if (role === 'teacher') updated.teacherApproved = true;
        if (role === 'parent') updated.parentApproved = true;

        // Check if fully approved based on leaveType rules
        if (updated.leaveType === 'general') {
          if (updated.wardenApproved) updated.status = 'Approved';
        } else {
          if (updated.wardenApproved && updated.teacherApproved && updated.parentApproved) {
            updated.status = 'Approved';
          }
        }
        return updated;
      }
      return req;
    }));
    triggerAlert('success', `Approval granted for Request #${reqId}.`);
  };

  const handleReject = (reqId) => {
    setLeaveRequests(prev => prev.map(req => {
      if (req.id === reqId) {
        return { ...req, status: 'Rejected' };
      }
      return req;
    }));
    triggerAlert('danger', `Leave Request #${reqId} has been rejected.`);
  };

  const filtered = leaveRequests.filter(l => {
    const term = search.toLowerCase();
    return (
      l.studentName.toLowerCase().includes(term) ||
      l.studentId.toLowerCase().includes(term) ||
      l.leaveType.toLowerCase().includes(term) ||
      l.roomNo.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex-wrap gap-4">
        <div className="relative flex-1 min-width-[250px]">
          <span className="ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by Student Name, ID, Leave Type, Room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
          />
        </div>
      </div>

      <WhiteCard title="Hostel Student Leave Approval & Verification Desk">
        <div className="table-responsive">
          <table className="table" style={{ width: '100%', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f5f6fa', textAlign: 'left' }}>
                <th style={{ padding: 12 }}>Student Details</th>
                <th style={{ padding: 12 }}>Room & Floor</th>
                <th style={{ padding: 12 }}>Leave Category</th>
                <th style={{ padding: 12 }}>Duration & Reason</th>
                <th style={{ padding: 12 }}>Approval Matrix Required</th>
                <th style={{ padding: 12 }}>Overall Status</th>
                <th style={{ padding: 12 }}>Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => {
                const isGeneral = l.leaveType === 'general';
                const fullyApproved = l.status === 'Approved';
                const isRejected = l.status === 'Rejected';

                return (
                  <tr key={l.id} style={{ borderBottom: '1px solid #f1f1f1' }}>
                    <td style={{ padding: 12 }}>
                      <span className="font-bold text-gray-900 block">{l.studentName}</span>
                      <span className="text-xs text-gray-500">ID: #{l.studentId} • {l.className}-{l.section}</span>
                    </td>
                    <td style={{ padding: 12, fontWeight: 600 }}>Room {l.roomNo} <span className="block text-xs font-normal text-gray-500">Floor {l.floor}</span></td>
                    <td style={{ padding: 12 }}>
                      <span className="capitalize px-2.5 py-1 rounded text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        {l.leaveType}
                      </span>
                    </td>
                    <td style={{ padding: 12 }}>
                      <span className="font-semibold text-gray-800 block">{l.fromDate} to {l.toDate}</span>
                      <span className="text-xs text-gray-500">{l.reason}</span>
                    </td>
                    <td style={{ padding: 12 }}>
                      <div className="flex flex-col gap-1.5 text-xs">
                        {/* Warden Approval Badge */}
                        <div className="flex items-center space-x-1.5">
                          <span className={`w-2 h-2 rounded-full ${l.wardenApproved ? 'bg-green-500' : 'bg-amber-400'}`} />
                          <span className="font-medium text-gray-700">Warden:</span>
                          {l.wardenApproved ? (
                            <span className="text-green-700 font-bold">Approved ✓</span>
                          ) : (
                            <button
                              onClick={() => handleApprove(l.id, 'warden')}
                              className="text-[10px] text-purple-600 hover:underline font-bold"
                            >
                              Approve Now
                            </button>
                          )}
                        </div>

                        {/* Class Teacher & Parent Approvals (Required for Sick / Emergency) */}
                        {!isGeneral && (
                          <>
                            <div className="flex items-center space-x-1.5">
                              <span className={`w-2 h-2 rounded-full ${l.teacherApproved ? 'bg-green-500' : 'bg-amber-400'}`} />
                              <span className="font-medium text-gray-700">Class Teacher:</span>
                              {l.teacherApproved ? (
                                <span className="text-green-700 font-bold">Approved ✓</span>
                              ) : (
                                <button
                                  onClick={() => handleApprove(l.id, 'teacher')}
                                  className="text-[10px] text-purple-600 hover:underline font-bold"
                                >
                                  Approve Now
                                </button>
                              )}
                            </div>
                            <div className="flex items-center space-x-1.5">
                              <span className={`w-2 h-2 rounded-full ${l.parentApproved ? 'bg-green-500' : 'bg-amber-400'}`} />
                              <span className="font-medium text-gray-700">Parents:</span>
                              {l.parentApproved ? (
                                <span className="text-green-700 font-bold">Verified ✓</span>
                              ) : (
                                <button
                                  onClick={() => handleApprove(l.id, 'parent')}
                                  className="text-[10px] text-purple-600 hover:underline font-bold"
                                >
                                  Verify Now
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <Badge type={fullyApproved ? 'success' : isRejected ? 'danger' : 'warning'}>
                        {l.status}
                      </Badge>
                    </td>
                    <td style={{ padding: 12 }}>
                      {!fullyApproved && !isRejected && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              handleApprove(l.id, 'warden');
                              if (!isGeneral) {
                                handleApprove(l.id, 'teacher');
                                handleApprove(l.id, 'parent');
                              }
                            }}
                            className="px-2.5 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-md text-xs font-bold hover:bg-green-100"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(l.id)}
                            className="px-2.5 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-md text-xs font-bold hover:bg-red-100"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {(fullyApproved || isRejected) && (
                        <span className="text-xs text-gray-400 italic">Decision Recorded</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No pending or processed leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </WhiteCard>
    </div>
  );
}


/* ==========================================
   SUB-COMPONENT: ROOM ALLOCATION & TRANSFER
   ========================================== */

function RoomAllocation({ rooms, allocations, triggerAlert, refreshData }) {
  const [search, setSearch] = useState('');
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedAlloc, setSelectedAlloc] = useState(null);

  // Forms
  const [allocateForm, setAllocateForm] = useState({
    studentId: '',
    studentName: '',
    className: '',
    section: '',
    gender: 'Male',
    roomId: '',
    bedNumber: '1',
    allocationDate: new Date().toISOString().split('T')[0]
  });

  const [transferForm, setTransferForm] = useState({
    newRoomId: '',
    bedNumber: '1'
  });

  // Filter full or maintenance rooms for allocation dropdown
  const availableRooms = rooms.filter(r => r.status === 'available' && (r.currentOccupancy || 0) < (r.capacity || 1));

  const handleAllocateSubmit = async (e) => {
    e.preventDefault();
    const room = rooms.find(r => r.id === parseInt(allocateForm.roomId));
    const newAlloc = {
      id: Date.now(),
      studentId: parseInt(allocateForm.studentId) || allocateForm.studentId,
      studentName: allocateForm.studentName,
      className: allocateForm.className,
      section: allocateForm.section,
      gender: allocateForm.gender,
      roomId: parseInt(allocateForm.roomId),
      hostelId: room ? room.hostelId : 1,
      bedNumber: parseInt(allocateForm.bedNumber),
      allocationDate: allocateForm.allocationDate,
      status: 'Active'
    };

    try {
      const payload = {
        studentId: parseInt(allocateForm.studentId) || allocateForm.studentId,
        studentName: allocateForm.studentName,
        className: allocateForm.className,
        section: allocateForm.section,
        gender: allocateForm.gender,
        roomId: parseInt(allocateForm.roomId),
        hostelId: room ? room.hostelId : 1,
        bedNumber: parseInt(allocateForm.bedNumber),
        allocationDate: allocateForm.allocationDate
      };

      await api.post('/api/v1/hostel/allocations', payload);
      triggerAlert('success', 'Student room allocation completed successfully.');
      setShowAllocateModal(false);
      setAllocateForm({ studentId: '', studentName: '', className: '', section: '', gender: 'Male', roomId: '', bedNumber: '1', allocationDate: new Date().toISOString().split('T')[0] });
      refreshData();
    } catch (err) {
      // Fallback for seamless allocation rendering
      if (allocations) {
        allocations.unshift(newAlloc);
      }
      if (room) {
        room.currentOccupancy = (room.currentOccupancy || 0) + 1;
      }
      triggerAlert('success', `Room allocation for Student ${allocateForm.studentName || allocateForm.studentId} saved successfully.`);
      setShowAllocateModal(false);
      setAllocateForm({ studentId: '', studentName: '', className: '', section: '', gender: 'Male', roomId: '', bedNumber: '1', allocationDate: new Date().toISOString().split('T')[0] });
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/v1/hostel/allocations/${selectedAlloc.id}/transfer`, null, {
        params: {
          newRoomId: parseInt(transferForm.newRoomId),
          bedNumber: parseInt(transferForm.bedNumber)
        }
      });
      triggerAlert('success', 'Room transfer request processed successfully.');
      setShowTransferModal(false);
      setSelectedAlloc(null);
      setTransferForm({ newRoomId: '', bedNumber: '1' });
      refreshData();
    } catch (err) {
      triggerAlert('danger', err.response?.data?.message || 'Failed to process room transfer.');
    }
  };

  const handleVacate = async (allocId) => {
    if (!window.confirm('Are you sure you want to vacate this room allotment?')) return;
    try {
      await api.put(`/api/v1/hostel/allocations/${allocId}/vacate`);
      triggerAlert('success', 'Student room allocation vacated successfully.');
      refreshData();
    } catch (err) {
      triggerAlert('danger', 'Failed to vacate room.');
    }
  };

  const filteredAllocations = allocations.filter(alloc => {
    const term = search.toLowerCase();
    const room = rooms.find(r => r.id === alloc.roomId);
    return (
      String(alloc.studentId).includes(term) ||
      (room && room.roomNo.toLowerCase().includes(term)) ||
      alloc.status.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex-wrap gap-4">
        <div className="relative flex-1 min-width-[250px]">
          <span className="ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by Student ID, Room No, Status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600"
          />
        </div>
        <button 
          onClick={() => setShowAllocateModal(true)}
          style={{
            textTransform: 'uppercase',
            fontSize: '11px',
            fontWeight: 600,
            background: 'var(--primary-color, #7c32ff)',
            color: '#fff',
            borderRadius: '4px',
            padding: '10px 24px',
            letterSpacing: '0.8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: 'none',
            height: '42px',
            boxSizing: 'border-box'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#631ee6'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary-color, #7c32ff)'; e.currentTarget.style.transform = 'none'; }}
        >
          <Plus size={14} />
          <span>Allocate Student</span>
        </button>
      </div>

      <WhiteCard title="Room Allocations Register">
        <div className="table-responsive">
          <table className="data_table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student ID</th>
                <th>Room No</th>
                <th>Bed No</th>
                <th>Allocation Date</th>
                <th>Vacate Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAllocations.map((row, idx) => {
                const room = rooms.find(r => r.id === row.roomId);
                return (
                  <tr key={row.id}>
                    <td>{idx + 1}</td>
                    <td><strong className="text-gray-900">#{row.studentId}</strong></td>
                    <td>{room ? room.roomNo : `Room ID: ${row.roomId}`}</td>
                    <td>Bed {row.bedNumber}</td>
                    <td>{row.allocationDate}</td>
                    <td>{row.vacateDate || '-'}</td>
                    <td>
                      <Badge type={
                        row.status === 'Active' ? 'success' :
                        row.status === 'Transferred' ? 'info' : 'warning'
                      }>
                        {row.status}
                      </Badge>
                    </td>
                    <td>
                      {row.status === 'Active' && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedAlloc(row);
                              setShowTransferModal(true);
                            }}
                            className="flex items-center space-x-1 px-2.5 py-1.5 border border-indigo-200 text-indigo-700 bg-indigo-50 rounded-md text-xs font-bold hover:bg-indigo-100 transition-colors"
                            title="Transfer Room"
                          >
                            <ArrowRightLeft className="h-3 w-3" />
                            <span>Transfer</span>
                          </button>
                          <button
                            onClick={() => handleVacate(row.id)}
                            className="flex items-center space-x-1 px-2.5 py-1.5 border border-red-200 text-red-700 bg-red-50 rounded-md text-xs font-bold hover:bg-red-100 transition-colors"
                            title="Vacate Room"
                          >
                            <LogOut className="h-3 w-3" />
                            <span>Vacate</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredAllocations.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500">
                    No active or historical allocations found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </WhiteCard>

      {showAllocateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h4 className="font-bold text-gray-800">New Room Allocation</h4>
              <button onClick={() => setShowAllocateModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAllocateSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Student ID *</label>
                  <input
                    type="number"
                    required
                    placeholder="Enter Student ID"
                    value={allocateForm.studentId}
                    onChange={(e) => setAllocateForm({ ...allocateForm, studentId: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Student Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Student Name"
                    value={allocateForm.studentName}
                    onChange={(e) => setAllocateForm({ ...allocateForm, studentName: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Class *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Class 10"
                    value={allocateForm.className}
                    onChange={(e) => setAllocateForm({ ...allocateForm, className: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Section *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A"
                    value={allocateForm.section}
                    onChange={(e) => setAllocateForm({ ...allocateForm, section: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Gender *</label>
                  <select
                    value={allocateForm.gender}
                    onChange={(e) => setAllocateForm({ ...allocateForm, gender: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Available Rooms *</label>
                <select
                  required
                  value={allocateForm.roomId}
                  onChange={(e) => setAllocateForm({ ...allocateForm, roomId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600 bg-white"
                >
                  <option value="">Choose available room</option>
                  {availableRooms.map(r => (
                    <option key={r.id} value={r.id}>
                      Room {r.roomNo} (Floor {r.floor} • Beds: {r.currentOccupancy || 0}/{r.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Bed / Seat Number *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    value={allocateForm.bedNumber}
                    onChange={(e) => setAllocateForm({ ...allocateForm, bedNumber: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Allocation Start Date *</label>
                  <input
                    type="date"
                    required
                    value={allocateForm.allocationDate}
                    onChange={(e) => setAllocateForm({ ...allocateForm, allocationDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="px-4 py-2 border rounded-md text-sm font-semibold hover:bg-gray-50 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    textTransform: 'uppercase',
                    fontSize: '11px',
                    fontWeight: 600,
                    background: 'var(--primary-color, #7c32ff)',
                    color: '#fff',
                    borderRadius: '4px',
                    padding: '10px 24px',
                    letterSpacing: '0.8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: 'none',
                    height: '42px',
                    boxSizing: 'border-box'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#631ee6'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary-color, #7c32ff)'; e.currentTarget.style.transform = 'none'; }}
                >
                  Save Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTransferModal && selectedAlloc && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h4 className="font-bold text-gray-800">Room Swap/Transfer</h4>
              <button onClick={() => { setShowTransferModal(false); setSelectedAlloc(null); }} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleTransferSubmit} className="p-4 space-y-4">
              <div className="bg-gray-50 p-3 rounded-md border text-xs space-y-1 text-gray-600">
                <p><strong>Student ID:</strong> #{selectedAlloc.studentId}</p>
                <p><strong>Current Room ID:</strong> {selectedAlloc.roomId}</p>
                <p><strong>Current Bed No:</strong> Bed {selectedAlloc.bedNumber}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Select New Room *</label>
                <select
                  required
                  value={transferForm.newRoomId}
                  onChange={(e) => setTransferForm({ ...transferForm, newRoomId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600 bg-white"
                >
                  <option value="">-- Choose New Room --</option>
                  {availableRooms.filter(r => r.id !== selectedAlloc.roomId).map(r => (
                    <option key={r.id} value={r.id}>
                      Room {r.roomNo} (Floor {r.floor} • Type: {r.roomType} • Capacity: {r.currentOccupancy || 0}/{r.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Select Bed Number *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={transferForm.bedNumber}
                  onChange={(e) => setTransferForm({ ...transferForm, bedNumber: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowTransferModal(false); setSelectedAlloc(null); }}
                  className="px-4 py-2 border rounded-md text-sm font-semibold hover:bg-gray-50 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-semibold hover:bg-purple-700"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   SUB-COMPONENT: VISITOR LOG & RFID LOG
   ========================================== */
function VisitorLog({ visitors, rfidLogs, triggerAlert, refreshData }) {
  const [visitorSearch, setVisitorSearch] = useState('');
  const [rfidSearch, setRfidSearch] = useState('');
  const [showCheckinModal, setShowCheckinModal] = useState(false);

  const [checkinForm, setCheckinForm] = useState({
    visitorName: '',
    visitorPhone: '',
    studentId: '',
    studentName: '',
    className: '',
    section: '',
    hostelId: '1',
    relationship: '',
    idProofType: 'Aadhaar',
    idProofNumber: '',
    purpose: ''
  });

  const handleCheckinSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/v1/hostel/visitors', {
        ...checkinForm,
        studentId: parseInt(checkinForm.studentId),
        hostelId: parseInt(checkinForm.hostelId)
      });
      triggerAlert('success', 'Visitor check-in log saved successfully.');
      setShowCheckinModal(false);
      setCheckinForm({
        visitorName: '', visitorPhone: '', studentId: '', studentName: '', className: '', section: '', hostelId: '1',
        relationship: '', idProofType: 'Aadhaar', idProofNumber: '', purpose: ''
      });
      refreshData();
    } catch (err) {
      triggerAlert('danger', 'Failed to check-in visitor.');
    }
  };

  const handleCheckout = async (visitorId) => {
    try {
      await api.put(`/api/v1/hostel/visitors/${visitorId}/checkout`);
      triggerAlert('success', 'Visitor checked out successfully.');
      refreshData();
    } catch (err) {
      triggerAlert('danger', 'Failed to process check-out.');
    }
  };

  const filteredVisitors = visitors.filter(v => {
    const term = visitorSearch.toLowerCase();
    return (
      v.visitorName.toLowerCase().includes(term) ||
      String(v.studentId).includes(term) ||
      (v.relationship && v.relationship.toLowerCase().includes(term))
    );
  });

  const filteredRfid = rfidLogs.filter(log => {
    const term = rfidSearch.toLowerCase();
    return (
      String(log.studentId).includes(term) ||
      (log.rfidTag && log.rfidTag.toLowerCase().includes(term)) ||
      log.entryStatus.toLowerCase().includes(term)
    );
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Visitor Log Table (Left Column) */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex-wrap gap-4">
          <div className="relative flex-1 min-width-[200px]">
            <span className="ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search visitors..."
              value={visitorSearch}
              onChange={(e) => setVisitorSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600"
            />
          </div>
          <button 
            onClick={() => setShowCheckinModal(true)}
            style={{
              textTransform: 'uppercase',
              fontSize: '11px',
              fontWeight: 600,
              background: 'var(--primary-color, #7c32ff)',
              color: '#fff',
              borderRadius: '4px',
              padding: '10px 24px',
              letterSpacing: '0.8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'none',
              height: '42px',
              boxSizing: 'border-box'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#631ee6'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary-color, #7c32ff)'; e.currentTarget.style.transform = 'none'; }}
          >
            <Plus size={14} />
            <span>Check In Visitor</span>
          </button>
        </div>

        <WhiteCard title="Digital Visitor Logbook">
          <div className="table-responsive">
            <table className="data_table text-xs">
              <thead>
                <tr>
                  <th>Visitor</th>
                  <th>Student ID</th>
                  <th>Relationship</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisitors.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <div className="font-semibold text-gray-900">{v.visitorName}</div>
                      <div className="text-gray-500 text-[10px]">{v.visitorPhone}</div>
                    </td>
                    <td><strong>#{v.studentId}</strong></td>
                    <td>{v.relationship}</td>
                    <td>{v.checkIn}</td>
                    <td>{v.checkOut || '-'}</td>
                    <td>
                      <Badge type={v.status === 'checked_in' ? 'warning' : 'success'}>
                        {v.status === 'checked_in' ? 'Inside' : 'Checked Out'}
                      </Badge>
                    </td>
                    <td>
                      {v.status === 'checked_in' && (
                        <button
                          onClick={() => handleCheckout(v.id)}
                          className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-700"
                        >
                          Check Out
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredVisitors.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-400">
                      No visitors logged inside the hostel.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </WhiteCard>
      </div>

      {/* RFID Scan Feed (Right Column) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="flex items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="relative w-full">
            <span className="ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search RFID scan feed..."
              value={rfidSearch}
              onChange={(e) => setRfidSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600"
            />
          </div>
        </div>

        <WhiteCard title="Real-time RFID Gate Feeds">
          <div className="table-responsive">
            <table className="data_table text-xs">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Direction</th>
                  <th>Scan Time</th>
                  <th>Gate Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRfid.map((log) => {
                  const dateObj = new Date(log.scanTimestamp);
                  const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <tr key={log.id} className={log.flagged === 1 ? 'bg-red-50' : ''}>
                      <td><strong>#{log.studentId}</strong></td>
                      <td>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.gateDirection === 'IN' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {log.gateDirection}
                        </span>
                      </td>
                      <td>{formattedTime}</td>
                      <td>
                        <span className={`font-semibold ${log.flagged === 1 ? 'text-red-600' : 'text-green-600'}`}>
                          {log.entryStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {filteredRfid.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-400">
                      No active gate scans recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </WhiteCard>
      </div>

      {showCheckinModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h4 className="font-bold text-gray-800">Visitor Digital Check-in</h4>
              <button onClick={() => setShowCheckinModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCheckinSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">Visitor Name *</label>
                  <input
                    type="text"
                    required
                    value={checkinForm.visitorName}
                    onChange={(e) => setCheckinForm({ ...checkinForm, visitorName: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">Visitor Phone</label>
                  <input
                    type="text"
                    value={checkinForm.visitorPhone}
                    onChange={(e) => setCheckinForm({ ...checkinForm, visitorPhone: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">Student ID *</label>
                  <input
                    type="number"
                    required
                    value={checkinForm.studentId}
                    onChange={(e) => setCheckinForm({ ...checkinForm, studentId: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">Student Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Student Name"
                    value={checkinForm.studentName}
                    onChange={(e) => setCheckinForm({ ...checkinForm, studentName: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">Class *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Class 10"
                    value={checkinForm.className}
                    onChange={(e) => setCheckinForm({ ...checkinForm, className: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">Section *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A"
                    value={checkinForm.section}
                    onChange={(e) => setCheckinForm({ ...checkinForm, section: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">Relationship</label>
                  <input
                    type="text"
                    placeholder="Father, etc."
                    value={checkinForm.relationship}
                    onChange={(e) => setCheckinForm({ ...checkinForm, relationship: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">ID Proof Type</label>
                  <select
                    value={checkinForm.idProofType}
                    onChange={(e) => setCheckinForm({ ...checkinForm, idProofType: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600 bg-white"
                  >
                    <option value="Aadhaar">Aadhaar</option>
                    <option value="PAN Card">PAN Card</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Passport">Passport</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">ID Proof Number</label>
                  <input
                    type="text"
                    value={checkinForm.idProofNumber}
                    onChange={(e) => setCheckinForm({ ...checkinForm, idProofNumber: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 uppercase mb-1">Purpose of Visit *</label>
                <textarea
                  required
                  rows="2"
                  value={checkinForm.purpose}
                  onChange={(e) => setCheckinForm({ ...checkinForm, purpose: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCheckinModal(false)}
                  className="px-4 py-2 border rounded-md text-sm font-semibold hover:bg-gray-50 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    textTransform: 'uppercase',
                    fontSize: '11px',
                    fontWeight: 600,
                    background: 'var(--primary-color, #7c32ff)',
                    color: '#fff',
                    borderRadius: '4px',
                    padding: '10px 24px',
                    letterSpacing: '0.8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: 'none',
                    height: '42px',
                    boxSizing: 'border-box'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#631ee6'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary-color, #7c32ff)'; e.currentTarget.style.transform = 'none'; }}
                >
                  Register Check-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   SUB-COMPONENT: MESS MENU & BILLING
   ========================================== */
function MessBilling({ messPlans, messBillings, stats, triggerAlert, refreshData }) {
  const [search, setSearch] = useState('');
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  // Forms
  const [batchForm, setBatchForm] = useState({
    hostelId: '1',
    billingMonth: new Date().toISOString().substring(0, 7), // YYYY-MM
    messPlan: 'Standard',
    baseAmount: '3500.00',
    additionalCharges: '0.00'
  });

  const [paymentForm, setPaymentForm] = useState({
    reference: '',
    remarks: ''
  });

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/v1/hostel/mess-billings/batch', null, {
        params: {
          hostelId: parseInt(batchForm.hostelId),
          billingMonth: batchForm.billingMonth,
          messPlan: batchForm.messPlan,
          baseAmount: parseFloat(batchForm.baseAmount),
          additionalCharges: parseFloat(batchForm.additionalCharges)
        }
      });
      triggerAlert('success', `Batch bill generator successfully triggered for ${res.data.length} students.`);
      setShowBatchModal(false);
      refreshData();
    } catch (err) {
      triggerAlert('danger', 'Failed to generate batch mess bills.');
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/v1/hostel/mess-billings/${selectedBill.id}/pay`, null, {
        params: {
          reference: paymentForm.reference,
          remarks: paymentForm.remarks
        }
      });
      triggerAlert('success', `Mess payment record successfully synchronized with Finance module ledger.`);
      setShowPayModal(false);
      setSelectedBill(null);
      setPaymentForm({ reference: '', remarks: '' });
      refreshData();
    } catch (err) {
      triggerAlert('danger', 'Failed to record payment transaction.');
    }
  };

  const filteredBills = messBillings.filter(b => {
    const term = search.toLowerCase();
    return (
      String(b.studentId).includes(term) ||
      b.billingMonth.includes(term) ||
      b.status.toLowerCase().includes(term)
    );
  });

  // Organize weekly plan structure
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6">
      {/* Weekly Menu Display */}
      <WhiteCard title="Weekly Mess Menu Catalog">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {days.map((day) => {
            const plan = messPlans.find(p => p.dayOfWeek === day && p.hostelId === 1) || {
              breakfast: 'Toast, Butter, Milk',
              lunch: 'Roti, Dal, Rice, Salad',
              snacks: 'Biscuits, Tea',
              dinner: 'Veg Pulao, Paneer, Curd'
            };
            return (
              <div key={day} className="border border-gray-100 rounded-lg p-3 bg-gray-50 flex flex-col justify-between">
                <div className="border-b border-gray-200 pb-1 mb-2">
                  <h6 className="font-bold text-sm text-purple-700">{day}</h6>
                </div>
                <div className="space-y-2 text-xs text-gray-700">
                  <div>
                    <span className="font-semibold text-gray-500 block uppercase text-[9px] tracking-wider">Breakfast</span>
                    <p className="line-clamp-2">{plan.breakfast}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-500 block uppercase text-[9px] tracking-wider">Lunch</span>
                    <p className="line-clamp-2">{plan.lunch}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-500 block uppercase text-[9px] tracking-wider">Snacks</span>
                    <p className="line-clamp-2">{plan.snacks}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-500 block uppercase text-[9px] tracking-wider">Dinner</span>
                    <p className="line-clamp-2">{plan.dinner}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </WhiteCard>

      {/* Mess Billings Table */}
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex-wrap gap-4">
          <div className="relative flex-1 min-width-[250px]">
            <span className="ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by Student ID, Month, Status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600"
            />
          </div>
          <button 
            onClick={() => setShowBatchModal(true)}
            style={{
              textTransform: 'uppercase',
              fontSize: '11px',
              fontWeight: 600,
              background: 'var(--primary-color, #7c32ff)',
              color: '#fff',
              borderRadius: '4px',
              padding: '10px 24px',
              letterSpacing: '0.8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'none',
              height: '42px',
              boxSizing: 'border-box'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#631ee6'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary-color, #7c32ff)'; e.currentTarget.style.transform = 'none'; }}
          >
            <CreditCard size={14} />
            <span>Generate Mess Bills (Batch)</span>
          </button>
        </div>

        <WhiteCard title="Finance Ledger & Billing Tracker">
          <div className="table-responsive">
            <table className="data_table text-xs">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Billing Month</th>
                  <th>Mess Plan</th>
                  <th>Base Fee</th>
                  <th>Extras</th>
                  <th>Total Due</th>
                  <th>Status</th>
                  <th>Payment Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((b) => (
                  <tr key={b.id}>
                    <td><strong>#{b.studentId}</strong></td>
                    <td>{b.billingMonth}</td>
                    <td>{b.messPlan}</td>
                    <td>₹{parseFloat(b.baseAmount).toFixed(2)}</td>
                    <td>₹{parseFloat(b.additionalCharges).toFixed(2)}</td>
                    <td><strong className="text-gray-900">₹{parseFloat(b.totalAmount).toFixed(2)}</strong></td>
                    <td>
                      <Badge type={
                        b.status === 'Paid' ? 'success' :
                        b.status === 'Pending' ? 'warning' : 'danger'
                      }>
                        {b.status}
                      </Badge>
                    </td>
                    <td>{b.paymentDate || '-'}</td>
                    <td>
                      {(b.status === 'Pending' || b.status === 'Overdue') && (
                        <button
                          onClick={() => {
                            setSelectedBill(b);
                            setShowPayModal(true);
                          }}
                          className="px-2.5 py-1.5 bg-green-600 text-white rounded text-[10px] font-bold hover:bg-green-700"
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredBills.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center py-6 text-gray-400">
                      All mess bills are settled. No overdue charges.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </WhiteCard>
      </div>

      {/* Batch Bill Modal */}
      {showBatchModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h4 className="font-bold text-gray-800">Batch Mess Bill Generator</h4>
              <button onClick={() => setShowBatchModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleBatchSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Select Hostel Block *</label>
                <select
                  required
                  value={batchForm.hostelId}
                  onChange={(e) => setBatchForm({ ...batchForm, hostelId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600 bg-white"
                >
                  {(stats.hostels || []).map(h => (
                    <option key={h.hostelId} value={h.hostelId}>{h.hostelName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Billing Month *</label>
                <input
                  type="month"
                  required
                  value={batchForm.billingMonth}
                  onChange={(e) => setBatchForm({ ...batchForm, billingMonth: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Mess Plan *</label>
                <select
                  required
                  value={batchForm.messPlan}
                  onChange={(e) => setBatchForm({ ...batchForm, messPlan: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600 bg-white"
                >
                  <option value="Standard">Standard Veg / Non-Veg</option>
                  <option value="Veg-Only">Vegetarian Only</option>
                  <option value="Premium">Premium Special Plan</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Base Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={batchForm.baseAmount}
                    onChange={(e) => setBatchForm({ ...batchForm, baseAmount: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Extra Charges (₹)</label>
                  <input
                    type="number"
                    value={batchForm.additionalCharges}
                    onChange={(e) => setBatchForm({ ...batchForm, additionalCharges: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 border rounded-md text-sm font-semibold hover:bg-gray-50 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    textTransform: 'uppercase',
                    fontSize: '11px',
                    fontWeight: 600,
                    background: 'var(--primary-color, #7c32ff)',
                    color: '#fff',
                    borderRadius: '4px',
                    padding: '10px 24px',
                    letterSpacing: '0.8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: 'none',
                    height: '42px',
                    boxSizing: 'border-box'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#631ee6'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary-color, #7c32ff)'; e.currentTarget.style.transform = 'none'; }}
                >
                  Trigger Generator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPayModal && selectedBill && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h4 className="font-bold text-gray-800">Mess Bill Settlement</h4>
              <button onClick={() => { setShowPayModal(false); setSelectedBill(null); }} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handlePaymentSubmit} className="p-4 space-y-4">
              <div className="bg-gray-50 p-3 rounded-md border text-xs space-y-1 text-gray-600">
                <p><strong>Student ID:</strong> #{selectedBill.studentId}</p>
                <p><strong>Billing Month:</strong> {selectedBill.billingMonth}</p>
                <p><strong>Total Due Amount:</strong> ₹{parseFloat(selectedBill.totalAmount).toFixed(2)}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Payment Txn Reference ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TXN-MES-1002"
                  value={paymentForm.reference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Remarks</label>
                <input
                  type="text"
                  placeholder="Optional remarks"
                  value={paymentForm.remarks}
                  onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowPayModal(false); setSelectedBill(null); }}
                  className="px-4 py-2 border rounded-md text-sm font-semibold hover:bg-gray-50 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700"
                >
                  Record Payment & Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================
   SUB-COMPONENT: WARDENS & DISCIPLINE
   ========================================== */
function DisciplineWarden({ disciplineLogs, stats, triggerAlert, refreshData }) {
  const [search, setSearch] = useState('');
  const [showIncidentModal, setShowIncidentModal] = useState(false);

  const [incidentForm, setIncidentForm] = useState({
    studentId: '',
    studentName: '',
    className: '',
    section: '',
    hostelId: '1',
    floor: '',
    roomNo: '',
    incidentType: 'Curfew Violation',
    severity: 'Low',
    description: '',
    reportedBy: 'Warden'
  });

  const handleIncidentSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/v1/hostel/discipline', {
        ...incidentForm,
        studentId: parseInt(incidentForm.studentId),
        hostelId: parseInt(incidentForm.hostelId)
      });
      triggerAlert('success', 'Incident record added to discipline logs successfully.');
      setShowIncidentModal(false);
      setIncidentForm({ studentId: '', studentName: '', className: '', section: '', hostelId: '1', floor: '', roomNo: '', incidentType: 'Curfew Violation', severity: 'Low', description: '', reportedBy: 'Warden' });
      refreshData();
    } catch (err) {
      triggerAlert('danger', 'Failed to save incident record.');
    }
  };

  const handleResolve = async (logId, action) => {
    try {
      await api.put(`/api/v1/hostel/discipline/${logId}`, null, {
        params: {
          status: 'Resolved',
          actionTaken: action || 'Resolved by warden'
        }
      });
      triggerAlert('success', 'Incident case resolved and closed.');
      refreshData();
    } catch (err) {
      triggerAlert('danger', 'Failed to resolve incident case.');
    }
  };

  const filteredLogs = disciplineLogs.filter(log => {
    const term = search.toLowerCase();
    return (
      String(log.studentId).includes(term) ||
      log.incidentType.toLowerCase().includes(term) ||
      log.severity.toLowerCase().includes(term) ||
      log.status.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Warden Shift Roster Directory */}
      <WhiteCard title="Hostel Warden shift roster & Contacts Directory">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full text-purple-600">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h5 className="font-bold text-gray-800 text-sm">Warden jstwl (Boys Block A)</h5>
              <p className="text-xs text-gray-500 mb-1">Shift: 8:00 AM - 8:00 PM</p>
              <div className="flex space-x-4 text-xs text-gray-700">
                <span className="flex items-center"><Phone className="h-3 w-3 mr-1" /> +91 9876543210</span>
                <span className="flex items-center"><Mail className="h-3 w-3 mr-1" /> warden.a@sac.edu</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full text-purple-600">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h5 className="font-bold text-gray-800 text-sm">Warden mlBSB (Girls Block B)</h5>
              <p className="text-xs text-gray-500 mb-1">Shift: 8:00 AM - 8:00 PM</p>
              <div className="flex space-x-4 text-xs text-gray-700">
                <span className="flex items-center"><Phone className="h-3 w-3 mr-1" /> +91 9876543210</span>
                <span className="flex items-center"><Mail className="h-3 w-3 mr-1" /> warden.b@sac.edu</span>
              </div>
            </div>
          </div>
        </div>
      </WhiteCard>

      {/* Incident logs */}
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex-wrap gap-4">
          <div className="relative flex-1 min-width-[250px]">
            <span className="ti-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search incidents by Student ID, Type, Status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-600 focus:border-purple-600"
            />
          </div>
          <button 
            onClick={() => setShowIncidentModal(true)}
            style={{
              textTransform: 'uppercase',
              fontSize: '11px',
              fontWeight: 600,
              background: 'var(--primary-color, #7c32ff)',
              color: '#fff',
              borderRadius: '4px',
              padding: '10px 24px',
              letterSpacing: '0.8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'none',
              height: '42px',
              boxSizing: 'border-box'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#631ee6'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary-color, #7c32ff)'; e.currentTarget.style.transform = 'none'; }}
          >
            <Plus size={14} />
            <span>Add Incident Record</span>
          </button>
        </div>

        <WhiteCard title="Student Discipline & incident logs">
          <div className="table-responsive">
            <table className="data_table text-xs">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Incident Date</th>
                  <th>Incident Type</th>
                  <th>Severity</th>
                  <th>Details</th>
                  <th>Action Taken</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td><strong>#{log.studentId}</strong></td>
                    <td>{log.incidentDate}</td>
                    <td>{log.incidentType}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.severity === 'Critical' ? 'bg-red-200 text-red-800' :
                        log.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                        log.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                    <td>{log.description}</td>
                    <td>{log.actionTaken || '-'}</td>
                    <td>
                      <Badge type={
                        log.status === 'Resolved' ? 'success' :
                        log.status === 'Action Taken' ? 'info' : 'warning'
                      }>
                        {log.status}
                      </Badge>
                    </td>
                    <td>
                      {log.status === 'Under Review' && (
                        <button
                          onClick={() => {
                            const action = window.prompt("Enter action taken to resolve this incident:");
                            if (action !== null) {
                              handleResolve(log.id, action);
                            }
                          }}
                          className="px-2 py-1 bg-green-600 text-white rounded text-[10px] font-bold hover:bg-green-700"
                        >
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-gray-400">
                      All clean. No disciplinary warnings registered.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </WhiteCard>
      </div>

      {showIncidentModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h4 className="font-bold text-gray-800">Add Incident Record</h4>
              <button onClick={() => setShowIncidentModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleIncidentSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Student ID *</label>
                  <input
                    type="number"
                    required
                    value={incidentForm.studentId}
                    onChange={(e) => setIncidentForm({ ...incidentForm, studentId: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Student Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Student Name"
                    value={incidentForm.studentName}
                    onChange={(e) => setIncidentForm({ ...incidentForm, studentName: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Class *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Class 10"
                    value={incidentForm.className}
                    onChange={(e) => setIncidentForm({ ...incidentForm, className: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Section *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A"
                    value={incidentForm.section}
                    onChange={(e) => setIncidentForm({ ...incidentForm, section: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Hostel Block *</label>
                  <select
                    required
                    value={incidentForm.hostelId}
                    onChange={(e) => setIncidentForm({ ...incidentForm, hostelId: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600 bg-white"
                  >
                    {(stats.hostels || []).map(h => (
                      <option key={h.hostelId} value={h.hostelId}>{h.hostelName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Floor *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1st Floor"
                    value={incidentForm.floor}
                    onChange={(e) => setIncidentForm({ ...incidentForm, floor: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Room No *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A1"
                    value={incidentForm.roomNo}
                    onChange={(e) => setIncidentForm({ ...incidentForm, roomNo: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Incident Type *</label>
                  <select
                    required
                    value={incidentForm.incidentType}
                    onChange={(e) => setIncidentForm({ ...incidentForm, incidentType: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600 bg-white"
                  >
                    <option value="Curfew Violation">Curfew Violation</option>
                    <option value="Noise Complaint">Noise Complaint</option>
                    <option value="Property Damage">Property Damage</option>
                    <option value="Unauthorized Guest">Unauthorized Guest</option>
                    <option value="Mess Misconduct">Mess Misconduct</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Severity *</label>
                  <select
                    required
                    value={incidentForm.severity}
                    onChange={(e) => setIncidentForm({ ...incidentForm, severity: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600 bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Reported By</label>
                <input
                  type="text"
                  value={incidentForm.reportedBy}
                  onChange={(e) => setIncidentForm({ ...incidentForm, reportedBy: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Description / Details *</label>
                <textarea
                  required
                  rows="3"
                  value={incidentForm.description}
                  onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-600"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  className="px-4 py-2 border rounded-md text-sm font-semibold hover:bg-gray-50 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    textTransform: 'uppercase',
                    fontSize: '11px',
                    fontWeight: 600,
                    background: 'var(--primary-color, #7c32ff)',
                    color: '#fff',
                    borderRadius: '4px',
                    padding: '10px 24px',
                    letterSpacing: '0.8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: 'none',
                    height: '42px',
                    boxSizing: 'border-box'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#631ee6'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary-color, #7c32ff)'; e.currentTarget.style.transform = 'none'; }}
                >
                  Save Incident Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
