import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, LineChart, Line, ScatterChart, Scatter,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { Download, FileText, FileSpreadsheet, Users, Network, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { toast } from 'sonner';

type ChartType = 'bar' | 'pie' | 'line' | 'scatter' | 'area' | 'doughnut' | 'radar' | 'stacked';
type MemberType = 'Combined' | 'Student' | 'Staff';
type DatePreset = 'today' | 'yesterday' | 'week' | 'month' | 'lastMonth' | 'custom';

export default function SpecificAnalytics() {
  const [branchesStats, setBranchesStats] = useState<any[]>([]);
  const [branchesList, setBranchesList] = useState<any[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  
  // Filters
  const [datePreset, setDatePreset] = useState<DatePreset>('today');
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [memberType, setMemberType] = useState<MemberType>('Combined');
  
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const institutionId = currentUser.institutionId;

  const fetchBranchesList = async () => {
    if (!institutionId) return;
    const res = await fetch(`/api/branches?institutionId=${institutionId}`);
    const data = await res.json();
    setBranchesList(data);
  };

  const fetchSpecificStats = async () => {
    if (!institutionId) return;
    setIsLoading(true);
    try {
      let url = `/api/analytics/specific?institutionId=${institutionId}`;
      if (selectedBranchId) url += `&branchId=${selectedBranchId}`;
      if (dateFrom && dateTo) url += `&dateFrom=${dateFrom}&dateTo=${dateTo}`;
      if (memberType !== 'Combined') url += `&memberType=${memberType}`;

      const res = await fetch(url);
      const data = await res.json();
      setBranchesStats(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch analytics');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBranchesList();
  }, [institutionId]);

  useEffect(() => {
    handleDatePreset(datePreset);
  }, [datePreset]);

  useEffect(() => {
    if (datePreset === 'custom' || datePreset !== 'custom') {
      fetchSpecificStats();
    }
  }, [dateFrom, dateTo, memberType, selectedBranchId]);

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

  const getPercentage = (present: number, total: number) => {
    if (total === 0) return 0;
    return ((present / total) * 100).toFixed(1);
  };

  const handleExportCSV = () => {
    if (branchesStats.length === 0) return;
    let csv = 'Branch Name,Category,Total,Present,Absent,Late,Attendance %\n';
    
    branchesStats.forEach(b => {
      if (memberType === 'Combined' || memberType === 'Student') {
        const s = b.students;
        const pct = s.total > 0 ? ((s.present / s.total) * 100).toFixed(1) : '0';
        csv += `"${b.branch.name}",Students,${s.total},${s.present},${s.absent},${s.late},${pct}%\n`;
      }
      if (memberType === 'Combined' || memberType === 'Staff') {
        const s = b.staff;
        const pct = s.total > 0 ? ((s.present / s.total) * 100).toFixed(1) : '0';
        csv += `"${b.branch.name}",Staff,${s.total},${s.present},${s.absent},${s.late},${pct}%\n`;
      }
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `specific_analytics_${dateFrom}_${dateTo}.csv`;
    a.click();
    toast.success('CSV Exported');
  };

  const handleExportExcel = async () => {
    if (branchesStats.length === 0) return;
    const { utils, writeFile } = await import('xlsx');
    const exportData: any[] = [];
    
    branchesStats.forEach(b => {
      if (memberType === 'Combined' || memberType === 'Student') {
        const s = b.students;
        exportData.push({
          'Branch Name': b.branch.name,
          'Category': 'Students',
          'Total': s.total,
          'Present': s.present,
          'Absent': s.absent,
          'Late': s.late,
          'Attendance %': s.total > 0 ? ((s.present / s.total) * 100).toFixed(1) + '%' : '0%'
        });
      }
      if (memberType === 'Combined' || memberType === 'Staff') {
        const s = b.staff;
        exportData.push({
          'Branch Name': b.branch.name,
          'Category': 'Staff',
          'Total': s.total,
          'Present': s.present,
          'Absent': s.absent,
          'Late': s.late,
          'Attendance %': s.total > 0 ? ((s.present / s.total) * 100).toFixed(1) + '%' : '0%'
        });
      }
    });

    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Analytics");
    writeFile(wb, `specific_analytics_${dateFrom}_${dateTo}.xlsx`);
    toast.success('Excel Exported');
  };

  const handleExportPDF = async () => {
    if (branchesStats.length === 0) return;
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Specific Branch Analytics', 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Date Range: ${dateFrom} to ${dateTo}`, 14, 30);
    doc.text(`Filter: ${memberType} | Branch: ${selectedBranchId ? branchesList.find(b=>b.id===selectedBranchId)?.name : 'All Branches'}`, 14, 36);

    const body: any[] = [];
    branchesStats.forEach(b => {
      if (memberType === 'Combined' || memberType === 'Student') {
        const s = b.students;
        body.push([b.branch.name, 'Students', s.total, s.present, s.absent, s.late, s.total > 0 ? ((s.present / s.total) * 100).toFixed(1) + '%' : '0%']);
      }
      if (memberType === 'Combined' || memberType === 'Staff') {
        const s = b.staff;
        body.push([b.branch.name, 'Staff', s.total, s.present, s.absent, s.late, s.total > 0 ? ((s.present / s.total) * 100).toFixed(1) + '%' : '0%']);
      }
    });

    autoTable(doc, {
      startY: 45,
      head: [['Branch', 'Category', 'Total', 'Present', 'Absent', 'Late', 'Attendance %']],
      body: body,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] }
    });

    doc.save(`specific_analytics_${dateFrom}_${dateTo}.pdf`);
    toast.success('PDF Exported');
  };

  if (!currentUser || currentUser.role !== 'Super Admin') {
    return <div className="text-center py-12 text-slate-500">Access Restricted: Super Admin Only</div>;
  }

  // Generate chart data based on whatever branches are loaded
  const chartData = branchesStats.map(b => {
    let p = 0, a = 0, l = 0;
    if (memberType === 'Combined' || memberType === 'Student') {
      p += b.students.present; a += b.students.absent; l += b.students.late;
    }
    if (memberType === 'Combined' || memberType === 'Staff') {
      p += b.staff.present; a += b.staff.absent; l += b.staff.late;
    }
    return { name: b.branch.name, Present: p, Absent: a, Late: l };
  });

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
        // Show distribution of total present across branches
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={chartData} 
                cx="50%" cy="50%" 
                innerRadius={chartType === 'doughnut' ? 60 : 0} 
                outerRadius={100} 
                fill="#8884d8" 
                paddingAngle={5} 
                dataKey="Present"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#ec4899'][index % 6]} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Specific Analytics</h1>
          <p className="text-slate-500 mt-1 text-sm">Detailed branch-wise attendance metrics.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF} className="h-9"><FileText className="w-4 h-4 mr-2" /> PDF</Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="h-9"><FileSpreadsheet className="w-4 h-4 mr-2" /> Excel</Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9"><Download className="w-4 h-4 mr-2" /> CSV</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-end gap-4">
        <div className="space-y-1.5 flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Branch</label>
          <Select value={selectedBranchId || 'All'} onValueChange={(v) => setSelectedBranchId(v === 'All' ? null : v)}>
            <SelectTrigger className="w-full h-9"><SelectValue placeholder="All Branches" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Branches</SelectItem>
              {branchesList.map(b => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-slate-200 rounded-2xl w-full"></div>
          <div className="h-64 bg-slate-200 rounded-2xl w-full"></div>
        </div>
      ) : (
        <>
          {/* List of Branch Stats */}
          {branchesStats.length === 0 ? (
            <div className="text-center py-12 text-slate-500 bg-white border border-slate-200 rounded-3xl">No data found for the selected filters.</div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {branchesStats.map(b => (
                <div key={b.branch.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Network className="w-5 h-5" /></div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight">{b.branch.name}</h3>
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">{b.branch.type}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Students */}
                    {(memberType === 'Combined' || memberType === 'Student') && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-400" />
                          <h4 className="text-sm font-bold text-slate-700">Student Analytics</h4>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-2 gap-y-4 gap-x-2">
                          <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total</p><p className="text-lg font-bold">{b.students.total}</p></div>
                          <div><p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Present</p><p className="text-lg font-bold text-emerald-600">{b.students.present}</p></div>
                          <div><p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">Absent</p><p className="text-lg font-bold text-rose-600">{b.students.absent}</p></div>
                          <div><p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Late</p><p className="text-lg font-bold text-amber-500">{b.students.late}</p></div>
                          <div className="col-span-2 pt-2 border-t border-slate-200 flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Attendance %</span>
                            <span className="font-bold text-indigo-600">{getPercentage(b.students.present, b.students.total)}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Staff */}
                    {(memberType === 'Combined' || memberType === 'Staff') && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-400" />
                          <h4 className="text-sm font-bold text-slate-700">Teacher Analytics</h4>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-2 gap-y-4 gap-x-2">
                          <div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total</p><p className="text-lg font-bold">{b.staff.total}</p></div>
                          <div><p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Present</p><p className="text-lg font-bold text-emerald-600">{b.staff.present}</p></div>
                          <div><p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">Absent</p><p className="text-lg font-bold text-rose-600">{b.staff.absent}</p></div>
                          <div><p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Late</p><p className="text-lg font-bold text-amber-500">{b.staff.late}</p></div>
                          <div className="col-span-2 pt-2 border-t border-slate-200 flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Attendance %</span>
                            <span className="font-bold text-fuchsia-600">{getPercentage(b.staff.present, b.staff.total)}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Chart Section */}
          {branchesStats.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h3 className="font-bold text-slate-900 text-lg">Branch Comparisons</h3>
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
          )}
        </>
      )}
    </div>
  );
}
