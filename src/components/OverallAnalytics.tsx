import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, LineChart, Line, ScatterChart, Scatter,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { Download, Filter, FileText, FileSpreadsheet, Activity, Users, Building2, UserCheck, UserX, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { toast } from 'sonner';

type ChartType = 'bar' | 'pie' | 'line' | 'scatter' | 'area' | 'doughnut' | 'radar' | 'stacked';
type MemberType = 'Combined' | 'Student' | 'Staff';
type DatePreset = 'today' | 'yesterday' | 'week' | 'month' | 'lastMonth' | 'custom';

const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b'];

export default function OverallAnalytics() {
  const [stats, setStats] = useState<any>(null);
  const [branches, setBranches] = useState<any[]>([]);
  
  // Filters
  const [datePreset, setDatePreset] = useState<DatePreset>('today');
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [memberType, setMemberType] = useState<MemberType>('Combined');
  const [branchFilter, setBranchFilter] = useState('All');
  
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const institutionId = currentUser.institutionId;

  const fetchBranches = async () => {
    if (!institutionId) return;
    const res = await fetch(`/api/branches?institutionId=${institutionId}`);
    const data = await res.json();
    setBranches(data);
  };

  const fetchStats = async () => {
    if (!institutionId) return;
    setIsLoading(true);
    try {
      let url = `/api/analytics/overall?institutionId=${institutionId}`;
      if (dateFrom && dateTo) url += `&dateFrom=${dateFrom}&dateTo=${dateTo}`;
      if (memberType !== 'Combined') url += `&memberType=${memberType}`;
      if (branchFilter !== 'All') {
        // If a specific branch is selected in "Overall", we can either filter the query 
        // or just rely on specific analytics. We'll use the specific API to get that branch's data.
        const res = await fetch(`/api/analytics/specific?institutionId=${institutionId}&branchId=${branchFilter}&dateFrom=${dateFrom}&dateTo=${dateTo}&memberType=${memberType}`);
        const data = await res.json();
        if (data.length > 0) {
          const b = data[0];
          setStats({
            totalBranches: 1,
            students: b.students,
            staff: b.staff
          });
        }
      } else {
        const res = await fetch(url);
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch analytics');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBranches();
  }, [institutionId]);

  useEffect(() => {
    handleDatePreset(datePreset);
  }, [datePreset]);

  useEffect(() => {
    if (datePreset === 'custom' || datePreset !== 'custom') {
      fetchStats();
    }
  }, [dateFrom, dateTo, memberType, branchFilter]);

  const handleDatePreset = (preset: DatePreset) => {
    const today = new Date();
    let from = new Date();
    let to = new Date();
    
    switch (preset) {
      case 'today':
        break;
      case 'yesterday':
        from.setDate(today.getDate() - 1);
        to.setDate(today.getDate() - 1);
        break;
      case 'week':
        from.setDate(today.getDate() - today.getDay());
        break;
      case 'month':
        from.setDate(1);
        break;
      case 'lastMonth':
        from.setMonth(today.getMonth() - 1);
        from.setDate(1);
        to = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'custom':
        return; // Don't auto-update dates for custom
    }
    
    setDateFrom(from.toISOString().split('T')[0]);
    setDateTo(to.toISOString().split('T')[0]);
  };

  const handleExportCSV = () => {
    if (!stats) return;
    let csv = 'Category,Total,Present,Absent,Late,Attendance %\n';
    
    if (memberType === 'Combined' || memberType === 'Student') {
      const s = stats.students;
      const pct = s.total > 0 ? ((s.present / s.total) * 100).toFixed(1) : '0';
      csv += `Students,${s.total},${s.present},${s.absent},${s.late},${pct}%\n`;
    }
    if (memberType === 'Combined' || memberType === 'Staff') {
      const s = stats.staff;
      const pct = s.total > 0 ? ((s.present / s.total) * 100).toFixed(1) : '0';
      csv += `Staff,${s.total},${s.present},${s.absent},${s.late},${pct}%\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `overall_analytics_${dateFrom}_${dateTo}.csv`;
    a.click();
    toast.success('CSV Exported');
  };

  const handleExportExcel = async () => {
    if (!stats) return;
    const { utils, writeFile } = await import('xlsx');
    const exportData = [];
    
    if (memberType === 'Combined' || memberType === 'Student') {
      const s = stats.students;
      exportData.push({
        'Category': 'Students',
        'Total': s.total,
        'Present': s.present,
        'Absent': s.absent,
        'Late': s.late,
        'Attendance %': s.total > 0 ? ((s.present / s.total) * 100).toFixed(1) + '%' : '0%'
      });
    }
    if (memberType === 'Combined' || memberType === 'Staff') {
      const s = stats.staff;
      exportData.push({
        'Category': 'Staff',
        'Total': s.total,
        'Present': s.present,
        'Absent': s.absent,
        'Late': s.late,
        'Attendance %': s.total > 0 ? ((s.present / s.total) * 100).toFixed(1) + '%' : '0%'
      });
    }

    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Analytics");
    writeFile(wb, `overall_analytics_${dateFrom}_${dateTo}.xlsx`);
    toast.success('Excel Exported');
  };

  const handleExportPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Overall Attendance Analytics', 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Date Range: ${dateFrom} to ${dateTo}`, 14, 30);
    doc.text(`Filter: ${memberType} | Branch: ${branchFilter === 'All' ? 'All Branches' : branches.find(b=>b.id===branchFilter)?.name}`, 14, 36);

    const body = [];
    if (memberType === 'Combined' || memberType === 'Student') {
      const s = stats.students;
      body.push(['Students', s.total, s.present, s.absent, s.late, s.total > 0 ? ((s.present / s.total) * 100).toFixed(1) + '%' : '0%']);
    }
    if (memberType === 'Combined' || memberType === 'Staff') {
      const s = stats.staff;
      body.push(['Staff', s.total, s.present, s.absent, s.late, s.total > 0 ? ((s.present / s.total) * 100).toFixed(1) + '%' : '0%']);
    }

    autoTable(doc, {
      startY: 45,
      head: [['Category', 'Total', 'Present', 'Absent', 'Late', 'Attendance %']],
      body: body,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] }
    });

    doc.save(`overall_analytics_${dateFrom}_${dateTo}.pdf`);
    toast.success('PDF Exported');
  };

  if (!currentUser || currentUser.role !== 'Super Admin') {
    return <div className="text-center py-12 text-slate-500">Access Restricted: Super Admin Only</div>;
  }

  const chartData = [];
  if (stats) {
    if (memberType === 'Combined' || memberType === 'Student') {
      chartData.push({ name: 'Students', Present: stats.students.present, Absent: stats.students.absent, Late: stats.students.late });
    }
    if (memberType === 'Combined' || memberType === 'Staff') {
      chartData.push({ name: 'Staff', Present: stats.staff.present, Absent: stats.staff.absent, Late: stats.staff.late });
    }
  }

  const renderChart = () => {
    if (!chartData.length) return null;
    
    const commonProps = { data: chartData, margin: { top: 10, right: 30, left: 0, bottom: 0 } };
    
    switch(chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Absent" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'stacked':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="Present" stackId="a" fill="#10b981" />
              <Bar dataKey="Late" stackId="a" fill="#f59e0b" />
              <Bar dataKey="Absent" stackId="a" fill="#f43f5e" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line type="monotone" dataKey="Present" stroke="#10b981" strokeWidth={3} />
              <Line type="monotone" dataKey="Absent" stroke="#f43f5e" strokeWidth={3} />
              <Line type="monotone" dataKey="Late" stroke="#f59e0b" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Area type="monotone" dataKey="Present" stackId="1" stroke="#10b981" fill="#10b981" />
              <Area type="monotone" dataKey="Late" stackId="1" stroke="#f59e0b" fill="#f59e0b" />
              <Area type="monotone" dataKey="Absent" stackId="1" stroke="#f43f5e" fill="#f43f5e" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip cursor={{strokeDasharray: '3 3'}} />
              <Legend />
              <Scatter name="Present" dataKey="Present" fill="#10b981" />
              <Scatter name="Absent" dataKey="Absent" fill="#f43f5e" />
              <Scatter name="Late" dataKey="Late" fill="#f59e0b" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar name="Present" dataKey="Present" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Radar name="Absent" dataKey="Absent" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.6} />
              <Radar name="Late" dataKey="Late" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
              <Legend />
              <RechartsTooltip />
            </RadarChart>
          </ResponsiveContainer>
        );
      case 'pie':
      case 'doughnut':
        // For pie/doughnut, we need to transform data to {name, value} format
        // We'll show an aggregate of Present vs Absent vs Late across all selected members
        const aggData = [
          { name: 'Present', value: chartData.reduce((acc, curr) => acc + curr.Present, 0), color: '#10b981' },
          { name: 'Absent', value: chartData.reduce((acc, curr) => acc + curr.Absent, 0), color: '#f43f5e' },
          { name: 'Late', value: chartData.reduce((acc, curr) => acc + curr.Late, 0), color: '#f59e0b' }
        ];
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={aggData} 
                cx="50%" cy="50%" 
                innerRadius={chartType === 'doughnut' ? 60 : 0} 
                outerRadius={100} 
                fill="#8884d8" 
                paddingAngle={5} 
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {aggData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  const getPercentage = (present: number, total: number) => {
    if (total === 0) return 0;
    return ((present / total) * 100).toFixed(1);
  };

  const st = stats?.students || { total: 0, present: 0, absent: 0, late: 0 };
  const tf = stats?.staff || { total: 0, present: 0, absent: 0, late: 0 };
  const combTotal = st.total + tf.total;
  const combPresent = st.present + tf.present;
  const combAbsent = st.absent + tf.absent;
  const combLate = st.late + tf.late;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Overall Analytics</h1>
          <p className="text-slate-500 mt-1 text-sm">Combined attendance overview for all your branches.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF} className="h-9"><FileText className="w-4 h-4 mr-2" /> PDF</Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="h-9"><FileSpreadsheet className="w-4 h-4 mr-2" /> Excel</Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9"><Download className="w-4 h-4 mr-2" /> CSV</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-end gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Preset</label>
          <Select value={datePreset} onValueChange={(v) => { setDatePreset(v as DatePreset); }}>
            <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {datePreset === 'custom' && (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">From</label>
              <Input type="date" className="h-9 w-[140px]" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">To</label>
              <Input type="date" className="h-9 w-[140px]" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </div>
          </>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Member Type</label>
          <Select value={memberType} onValueChange={(v) => setMemberType(v as MemberType)}>
            <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Combined">Combined</SelectItem>
              <SelectItem value="Student">Students Only</SelectItem>
              <SelectItem value="Staff">Staff Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Branch</label>
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-full h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Branches</SelectItem>
              {branches.map(b => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-slate-200 rounded-2xl w-full"></div>
          <div className="h-64 bg-slate-200 rounded-2xl w-full"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(memberType === 'Combined' || memberType === 'Student') && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600"><Users className="w-4 h-4" /></div>
                  <h3 className="font-bold text-slate-800">Student Statistics</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-slate-400">Total</p><p className="text-xl font-bold">{st.total}</p></div>
                  <div><p className="text-xs text-slate-400">Present</p><p className="text-xl font-bold text-emerald-600">{st.present}</p></div>
                  <div><p className="text-xs text-slate-400">Absent</p><p className="text-xl font-bold text-rose-600">{st.absent}</p></div>
                  <div><p className="text-xs text-slate-400">Late</p><p className="text-xl font-bold text-amber-500">{st.late}</p></div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">Attendance</span>
                  <span className="text-lg font-bold text-indigo-600">{getPercentage(st.present, st.total)}%</span>
                </div>
              </div>
            )}

            {(memberType === 'Combined' || memberType === 'Staff') && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-fuchsia-50 flex items-center justify-center text-fuchsia-600"><Users className="w-4 h-4" /></div>
                  <h3 className="font-bold text-slate-800">Staff Statistics</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-xs text-slate-400">Total</p><p className="text-xl font-bold">{tf.total}</p></div>
                  <div><p className="text-xs text-slate-400">Present</p><p className="text-xl font-bold text-emerald-600">{tf.present}</p></div>
                  <div><p className="text-xs text-slate-400">Absent</p><p className="text-xl font-bold text-rose-600">{tf.absent}</p></div>
                  <div><p className="text-xs text-slate-400">Late</p><p className="text-xl font-bold text-amber-500">{tf.late}</p></div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">Attendance</span>
                  <span className="text-lg font-bold text-fuchsia-600">{getPercentage(tf.present, tf.total)}%</span>
                </div>
              </div>
            )}

            <div className={`bg-gradient-to-br from-slate-900 to-slate-800 border-none rounded-2xl p-5 shadow-sm text-white ${memberType !== 'Combined' ? 'md:col-span-2' : ''}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><Activity className="w-4 h-4" /></div>
                <h3 className="font-bold text-white">Overall Summary</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div><p className="text-xs text-slate-400">Total Branches</p><p className="text-xl font-bold">{stats?.totalBranches || 0}</p></div>
                <div><p className="text-xs text-slate-400">Total Members</p><p className="text-xl font-bold">{combTotal}</p></div>
                <div><p className="text-xs text-slate-400">Total Present</p><p className="text-xl font-bold text-emerald-400">{combPresent}</p></div>
                <div><p className="text-xs text-slate-400">Total Absent</p><p className="text-xl font-bold text-rose-400">{combAbsent}</p></div>
                <div><p className="text-xs text-slate-400">Total Late</p><p className="text-xl font-bold text-amber-400">{combLate}</p></div>
                <div><p className="text-xs text-slate-400">Overall Rate</p><p className="text-xl font-bold text-indigo-400">{getPercentage(combPresent, combTotal)}%</p></div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h3 className="font-bold text-slate-900 text-lg">Graphical Visualization</h3>
              <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
                {(['bar', 'pie', 'line', 'scatter', 'area', 'doughnut', 'radar', 'stacked'] as ChartType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${chartType === type ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="w-full">
              {renderChart()}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
