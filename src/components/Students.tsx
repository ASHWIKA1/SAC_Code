import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Download, Upload, Plus, Search, MoreHorizontal, Loader2 } from 'lucide-react';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [photoFiles, setPhotoFiles] = useState<FileList | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [assignRfid, setAssignRfid] = useState('');

  // Settings & Import State
  const [savedColumns, setSavedColumns] = useState<{ columns: string[], photoColumn: string } | null>(null);
  const [importStep, setImportStep] = useState<1 | 2>(1);
  const [excelHeaders, setExcelHeaders] = useState<string[]>([]);
  const [rawExcelData, setRawExcelData] = useState<any[]>([]);
  
  // Mapping selections for first time
  const [selectedHeaders, setSelectedHeaders] = useState<string[]>([]);
  const [photoColumn, setPhotoColumn] = useState<string>('');

  const getBranchQuery = () => {
    try {
      const userObj = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (userObj.role === 'Admin' && userObj.branchId) return `?branchId=${userObj.branchId}`;
    } catch(e) {}
    return '';
  };

  const getBranchId = () => {
    try {
      const userObj = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (userObj.role === 'Admin') return userObj.branchId;
    } catch(e) {}
    return undefined;
  };

  const fetchStudents = () => {
    fetch(`/api/students${getBranchQuery()}`)
      .then(res => res.json())
      .then(setStudents);
  };

  const fetchSettings = () => {
    fetch(`/api/settings/columns${getBranchQuery()}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.columns) {
          setSavedColumns(data);
        }
      });
  };

  useEffect(() => {
    fetchSettings();
    fetchStudents();
  }, []);

  const handleExport = async () => {
    const { utils, writeFile } = await import('xlsx');
    const exportData = students.map(s => {
      const row: any = {};
      if (savedColumns) {
        savedColumns.columns.forEach(col => {
          row[col] = s[col] || '';
        });
      }
      row['RFID Assigned'] = s.rfidUid ? 'Yes' : 'No';
      return row;
    });
    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Students");
    writeFile(wb, "Students_Export.xlsx");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await fetch(`/api/students/${id}`, { method: 'DELETE' });
      toast.success("Student deleted successfully");
      fetchStudents();
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    try {
      const res = await fetch(`/api/students/${selectedStudent.id}/rfid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rfidUid: assignRfid })
      });
      if (res.ok) {
        toast.success("RFID assigned successfully");
        setIsAssignOpen(false);
        setAssignRfid('');
        fetchStudents();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to assign RFID");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const branchId = getBranchId();
    if (branchId) data.branchId = branchId;

    await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    setIsAddOpen(false);
    fetchStudents();
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedStudent) return;
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const branchId = getBranchId();
    if (branchId) data.branchId = branchId;

    try {
      const res = await fetch(`/api/students/${selectedStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Student updated successfully");
        setIsEditOpen(false);
        fetchStudents();
      } else {
        toast.error("Failed to update student");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const handleFileLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExcelFile(file);
    const { read, utils } = await import('xlsx');
    const data = await file.arrayBuffer();
    const workbook = read(data);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = utils.sheet_to_json(firstSheet, { header: 1 });
    if (rows.length > 0) {
      const headers = rows[0] as string[];
      setExcelHeaders(headers);
      setRawExcelData(utils.sheet_to_json(firstSheet));
      
      if (savedColumns) {
        // Auto process if already configured
      } else {
        setSelectedHeaders(headers); // default select all
        // Try to guess photo column
        const guess = headers.find(h => h.toLowerCase().includes('photo') || h.toLowerCase().includes('image') || h.toLowerCase().includes('pic'));
        if (guess) setPhotoColumn(guess);
      }
    }
  };

  const processImport = async (cols: string[], photoCol: string, data: any[]) => {
    setIsImporting(true);
    try {
      const branchId = getBranchId();
      if (!savedColumns) {
        await fetch('/api/settings/columns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ columns: cols, photoColumn: photoCol, branchId })
        });
        setSavedColumns({ columns: cols, photoColumn: photoCol });
      }

      const photosArray = photoFiles ? Array.from(photoFiles) as File[] : [];
      
      for (const row of data) {
        const photoNumberStr = photoCol ? String(row[photoCol] || '') : '';
        let photoUrl = '';
        if (photoNumberStr) {
          const matchedPhoto = photosArray.find(p => p.name.startsWith(photoNumberStr + '.') || p.name === photoNumberStr);
          if (matchedPhoto) {
            const formData = new FormData();
            formData.append('photo', matchedPhoto);
            try {
              const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
              const uploadData = await uploadRes.json();
              if (uploadData.url) photoUrl = uploadData.url;
            } catch (err) {
              console.error('Failed to upload photo for', photoNumberStr);
            }
          }
        }

        const studentData: any = { photoUrl };
        if (branchId) studentData.branchId = branchId;
        cols.forEach(c => {
          studentData[c] = row[c] || '';
        });

        await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData),
        });
      }

      setIsAddOpen(false);
      setExcelFile(null);
      setPhotoFiles(null);
      setImportStep(1);
      setRawExcelData([]);
      fetchStudents();
      toast.success("Import completed!");
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import students. Please check the Excel format.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (importStep === 1 && excelHeaders.length > 0) {
      if (savedColumns) {
        // Skip straight to import
        await processImport(savedColumns.columns, savedColumns.photoColumn, rawExcelData);
      } else {
        setImportStep(2);
      }
      return;
    }

    if (importStep === 2) {
      await processImport(selectedHeaders, photoColumn, rawExcelData);
    }
  };

  const filteredStudents = students.filter(s => 
    Object.values(s).some(val => 
      typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Directory</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage student and staff directory and RFID assignments.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="rounded-lg h-9" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2 text-slate-500" />
            Export
          </Button>
          
          <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) setImportStep(1); }}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-9 shadow-sm border-none">
                <Plus className="w-4 h-4 mr-2" />
                Add Members
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md sm:rounded-2xl border-slate-200">
              <DialogHeader>
                <DialogTitle className="text-slate-800 tracking-tight">Add New Students</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="bulk" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-2 p-1 bg-slate-100 rounded-lg">
                  <TabsTrigger value="manual" className="rounded-md">Manual Entry</TabsTrigger>
                  <TabsTrigger value="bulk" className="rounded-md">Bulk Import</TabsTrigger>
                </TabsList>
                
                <TabsContent value="manual">
                  <form onSubmit={handleAddSubmit} className="space-y-4 py-2 mt-2">
                    {savedColumns ? (
                      <>
                        <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                          <div className="space-y-1.5 col-span-2">
                            <Label htmlFor="memberType" className="text-xs uppercase tracking-widest text-slate-500 font-bold">Member Type</Label>
                            <Select name="memberType" defaultValue="Student">
                              <SelectTrigger className="bg-slate-50 rounded-lg border-slate-200 h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Student">Student</SelectItem>
                                <SelectItem value="Staff">Staff</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {savedColumns.columns.map(col => (
                            <div key={col} className="space-y-1.5">
                              <Label htmlFor={col} className="text-xs uppercase tracking-widest text-slate-500 font-bold">{col}</Label>
                              <Input id={col} name={col} className="bg-slate-50 rounded-lg border-slate-200 h-9" />
                            </div>
                          ))}
                        </div>
                        <div className="pt-4 flex justify-end gap-3">
                          <Button type="button" variant="ghost" className="rounded-lg h-9" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-9">Save Member</Button>
                        </div>
                      </>
                    ) : (
                      <div className="p-4 border border-slate-200 rounded-xl text-sm text-slate-500 bg-slate-50">
                        Please perform a bulk import first to configure the student fields.
                      </div>
                    )}
                  </form>
                </TabsContent>

                <TabsContent value="bulk">
                  <form onSubmit={handleBulkSubmit} className="space-y-4 py-2 mt-2">
                    {importStep === 1 && (
                      <div className="space-y-4">
                        <div className="border border-indigo-100 bg-indigo-50/50 p-4 rounded-xl text-sm text-indigo-800">
                          {savedColumns 
                            ? "Upload an Excel file. The system will automatically use your previously saved column configurations."
                            : "Upload your Excel file. Since this is your first time, you will select which columns to import in the next step."}
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-slate-700">1. Upload Excel File</Label>
                          <Input 
                            type="file" 
                            accept=".xlsx,.xls,.csv" 
                            onChange={handleFileLoad}
                            className="bg-slate-50 border-slate-200 text-slate-600 rounded-xl file:bg-indigo-100 file:border-none file:text-indigo-700 file:font-semibold file:cursor-pointer file:px-4 file:h-full file:mr-4 file:rounded-xl cursor-pointer" 
                            required 
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-slate-700">2. Upload Processed Photos</Label>
                          <Input 
                            type="file" 
                            multiple
                            accept="image/*"
                            onChange={(e) => setPhotoFiles(e.target.files)}
                            className="bg-slate-50 border-slate-200 text-slate-600 rounded-xl file:bg-indigo-100 file:border-none file:text-indigo-700 file:font-semibold file:cursor-pointer file:px-4 file:h-full file:mr-4 file:rounded-xl cursor-pointer" 
                          />
                        </div>
                      </div>
                    )}

                    {importStep === 2 && !savedColumns && (
                      <div className="space-y-4">
                        <div className="border border-indigo-100 bg-indigo-50/50 p-4 rounded-xl text-sm text-indigo-800">
                          Select which Excel columns you want to import and show in the application. This configuration will be saved for future imports.
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Which column contains the Photo Number?</Label>
                          <Select value={photoColumn} onValueChange={setPhotoColumn}>
                            <SelectTrigger className="bg-slate-50 border-slate-200 h-9">
                              <SelectValue placeholder="Select photo column" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ignore" className="text-slate-400 italic">-- No photos --</SelectItem>
                              {excelHeaders.map(h => (
                                <SelectItem key={h} value={h}>{h}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-widest text-slate-500 font-bold">Select Columns to Import</Label>
                          <div className="grid grid-cols-2 gap-3 max-h-[200px] overflow-y-auto p-2 border border-slate-100 rounded-lg bg-slate-50">
                            {excelHeaders.map(h => (
                              <div key={h} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`chk-${h}`} 
                                  checked={selectedHeaders.includes(h)} 
                                  onCheckedChange={(checked) => {
                                    if (checked) setSelectedHeaders([...selectedHeaders, h]);
                                    else setSelectedHeaders(selectedHeaders.filter(x => x !== h));
                                  }}
                                />
                                <label htmlFor={`chk-${h}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                  {h}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                      {importStep === 2 && !savedColumns && (
                        <Button type="button" variant="outline" className="rounded-lg h-9" onClick={() => setImportStep(1)}>Back</Button>
                      )}
                      <Button type="button" variant="ghost" className="rounded-lg h-9" onClick={() => { setIsAddOpen(false); setImportStep(1); }}>Cancel</Button>
                      <Button type="submit" disabled={isImporting || !excelFile} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-9">
                        {isImporting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Importing...
                          </>
                        ) : (importStep === 1 && !savedColumns) ? 'Next: Map Columns' : 'Import Students'}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>

        </div>
      </div>

      <div className="bg-white border flex flex-col border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-white">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-50 border-none rounded-xl focus-visible:ring-indigo-500 h-10"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {savedColumns ? (
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold w-12 text-center">Photo</th>
                  <th className="px-6 py-4 font-bold">Type</th>
                  {savedColumns.columns.map(col => (
                    <th key={col} className="px-6 py-4 font-bold">{col}</th>
                  ))}
                  <th className="px-6 py-4 font-bold text-center">RFID Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-center">
                      {student.photoUrl ? (
                        <div className="h-10 w-10 border-2 border-white shadow-sm rounded-full bg-slate-100 overflow-hidden inline-block">
                          <img src={student.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 border-2 border-white shadow-sm rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-500 text-sm inline-flex">
                          ?
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${student.memberType === 'Staff' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                        {student.memberType || 'Student'}
                      </span>
                    </td>

                    {savedColumns.columns.map(col => (
                      <td key={col} className="px-6 py-4 text-slate-700">
                        {student[col] || '-'}
                      </td>
                    ))}

                    <td className="px-6 py-4 text-center">
                      {student.rfidUid ? (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 font-bold border-emerald-100/50 uppercase tracking-widest text-[9px] px-2 py-0.5">
                          Assigned
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-slate-100 text-slate-400 font-bold uppercase tracking-widest text-[9px] px-2 py-0.5 hover:bg-slate-100/80">
                          Unassigned
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-slate-200">
                          <div className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</div>
                          <DropdownMenuItem className="text-xs font-medium cursor-pointer rounded-lg" onClick={() => { setSelectedStudent(student); setIsViewProfileOpen(true); }}>View Profile</DropdownMenuItem>
                          <DropdownMenuItem className="text-xs font-medium cursor-pointer rounded-lg" onClick={() => { setSelectedStudent(student); setIsEditOpen(true); }}>Edit Data</DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-100" />
                          <DropdownMenuItem className="text-indigo-600 font-bold text-xs cursor-pointer rounded-lg" onClick={() => { setSelectedStudent(student); setIsAssignOpen(true); setAssignRfid(''); }}>
                            {student.rfidUid ? 'Replace RFID Card' : 'Assign RFID Card'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-100" />
                          <DropdownMenuItem className="text-rose-600 font-bold text-xs cursor-pointer rounded-lg" onClick={() => handleDelete(student.id)}>Delete Student</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={savedColumns.columns.length + 3} className="px-6 py-12 text-center text-slate-400 text-sm">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Upload className="text-slate-400 w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-slate-800">No Data Configured</h3>
              <p className="text-slate-500 max-w-sm mt-2 text-sm">
                Please add students via Bulk Import to initialize the database columns.
              </p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="max-w-md sm:rounded-2xl border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-slate-800 tracking-tight">
              {selectedStudent?.rfidUid ? 'Replace' : 'Assign'} RFID Card
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-500 mb-4">
              Enter the new RFID UID for this student.
            </p>
            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rfid" className="text-xs uppercase tracking-widest text-slate-500 font-bold">RFID UID</Label>
                <Input 
                  id="rfid" 
                  value={assignRfid} 
                  onChange={(e) => setAssignRfid(e.target.value)} 
                  placeholder="e.g. 1A:2B:3C:4D" 
                  className="bg-slate-50 rounded-lg border-slate-200 h-9" 
                  autoFocus
                  required 
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setIsAssignOpen(false)} className="rounded-lg h-9">Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-9">Save Card</Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewProfileOpen} onOpenChange={setIsViewProfileOpen}>
        <DialogContent className="max-w-md sm:rounded-2xl border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-slate-800 tracking-tight">Student Profile</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                {selectedStudent.photoUrl ? (
                  <img src={selectedStudent.photoUrl} alt="Photo" className="w-16 h-16 rounded-full object-cover shadow-sm border border-slate-200" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center font-bold text-indigo-500 text-xl border border-indigo-100">
                    ?
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg text-slate-800">Student Details</h3>
                  <p className="text-sm text-slate-500">{selectedStudent.rfidUid || 'No RFID Assigned'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                {savedColumns?.columns.map(col => (
                  <div key={col}>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{col}</span>
                    <span className="font-medium text-slate-700">{selectedStudent[col] || '-'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md sm:rounded-2xl border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-slate-800 tracking-tight">Edit Student Data</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <form onSubmit={handleEditSubmit} className="space-y-4 py-2 mt-2">
              <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                <div className="space-y-1.5 col-span-2">
                  <Label htmlFor="edit-memberType" className="text-xs uppercase tracking-widest text-slate-500 font-bold">Member Type</Label>
                  <Select name="memberType" defaultValue={selectedStudent.memberType || 'Student'}>
                    <SelectTrigger className="bg-slate-50 rounded-lg border-slate-200 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {savedColumns?.columns.map(col => (
                  <div key={col} className="space-y-1.5">
                    <Label htmlFor={`edit-${col}`} className="text-xs uppercase tracking-widest text-slate-500 font-bold">{col}</Label>
                    <Input id={`edit-${col}`} name={col} defaultValue={selectedStudent[col]} className="bg-slate-50 rounded-lg border-slate-200 h-9" />
                  </div>
                ))}
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="ghost" className="rounded-lg h-9" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-9">Update Member</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
