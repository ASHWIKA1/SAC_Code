import React from 'react';
import { PageHeader, WhiteCard, StatCard, DataTable, Badge } from '../../components/UI';

export default function UltraDashboard() {
  const superAdmins = [
    { id: 1, name: 'Rajesh Kumar', email: 'super@school1.com', schools: 3, status: 'Active' },
    { id: 2, name: 'Meena Sharma', email: 'super@school2.com', schools: 2, status: 'Active' },
  ];
  const cols = [
    { label: '#', render: (r, i) => i + 1 },
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Schools', key: 'schools' },
    { label: 'Status', render: r => <Badge type="success">{r.status}</Badge> },
  ];
  return (
    <>
      <PageHeader title="Ultra Super Admin Dashboard" breadcrumbs={[{ label: 'Ultra Admin' }]} />
      <div className="dashboard_stats_row">
        <StatCard value="2"      label="Super Admins"    icon="ti-crown"   colorClass="purple" />
        <StatCard value="5"      label="Total Schools"   icon="ti-layers"  colorClass="blue" />
        <StatCard value="3,910"  label="Total Students"  icon="ti-user"    colorClass="green" />
        <StatCard value="Active" label="System Status"   icon="ti-pulse"   colorClass="green" />
      </div>
      <WhiteCard title="All Super Admins">
        <DataTable columns={cols} data={superAdmins} />
      </WhiteCard>
    </>
  );
}
