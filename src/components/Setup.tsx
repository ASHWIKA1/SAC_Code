import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function Setup() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Platform Settings</h1>
        <p className="text-slate-500 mt-1 text-sm">Configure global preferences and attendance rules.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800">Attendance Display</h3>
          <p className="text-xs text-slate-500 mt-1">Control how the live scanning terminal behaves.</p>
        </div>
        <div className="p-6 space-y-8 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-800">Success Screen Duration</label>
              <p className="text-xs text-slate-500">How long student details remain visible after a successful scan.</p>
            </div>
            <div className="w-full sm:w-[200px]">
              <Select defaultValue="4">
                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50 h-10">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  <SelectItem value="2" className="rounded-lg text-sm">2 seconds</SelectItem>
                  <SelectItem value="4" className="rounded-lg text-sm">4 seconds</SelectItem>
                  <SelectItem value="10" className="rounded-lg text-sm">10 seconds</SelectItem>
                  <SelectItem value="15" className="rounded-lg text-sm">15 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="h-[1px] w-full bg-slate-100"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-800">Duplicate Scan Protection</label>
              <p className="text-xs text-slate-500">Prevent multiple scans from the same card within this window.</p>
            </div>
            <div className="w-full sm:w-[200px]">
              <Select defaultValue="60">
                <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50 h-10">
                  <SelectValue placeholder="Select limit" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200">
                  <SelectItem value="30" className="rounded-lg text-sm">30 seconds</SelectItem>
                  <SelectItem value="60" className="rounded-lg text-sm">1 minute</SelectItem>
                  <SelectItem value="300" className="rounded-lg text-sm">5 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="h-[1px] w-full bg-slate-100"></div>

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-800">Voice Feedback</label>
              <p className="text-xs text-slate-500">Announce student names using text-to-speech.</p>
            </div>
            <Switch defaultChecked className="data-[state=checked]:bg-indigo-600" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800">Role Management</h3>
          <p className="text-xs text-slate-500 mt-1">Manage system administrators and staff access.</p>
        </div>
        <div className="p-6 bg-white">
          <AdminManager />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800">Data Sync & Backup</h3>
          <p className="text-xs text-slate-500 mt-1">Manage your dataset and database synchronizations</p>
        </div>
        <div className="p-6 space-y-6 bg-white">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="w-full rounded-xl h-10 border-slate-200 font-semibold text-slate-600">Export Complete Database</Button>
            <Button variant="outline" className="w-full rounded-xl h-10 border-slate-200 font-semibold text-slate-600">Sync with Active Directory</Button>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
             <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></div>
             <p className="text-xs text-amber-700 leading-relaxed font-medium">
                External Database Mode: Not configured.<br />
                Currently running on local high-performance memory store. Data will reset on server restart.
             </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 pb-12">
        <Button variant="ghost" className="rounded-xl h-10 font-bold text-slate-500">Reset to Defaults</Button>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 px-6 shadow-sm font-bold border-none">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function AdminManager() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Super Admin' });

  const fetchAdmins = async () => {
    const res = await fetch('/api/admins');
    const data = await res.json();
    setAdmins(data);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Admin created successfully");
        setIsOpen(false);
        setFormData({ name: '', email: '', password: '', role: 'Super Admin' });
        fetchAdmins();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to create admin");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const handleDelete = async (id: string, role: string) => {
    if (role === 'Ultra Admin') {
      toast.error("Cannot delete the Ultra Admin");
      return;
    }
    if (window.confirm("Are you sure you want to delete this admin?")) {
      await fetch(`/api/admins/${id}`, { method: 'DELETE' });
      toast.success("Admin deleted successfully");
      fetchAdmins();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-bold text-slate-800">System Administrators</h4>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-9 border-none">
              <Plus className="w-4 h-4 mr-2" /> Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md sm:rounded-2xl border-slate-200">
            <DialogHeader>
              <DialogTitle className="text-slate-800 tracking-tight">Create New Admin</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email / Username</Label>
                <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <Input id="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(val) => setFormData({...formData, role: val})}>
                  <SelectTrigger className="bg-slate-50"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">Create Account</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-700">Name</th>
              <th className="px-4 py-3 font-semibold text-slate-700">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {admins.map(admin => (
              <tr key={admin.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-800">{admin.name}</div>
                  <div className="text-xs text-slate-500">{admin.email}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${admin.role === 'Ultra Admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                    {admin.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {admin.role !== 'Ultra Admin' && (
                    <Button variant="ghost" size="icon" className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 h-8 w-8" onClick={() => handleDelete(admin.id, admin.role)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
