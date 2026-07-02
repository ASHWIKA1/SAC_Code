import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Network, Trash2, Clock, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

const defaultForm = { 
  name: '', 
  type: 'school', 
  entryTime: '08:00', 
  exitTime: '15:00', 
  allowCombinedKiosk: false,
  studentEntryTime: '08:00',
  studentExitTime: '15:00',
  staffEntryTime: '07:30',
  staffExitTime: '16:00',
  requireExitScan: false
};

export default function Branches({ institutionId }: { institutionId: string }) {
  const [branches, setBranches] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchBranches = async () => {
    if (!institutionId) return;
    const res = await fetch(`/api/branches?institutionId=${institutionId}`);
    const data = await res.json();
    setBranches(data);
  };

  useEffect(() => {
    fetchBranches();
  }, [institutionId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEditing = !!editingId;
      const url = isEditing ? `/api/branches/${editingId}` : '/api/branches';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, institutionId })
      });

      if (res.ok) {
        toast.success(`Branch ${isEditing ? 'updated' : 'created'} successfully`);
        closeDialog();
        fetchBranches();
      } else {
        toast.error(`Failed to ${isEditing ? 'update' : 'create'} branch`);
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this branch and all its students/logs?")) {
      await fetch(`/api/branches/${id}`, { method: 'DELETE' });
      toast.success("Branch deleted");
      fetchBranches();
    }
  };

  const openNew = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setIsOpen(true);
  };

  const openEdit = (branch: any) => {
    setEditingId(branch.id);
    setFormData({
      name: branch.name,
      type: branch.type,
      entryTime: branch.entryTime || '08:00',
      exitTime: branch.exitTime || '15:00',
      allowCombinedKiosk: !!branch.allowCombinedKiosk,
      studentEntryTime: branch.studentEntryTime || '08:00',
      studentExitTime: branch.studentExitTime || '15:00',
      staffEntryTime: branch.staffEntryTime || '07:30',
      staffExitTime: branch.staffExitTime || '16:00',
      requireExitScan: !!branch.requireExitScan
    });
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setTimeout(() => {
      setEditingId(null);
      setFormData(defaultForm);
    }, 200);
  };

  if (!institutionId) {
    return <div className="text-center py-12 text-slate-500">Institution not found for this account. Please contact support.</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Branches</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage schools and colleges within your institution.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Button onClick={openNew} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 shadow-sm font-bold">
            <Plus className="w-4 h-4 mr-2" /> Add Branch
          </Button>
          <DialogContent className="max-w-md sm:rounded-3xl border-slate-200 overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-slate-800 tracking-tight">{editingId ? 'Edit Branch' : 'Create New Branch'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Branch Name</Label>
                <Input id="name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. South Campus College" className="bg-slate-50 h-10 rounded-lg" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val})}>
                  <SelectTrigger className="bg-slate-50 h-10 rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-slate-100 mt-2">
                <div className="space-y-1">
                  <Label>Allow Combined Kiosks</Label>
                  <p className="text-xs text-slate-500">Permit Students and Staff to mark attendance on the same terminal with same timings.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.allowCombinedKiosk} 
                  onChange={(e) => setFormData({...formData, allowCombinedKiosk: e.target.checked})}
                  className="w-5 h-5 text-indigo-600 rounded"
                />
              </div>

              {formData.allowCombinedKiosk ? (
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500 uppercase tracking-wider">Entry Time</Label>
                    <Input type="time" required value={formData.entryTime} onChange={(e) => setFormData({...formData, entryTime: e.target.value})} className="bg-white h-10 rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500 uppercase tracking-wider">Exit Time</Label>
                    <Input type="time" required value={formData.exitTime} onChange={(e) => setFormData({...formData, exitTime: e.target.value})} className="bg-white h-10 rounded-lg" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 bg-slate-50 p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student Timings</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-500">Entry Time</Label>
                      <Input type="time" required value={formData.studentEntryTime} onChange={(e) => setFormData({...formData, studentEntryTime: e.target.value})} className="bg-white h-10 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-500">Exit Time</Label>
                      <Input type="time" required value={formData.studentExitTime} onChange={(e) => setFormData({...formData, studentExitTime: e.target.value})} className="bg-white h-10 rounded-lg" />
                    </div>
                  </div>
                  
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-2 border-t border-slate-200">Staff Timings</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-500">Entry Time</Label>
                      <Input type="time" required value={formData.staffEntryTime} onChange={(e) => setFormData({...formData, staffEntryTime: e.target.value})} className="bg-white h-10 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-500">Exit Time</Label>
                      <Input type="time" required value={formData.staffExitTime} onChange={(e) => setFormData({...formData, staffExitTime: e.target.value})} className="bg-white h-10 rounded-lg" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between py-2 border-t border-slate-100 mt-2">
                <div className="space-y-1">
                  <Label>Require RFID Exit Scan</Label>
                  <p className="text-xs text-slate-500">Make it mandatory for members to scan their card upon leaving.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={formData.requireExitScan} 
                  onChange={(e) => setFormData({...formData, requireExitScan: e.target.checked})}
                  className="w-5 h-5 text-indigo-600 rounded"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={closeDialog} className="rounded-xl">Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {branches.map(branch => (
          <div key={branch.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col relative group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <Network className="w-6 h-6" />
              </div>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold uppercase tracking-widest">
                {branch.type}
              </span>
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">{branch.name}</h3>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {branch.allowCombinedKiosk ? (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Combined Kiosk</span>
              ) : (
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">Separated Kiosks</span>
              )}
              {branch.requireExitScan ? (
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Exit Scan Reqd</span>
              ) : null}
            </div>
            
            <div className="mt-auto pt-4 border-t border-slate-100">
              {branch.allowCombinedKiosk ? (
                <div className="grid grid-cols-2 gap-2 text-slate-500">
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-500" /><span className="text-sm font-medium">{branch.entryTime}</span></div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /><span className="text-sm font-medium">{branch.exitTime}</span></div>
                </div>
              ) : (
                <div className="space-y-2 text-slate-500">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-400 uppercase tracking-widest">Student</span>
                    <span className="font-medium">{branch.studentEntryTime} - {branch.studentExitTime}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-400 uppercase tracking-widest">Staff</span>
                    <span className="font-medium">{branch.staffEntryTime} - {branch.staffExitTime}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" onClick={() => openEdit(branch)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(branch.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {branches.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-200 rounded-3xl">
            No branches created yet.
          </div>
        )}
      </div>
    </div>
  );
}
