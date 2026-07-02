import React, { useState, useEffect } from 'react';
import { Network, Laptop, Clock, ShieldCheck, Activity } from 'lucide-react';

export default function DeviceSettings() {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [activeDevices, setActiveDevices] = useState<any[]>([]);

  useEffect(() => {
    try {
      const userObj = JSON.parse(localStorage.getItem('currentUser') || '{}');
      setDeviceInfo(userObj);
      if (userObj.branchId) {
        fetch(`/api/devices?branchId=${userObj.branchId}`)
          .then(res => res.json())
          .then(setActiveDevices);
      }
    } catch(e) {}
  }, []);

  if (!deviceInfo) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Device Settings</h1>
        <p className="text-slate-500 mt-1 text-sm">View current kiosk terminal information and status.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800">This Terminal</h3>
            <p className="text-xs text-slate-500 mt-1">Details about the current active session.</p>
          </div>
          <span className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-100">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            Online
          </span>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Device Name</p>
              <p className="font-semibold text-slate-800">{deviceInfo.deviceName || 'Unknown Scanner'}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Account</p>
              <p className="font-semibold text-slate-800">{deviceInfo.name} ({deviceInfo.email})</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800">All Connected Devices</h3>
          <p className="text-xs text-slate-500 mt-1">Other terminals logged into this branch network.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Device Name</th>
                <th className="px-6 py-4 font-semibold text-slate-700">OS / Platform</th>
                <th className="px-6 py-4 font-semibold text-slate-700">IP Address</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Login Time</th>
                <th className="px-6 py-4 text-center font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {activeDevices.map(device => (
                <tr key={device.id} className={`hover:bg-slate-50/50 transition-colors ${device.id === deviceInfo.sessionId ? 'bg-indigo-50/30' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Laptop className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-800">{device.deviceName}</span>
                      {device.id === deviceInfo.sessionId && (
                         <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">This Device</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{device.os || 'Unknown OS'}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{device.ipAddress}</td>
                  <td className="px-6 py-4 text-slate-600">{new Date(device.loginTime).toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                      <Activity className="w-3 h-3" /> Active
                    </div>
                  </td>
                </tr>
              ))}
              {activeDevices.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No active devices found. Log out and log back in to register this session.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
        <h4 className="font-bold text-amber-800 mb-2">Security Notice</h4>
        <p className="text-sm text-amber-700 leading-relaxed">
          This device is configured as an attendance kiosk. To prevent unauthorized access, the system is locked to the scanner interface. To reconfigure this terminal or change its associated branch/institution, please log out and sign in with an Administrator account.
        </p>
      </div>
    </div>
  );
}
