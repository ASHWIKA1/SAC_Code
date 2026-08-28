import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, WhiteCard, StatCard, DataTable, Badge, ActionBtn } from '../../components/UI';
import api from '../../utils/api';

const MOCK_STATS = {
  totalStudents: 1245, totalTeachers: 87, totalParents: 980,
  totalClasses: 24, feesCollected: '₹4,82,500', pendingFees: '₹1,20,300',
  totalIncome: '₹6,50,000', totalExpense: '₹3,10,000',
  attendanceToday: '94.2%', examScheduled: 8,
};

const RECENT_STUDENTS = [
  { id: 201, name: 'Rahul Kumar',  class: 'Class 10-A', roll: '10A01', date: '2026-06-20', status: 'Active' },
  { id: 202, name: 'Sneha Rao',    class: 'Class 9-B',  roll: '09B04', date: '2026-06-19', status: 'Active' },
  { id: 203, name: 'Arjun Singh',  class: 'Class 11-A', roll: '11A12', date: '2026-06-18', status: 'Active' },
  { id: 204, name: 'Priya Mehta',  class: 'Class 8-C',  roll: '08C07', date: '2026-06-17', status: 'Inactive' },
  { id: 205, name: 'Kavya Nair',   class: 'Class 12-A', roll: '12A03', date: '2026-06-15', status: 'Active' },
];

const RECENT_FEES = [
  { id: 1, student: 'Rahul Kumar',  class: 'Class 10-A', amount: '₹5,000', date: '2026-06-20', status: 'Paid' },
  { id: 2, student: 'Sneha Rao',    class: 'Class 9-B',  amount: '₹4,500', date: '2026-06-19', status: 'Paid' },
  { id: 3, student: 'Arjun Singh',  class: 'Class 11-A', amount: '₹6,000', date: '2026-06-18', status: 'Pending' },
  { id: 4, student: 'Priya Mehta',  class: 'Class 8-C',  amount: '₹4,000', date: '2026-06-17', status: 'Paid' },
];

const NOTICES = [
  { id: 1, title: 'Annual Sports Day – July 10th', date: '2026-06-20' },
  { id: 2, title: 'Mid-Term Exam Schedule Released', date: '2026-06-18' },
  { id: 3, title: 'School will be closed on June 25 (Holiday)', date: '2026-06-15' },
  { id: 4, title: 'Fee submission last date: June 30', date: '2026-06-12' },
];

const EVENTS = [
  { id: 1, title: 'Annual Sports Day', date: 'Jul 10', color: '#7C32FF' },
  { id: 2, title: 'Parent Teacher Meeting', date: 'Jun 28', color: '#23c277' },
  { id: 3, title: 'Mid-Term Exams', date: 'Jul 5–10', color: '#ef5f5f' },
  { id: 4, title: 'Science Exhibition', date: 'Jul 15', color: '#ffba00' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(MOCK_STATS);

  useEffect(() => {
    api.get('/api/dashboard/stats')
      .then(r => {
        if (r.data && typeof r.data === 'object' && r.data.totalStudents !== undefined) {
          setStats(r.data);
        }
      })
      .catch(() => {});
  }, []);

  const studentCols = [
    { label: '#', render: (_, i) => i + 1 },
    { label: 'Student Name', render: r => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="student-avatar">{r.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13 }}>{r.name}</div>
          <div style={{ fontSize: 11, color: '#aaa' }}>Roll: {r.roll}</div>
        </div>
      </div>
    )},
    { label: 'Class', key: 'class' },
    { label: 'Admitted', key: 'date' },
    { label: 'Status', render: r => <Badge type={r.status === 'Active' ? 'success' : 'danger'}>{r.status}</Badge> },
    { label: 'Action', render: r => (
      <>
        <ActionBtn type="view" icon="ti-eye" title="View" onClick={() => navigate('/students')} />
        <ActionBtn type="edit" icon="ti-pencil" title="Edit" />
      </>
    )},
  ];

  const feesCols = [
    { label: '#', render: (_, i) => i + 1 },
    { label: 'Student', key: 'student' },
    { label: 'Class', key: 'class' },
    { label: 'Amount', key: 'amount' },
    { label: 'Date', key: 'date' },
    { label: 'Status', render: r => <Badge type={r.status === 'Paid' ? 'success' : 'warning'}>{r.status}</Badge> },
  ];

  return (
    <>
      <PageHeader title="Dashboard" breadcrumbs={[{ label: 'Dashboard' }]} />

      {/* Stats Row 1 */}
      <div className="dashboard_stats_row">
        <StatCard value={stats?.totalStudents?.toLocaleString() || '0'} label="Total Students" icon="ti-user" colorClass="purple" />
        <StatCard value={stats?.totalTeachers || '0'} label="Total Teachers" icon="ti-blackboard" colorClass="blue" />
        <StatCard value={stats?.totalParents || '0'} label="Total Parents" icon="ti-id-badge" colorClass="green" />
        <StatCard value={stats?.totalClasses || '0'} label="Total Classes" icon="ti-book" colorClass="orange" />
      </div>

      {/* Stats Row 2 */}
      <div className="dashboard_stats_row">
        <StatCard value={stats?.feesCollected || '0'} label="Fees Collected (This Month)" icon="ti-money" colorClass="green" />
        <StatCard value={stats?.pendingFees || '0'} label="Pending Fees" icon="ti-alert" colorClass="red" />
        <StatCard value={stats?.totalIncome || '0'} label="Total Income" icon="ti-bar-chart" colorClass="blue" />
        <StatCard value={stats?.attendanceToday || '0%'} label="Today's Attendance" icon="ti-check-box" colorClass="purple" />
      </div>

      {/* Two-column: Recent Students + Notices */}
      <div className="dashboard_chart_row">
        <WhiteCard
          title="Recently Admitted Students"
          actions={<button className="primary_btn btn_sm" onClick={() => navigate('/students/create')}>+ Admit Student</button>}
        >
          <DataTable columns={studentCols} data={RECENT_STUDENTS} />
        </WhiteCard>

        <div>
          {/* Notices */}
          <WhiteCard
            title="Notice Board"
            actions={<button className="primary_btn btn_sm" onClick={() => navigate('/communicate/notice-board')}>View All</button>}
          >
            {NOTICES.map(n => (
              <div key={n.id} className="notice_card">
                <h6>{n.title}</h6>
                <p>{n.date}</p>
              </div>
            ))}
          </WhiteCard>

          {/* Upcoming Events */}
          <WhiteCard title="Upcoming Events">
            {EVENTS.map(ev => (
              <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 8,
                  background: `${ev.color}18`, color: ev.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, textAlign: 'center', lineHeight: 1.2,
                  flexShrink: 0
                }}>{ev.date}</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{ev.title}</div>
              </div>
            ))}
          </WhiteCard>
        </div>
      </div>

      {/* Recent Fees */}
      <WhiteCard
        title="Recent Fee Payments"
        actions={<button className="primary_btn btn_sm" onClick={() => navigate('/fees/payments')}>View All</button>}
      >
        <DataTable columns={feesCols} data={RECENT_FEES} />
      </WhiteCard>
    </>
  );
}
