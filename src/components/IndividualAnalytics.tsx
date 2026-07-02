import React, { useState, useEffect } from 'react';
import { Search, Loader2, User, Calendar, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { toast } from 'sonner';
import { format, subDays, isSameDay } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export default function IndividualAnalytics() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any | null>(null);
  
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  useEffect(() => {
    // Fetch all accessible students for the search
    let url = '/api/students';
    const params = new URLSearchParams();
    if (currentUser.role === 'Admin' && currentUser.branchId) {
      params.append('branchId', currentUser.branchId);
    } else if (currentUser.role === 'Super Admin' && currentUser.institutionId) {
      params.append('institutionId', currentUser.institutionId);
    }
    
    if (params.toString()) url += `?${params.toString()}`;

    fetch(url)
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(err => console.error('Failed to fetch students for search', err));
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStudents([]);
      return;
    }
    const lowerSearch = searchTerm.toLowerCase();
    const results = students.filter(s => 
      Object.values(s).some(val => 
        val && typeof val === 'string' && val.toLowerCase().includes(lowerSearch)
      )
    );
    setFilteredStudents(results.slice(0, 10)); // Limit to top 10 results
  }, [searchTerm, students]);

  useEffect(() => {
    if (selectedStudent) {
      fetchAnalytics(selectedStudent.id);
    }
  }, [selectedStudent, dateRange]);

  const fetchAnalytics = async (studentId: string) => {
    setLoading(true);
    try {
      let url = `/api/analytics/individual/${studentId}?institutionId=${currentUser.institutionId}`;
      if (dateRange.from) url += `&dateFrom=${format(dateRange.from, 'yyyy-MM-dd')}`;
      if (dateRange.to) url += `&dateTo=${format(dateRange.to, 'yyyy-MM-dd')}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setAnalyticsData(data);
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to load analytics');
        setAnalyticsData(null);
      }
    } catch (err) {
      toast.error('Network error while fetching analytics');
    } finally {
      setLoading(false);
    }
  };

  const getWorkingDaysCount = () => {
    if (!dateRange.from || !dateRange.to) return 0;
    const diffTime = Math.abs(dateRange.to.getTime() - dateRange.from.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive
  };

  const calculateAbsent = () => {
    if (!analyticsData) return 0;
    const workingDays = getWorkingDaysCount();
    return Math.max(0, workingDays - analyticsData.summary.totalPresent);
  };

  // Prepare chart data (Daily attendance count, 1 for present, 0 for absent, though simpler to just show Entry times or statuses)
  // Let's create a timeline of the last N days
  const getChartData = () => {
    if (!analyticsData || !dateRange.from || !dateRange.to) return [];
    
    const data = [];
    let current = new Date(dateRange.from);
    const end = new Date(dateRange.to);
    
    while (current <= end) {
      const dateStr = format(current, 'yyyy-MM-dd');
      const recordsForDay = analyticsData.history.filter((r: any) => r.timestamp.startsWith(dateStr));
      const entryRecord = recordsForDay.find((r: any) => r.type === 'ENTRY');
      
      data.push({
        date: format(current, 'MMM dd'),
        fullDate: dateStr,
        status: entryRecord ? (entryRecord.status === 'LATE' ? 'Late' : 'Present') : 'Absent',
        value: entryRecord ? 1 : 0 // 1 for present/late, 0 for absent
      });
      
      current.setDate(current.getDate() + 1);
    }
    return data;
  };

  const chartData = getChartData();

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Individual Analytics</h1>
          <p className="text-slate-500 mt-1 text-sm">Search for an individual to view detailed attendance history.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="relative">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input 
                type="text"
                placeholder="Search by Name, Registration No., RFID..." 
                className="pl-10 h-12 bg-slate-50 border-slate-200 rounded-xl text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-12 border-slate-200 rounded-xl px-4 text-slate-600 font-medium">
                  <Calendar className="w-4 h-4 mr-2" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Select Dates</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <DayPicker
                  mode="range"
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => {
                    setDateRange({ from: range?.from, to: range?.to });
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Dropdown */}
          {searchTerm && filteredStudents.length > 0 && !selectedStudent && (
            <div className="absolute top-14 left-0 w-full max-w-2xl bg-white border border-slate-200 shadow-xl rounded-xl z-50 overflow-hidden">
              <div className="max-h-80 overflow-y-auto">
                {filteredStudents.map(student => (
                  <div 
                    key={student.id} 
                    className="p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                    onClick={() => {
                      setSelectedStudent(student);
                      setSearchTerm('');
                    }}
                  >
                    <div className="flex items-center gap-3">
                       {student.photoUrl ? (
                          <img src={student.photoUrl} alt="Photo" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-500 text-sm">
                            {student.Name?.[0] || '?'}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{student.Name || 'Unknown Name'}</p>
                          <p className="text-xs text-slate-500">{student.RegistrationNumber || student.rollNumber || student.rfidUid || 'No ID'}</p>
                        </div>
                    </div>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600">{student.memberType}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      )}

      {!loading && analyticsData && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
              <div className="relative mb-4">
                 {analyticsData.student.photoUrl ? (
                    <img src={analyticsData.student.photoUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover shadow-sm border-4 border-white" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-500 text-3xl shadow-sm border-4 border-white">
                      {analyticsData.student.Name?.[0] || '?'}
                    </div>
                  )}
                  <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-indigo-600 hover:bg-indigo-700">
                    {analyticsData.student.memberType}
                  </Badge>
              </div>
              <h2 className="text-xl font-bold text-slate-800">{analyticsData.student.Name || 'N/A'}</h2>
              <p className="text-sm text-slate-500 mb-6">{analyticsData.branch.name}</p>
              
              <div className="w-full space-y-3 text-left">
                {Object.entries(analyticsData.student).map(([key, value]) => {
                  if (['id', 'branchId', 'photoUrl', 'createdAt', 'updatedAt', 'memberType'].includes(key)) return null;
                  if (!value) return null;
                  return (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-medium text-slate-800 text-sm">{String(value)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary & Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-semibold text-slate-500">Selected Days</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{getWorkingDaysCount()}</p>
                 </div>
                 <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                        <User className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-semibold text-slate-500">Present</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{analyticsData.summary.totalPresent}</p>
                 </div>
                 <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-semibold text-slate-500">Absent</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{calculateAbsent()}</p>
                 </div>
                 <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                        <Clock className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-semibold text-slate-500">Late</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{analyticsData.summary.totalLate}</p>
                 </div>
              </div>

              {/* Chart */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-6">Attendance Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} ticks={[0, 1]} tickFormatter={(val) => val === 1 ? 'Present' : 'Absent'} />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-xl">
                                <p className="font-bold text-slate-800 mb-1">{data.fullDate}</p>
                                <p className={`text-sm font-medium ${data.status === 'Present' ? 'text-emerald-600' : data.status === 'Late' ? 'text-amber-600' : 'text-rose-600'}`}>
                                  {data.status}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.status === 'Present' ? '#10b981' : entry.status === 'Late' ? '#f59e0b' : '#f43f5e'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* History Table */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Detailed History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Device</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {analyticsData.history.length > 0 ? (
                    analyticsData.history.map((record: any) => (
                      <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-700">
                          {format(new Date(record.timestamp), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {format(new Date(record.timestamp), 'hh:mm a')}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={`${record.type === 'ENTRY' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-600 border-slate-200'} font-bold`}>
                            {record.type}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                           {record.status === 'PRESENT' || record.status === 'LEFT' ? (
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold">Valid</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-bold">Late</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {record.deviceName || 'Unknown'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                        No attendance records found for this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
