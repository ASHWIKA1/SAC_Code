import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Users, UserCheck, UserX, Clock, Activity, ScanLine, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { SystemStats, AttendanceRecord } from '../types';

const mockChartData = [
  { name: 'Mon', present: 4000, absent: 240 },
  { name: 'Tue', present: 3000, absent: 139 },
  { name: 'Wed', present: 2000, absent: 980 },
  { name: 'Thu', present: 2780, absent: 390 },
  { name: 'Fri', present: 1890, absent: 480 },
  { name: 'Sat', present: 2390, absent: 380 },
  { name: 'Sun', present: 3490, absent: 430 },
];

export default function Dashboard() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    let queryParams = '';
    try {
      const userObj = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (userObj.role === 'Super Admin' && userObj.institutionId) {
        queryParams = `?institutionId=${userObj.institutionId}`;
      } else if (userObj.role === 'Admin' && userObj.branchId) {
        queryParams = `?branchId=${userObj.branchId}`;
      }
    } catch(e) {}

    fetch(`/api/stats${queryParams}`).then(res => res.json()).then(setStats);
    fetch(`/api/attendance/logs${queryParams}`).then(res => res.json()).then(setLogs);
  }, []);

  if (!stats) return <div className="animate-pulse space-y-4 pt-12 max-w-7xl mx-auto"><div className="h-32 bg-slate-200 rounded-2xl"></div></div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Students</p>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold">{stats.totalStudents.toLocaleString()}</span>
            <span className="text-emerald-500 text-sm font-medium">+4%</span>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Present Today</p>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold">{stats.presentToday.toLocaleString()}</span>
            <span className="text-emerald-500 text-sm font-medium">+2.3%</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Absent Today</p>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold">{stats.absentToday.toLocaleString()}</span>
            <span className="text-slate-400 text-sm">--</span>
          </div>
        </div>

        <div className="bg-indigo-600 p-5 rounded-2xl border-none shadow-sm text-white">
          <p className="text-indigo-100 text-xs font-semibold uppercase tracking-wider">Active Devices</p>
          <div className="flex items-end justify-between mt-2">
            <span className="text-3xl font-bold">{stats.activeDevices.toLocaleString()}</span>
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-indigo-200 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-100"></span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 h-full min-h-[300px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold">Weekly Attendance Trend</h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-indigo-500"></span><span className="text-[10px] text-slate-500">Present</span></div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-slate-200"></span><span className="text-[10px] text-slate-500">Absent</span></div>
              </div>
            </div>
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="present" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorPresent)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Live Attendance Feed</h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full uppercase tracking-widest font-bold">Real-time</span>
          </div>
          
          <div className="space-y-4 flex-1">
            {logs.length === 0 ? (
              <div className="text-center py-8 text-sm text-slate-500">No activity today</div>
            ) : (
              logs.slice(0, 5).map((log: any) => {
                const isUnknown = !log.student;
                const isLate = log.status === 'LATE';
                
                if (isUnknown) {
                  return (
                    <div key={log.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors bg-rose-50/50">
                      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 flex-shrink-0">
                        <Info className="w-5 h-5" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold text-rose-700 truncate">Unknown Device</p>
                        <p className="text-[10px] text-rose-400 truncate">RFID: {log.rfidUid}</p>
                      </div>
                      <p className="text-[10px] font-mono text-rose-500 font-bold whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  );
                }

                const studentName = log.student.name || log.student.Name || log.student['Student Name'] || 'Unknown Student';
                const initials = typeof studentName === 'string' && studentName.trim() ? studentName.trim().split(' ').map((n: string) => n[0]).join('').substring(0, 2) : 'U';
                const dept = log.student.department || log.student.Class || log.student.Department || '';
                const year = log.student.year || log.student.Sec || log.student.Year || '';
                
                return (
                  <div key={log.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 border-2 border-white shadow-sm flex flex-shrink-0 items-center justify-center text-indigo-500 font-bold text-xs uppercase">
                      {initials}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 truncate">{studentName}</p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {dept} {year && `• ${year}`}
                      </p>
                    </div>
                    <p className={`text-[10px] font-mono font-bold whitespace-nowrap ${isLate ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="mt-6">
            <button className="w-full py-2 bg-slate-50 text-slate-500 text-xs font-bold rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
              View Full Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
