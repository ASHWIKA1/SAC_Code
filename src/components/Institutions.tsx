import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plus, Building2, Trash2, Pencil, Mail, KeyRound, User, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

const emptyForm = { name: '', types: ['school'] as string[], superAdminName: '', email: '', password: '' };

export default function Institutions() {
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingInst, setEditingInst] = useState<any>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [editFormData, setEditFormData] = useState({ ...emptyForm });
  const [linkedAdmins, setLinkedAdmins] = useState<Record<string, any>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  const fetchInstitutions = async () => {
    try {
      const res = await fetch('/api/institutions');
      const data = await res.json();
      setInstitutions(data);

      // For each institution, fetch the linked Super Admin to show in the card
      const adminsRes = await fetch('/api/admins');
      const admins = await adminsRes.json();
      const adminMap: Record<string, any> = {};
      (Array.isArray(admins) ? admins : []).forEach((a: any) => {
        if (a.role === 'Super Admin' && a.institutionId) {
          adminMap[a.institutionId] = a;
        }
      });
      setLinkedAdmins(adminMap);
    } catch (e) {
      console.error('Failed to fetch institutions', e);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const handleTypeToggle = (type: string, isEdit = false) => {
    const setter = isEdit ? setEditFormData : setFormData;
    setter(prev => {
      if (prev.types.includes(type)) {
        return { ...prev, types: prev.types.filter(t => t !== type) };
      }
      return { ...prev, types: [...prev.types, type] };
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.types.length === 0) {
      toast.error('Please select at least one institution type');
      return;
    }
    if (!formData.email || !formData.password) {
      toast.error('Super Admin email and password are required');
      return;
    }
    try {
      const res = await fetch('/api/institutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Institution & Super Admin created successfully");
        setIsOpen(false);
        setFormData({ ...emptyForm });
        setShowPassword(false);
        fetchInstitutions();
      } else {
        toast.error(data.error || "Failed to create institution");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInst) return;
    if (editFormData.types.length === 0) {
      toast.error('Please select at least one institution type');
      return;
    }
    try {
      const res = await fetch(`/api/institutions/${editingInst.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Institution updated successfully");
        setIsEditOpen(false);
        setEditingInst(null);
        setShowEditPassword(false);
        fetchInstitutions();
      } else {
        toast.error(data.error || "Failed to update institution");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const openEditDialog = (inst: any) => {
    const types = typeof inst.types === 'string' ? JSON.parse(inst.types) : inst.types;
    const admin = linkedAdmins[inst.id];
    setEditingInst(inst);
    setEditFormData({
      name: inst.name,
      types: types || ['school'],
      superAdminName: admin?.name || '',
      email: admin?.email || '',
      password: ''
    });
    setShowEditPassword(false);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this institution and all its data?")) {
      await fetch(`/api/institutions/${id}`, { method: 'DELETE' });
      toast.success("Institution deleted");
      fetchInstitutions();
    }
  };

  const renderFormFields = (data: typeof formData, setter: React.Dispatch<React.SetStateAction<typeof formData>>, isEdit: boolean) => {
    const passwordVisible = isEdit ? showEditPassword : showPassword;
    const setPasswordVisible = isEdit ? setShowEditPassword : setShowPassword;

    return (
      <>
        <div className="space-y-2">
          <Label htmlFor={isEdit ? "edit-name" : "name"}>Institution Name</Label>
          <Input id={isEdit ? "edit-name" : "name"} required value={data.name} onChange={(e) => setter({...data, name: e.target.value})} placeholder="e.g. Springfield Education Group" className="bg-slate-50 h-10 rounded-lg" />
        </div>
        <div className="space-y-2">
          <Label>Allowed Branch Types</Label>
          <div className="flex gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={data.types.includes('school')} onChange={() => handleTypeToggle('school', isEdit)} className="rounded text-indigo-600 w-4 h-4" />
              <span className="text-sm font-medium">School</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={data.types.includes('college')} onChange={() => handleTypeToggle('college', isEdit)} className="rounded text-indigo-600 w-4 h-4" />
              <span className="text-sm font-medium">College</span>
            </label>
          </div>
        </div>

        <div className="h-[1px] w-full bg-slate-200 my-2"></div>

        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" />
            Super Admin Credentials
          </h4>
          <p className="text-xs text-slate-500">The Super Admin will use these credentials to log in and manage this institution.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor={isEdit ? "edit-saName" : "saName"}>Super Admin Name</Label>
          <Input id={isEdit ? "edit-saName" : "saName"} required value={data.superAdminName} onChange={(e) => setter({...data, superAdminName: e.target.value})} placeholder="e.g. John Doe" className="bg-slate-50 h-10 rounded-lg" />
        </div>
        <div className="space-y-2">
          <Label htmlFor={isEdit ? "edit-email" : "email"}>
            <span className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-400" /> Email Address</span>
          </Label>
          <Input id={isEdit ? "edit-email" : "email"} type="email" required value={data.email} onChange={(e) => setter({...data, email: e.target.value})} placeholder="admin@institution.com" className="bg-slate-50 h-10 rounded-lg" />
        </div>
        <div className="space-y-2">
          <Label htmlFor={isEdit ? "edit-password" : "password"}>
            <span className="flex items-center gap-1.5"><KeyRound className="w-3 h-3 text-slate-400" /> {isEdit ? 'New Password (leave blank to keep current)' : 'Temporary Password'}</span>
          </Label>
          <div className="relative">
            <Input 
              id={isEdit ? "edit-password" : "password"} 
              type={passwordVisible ? "text" : "password"} 
              required={!isEdit} 
              value={data.password} 
              onChange={(e) => setter({...data, password: e.target.value})} 
              placeholder={isEdit ? '••••••••' : 'Set a temporary password'} 
              className="bg-slate-50 h-10 rounded-lg pr-10" 
            />
            <button 
              type="button" 
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {passwordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Institutions Management</h1>
          <p className="text-slate-500 mt-1 text-sm">Create and manage registered institutions across the platform.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) { setShowPassword(false); setFormData({...emptyForm}); } }}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 shadow-sm font-bold">
              <Plus className="w-4 h-4 mr-2" /> New Institution
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md sm:rounded-3xl border-slate-200 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-slate-800 tracking-tight">Register Institution</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 pt-4">
              {renderFormFields(formData, setFormData, false)}
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl">Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">Create</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {institutions.map(inst => {
          const admin = linkedAdmins[inst.id];
          return (
            <div key={inst.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col relative group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">{inst.name}</h3>
              <div className="flex gap-2 mt-2">
                {(typeof inst.types === 'string' ? JSON.parse(inst.types) : inst.types)?.map((t: string) => (
                  <span key={t} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold uppercase tracking-widest">
                    {t}
                  </span>
                ))}
              </div>

              {/* Show linked Super Admin info */}
              {admin && (
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <User className="w-3 h-3" />
                    <span className="font-semibold text-slate-700">{admin.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Mail className="w-3 h-3" />
                    <span>{admin.email}</span>
                  </div>
                </div>
              )}

              {/* Action buttons - always visible */}
              <div className="absolute top-4 right-4 flex gap-1">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 h-8 w-8" onClick={() => openEditDialog(inst)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8" onClick={() => handleDelete(inst.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
        {institutions.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-200 rounded-3xl">
            No institutions registered yet.
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) setShowEditPassword(false); }}>
        <DialogContent className="max-w-md sm:rounded-3xl border-slate-200 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-slate-800 tracking-tight">Edit Institution</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4 pt-4">
            {renderFormFields(editFormData, setEditFormData, true)}
            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">Update</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
