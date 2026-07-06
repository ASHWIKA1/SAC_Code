import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, WhiteCard, StatCard, DataTable, Badge } from '../../components/UI';

const SCHOOLS = [
  { id: 1, name: 'Springfield High School', admin: 'admin@springfield.com', students: 1245, status: 'Active', package: 'Premium', expires: '2027-01-01' },
  { id: 2, name: 'Greenwood Academy', admin: 'admin@greenwood.com', students: 890, status: 'Active', package: 'Standard', expires: '2026-12-01' },
  { id: 3, name: 'Blue Ridge School', admin: 'admin@blueridge.com', students: 530, status: 'Inactive', package: 'Basic', expires: '2026-09-01' },
];

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  const cols = [
    { label: '#', render: (r, i) => i + 1 },
    { label: 'School Name', render: r => <strong>{r.name}</strong> },
    { label: 'Admin Email', key: 'admin' },
    { label: 'Students', key: 'students' },
    { label: 'Package', render: r => <Badge type="primary">{r.package}</Badge> },
    { label: 'Expires', key: 'expires' },
    { label: 'Status', render: r => <Badge type={r.status === 'Active' ? 'success' : 'danger'}>{r.status}</Badge> },
    { label: 'Action', render: r => (
      <button className="primary_btn btn_sm" onClick={() => navigate('/superadmin/schools')}>Manage</button>
    )},
  ];

  return (
    <>
      <PageHeader title="Super Admin Dashboard" breadcrumbs={[{ label: 'Super Admin' }]}
        actions={<button className="primary_btn" onClick={() => navigate('/superadmin/schools/create')}>+ Add School</button>}
      />
      <div className="dashboard_stats_row">
        <StatCard value="3"     label="Total Schools"         icon="ti-layers"     colorClass="purple" />
        <StatCard value="2,665" label="Total Students"        icon="ti-user"       colorClass="blue" />
        <StatCard value="12"    label="Active Subscriptions"  icon="ti-credit-card" colorClass="green" />
        <StatCard value="₹2.1L" label="Total Revenue"         icon="ti-bar-chart"  colorClass="orange" />
      </div>
      <WhiteCard title="Registered Schools" actions={<button className="primary_btn btn_sm" onClick={() => navigate('/superadmin/schools')}>View All</button>}>
        <DataTable columns={cols} data={SCHOOLS} />
      </WhiteCard>
    </>
  );
}
