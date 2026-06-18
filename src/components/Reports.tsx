import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

export default function Reports() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/attendance/logs')
      .then(res => res.json())
      .then(setLogs);
  }, []);

  const handleExport = async () => {
    const { utils, writeFile } = await import('xlsx');
    const exportData = logs.map(l => ({
      'Student Name': l.student?.name || 'Unknown',
      'Roll Number': l.student?.rollNumber || 'N/A',
      'Time': new Date(l.timestamp).toLocaleString(),
      'Status': l.status
    }));
    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Attendance Logs");
    writeFile(wb, "Attendance_Reports.xlsx");
    toast.success("Reports exported successfully");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Attendance Reports</h1>
          <p className="text-slate-500 mt-1 text-sm">View and export recent attendance logs.</p>
        </div>
        <Button variant="outline" size="sm" className="rounded-lg h-9" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-medium text-slate-800">
                  {log.student?.name || 'Unknown Card'}
                  <div className="text-xs text-slate-400 font-normal">{log.student?.rollNumber || log.rfidUid}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${log.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {log.status || 'UNREGISTERED'}
                  </span>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-slate-400">No logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
