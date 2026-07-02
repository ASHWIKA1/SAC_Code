import React, { useState, useEffect, useRef } from 'react';
import { ScanLine, Check, AlertCircle, AlertTriangle, LogOut, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Student } from '../types';

type ScanState = 'waiting' | 'success' | 'error' | 'warning';

export default function AttendanceScanner() {
  const [scanState, setScanState] = useState<ScanState>('waiting');
  const [scannedStudent, setScannedStudent] = useState<Student | null>(null);
  const [scannedLog, setScannedLog] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [kioskType, setKioskType] = useState('Combined');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const userObj = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (userObj.kioskType) {
        setKioskType(userObj.kioskType);
      }
    } catch(e) {}
  }, []);

  useEffect(() => {
    // Keep focus on the hidden input to capture scanner strokes
    const focusInput = () => {
      if (scanState === 'waiting') {
        inputRef.current?.focus();
      }
    };
    document.addEventListener('click', focusInput);
    focusInput();
    return () => document.removeEventListener('click', focusInput);
  }, [scanState]);

  const handleScan = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const rfidUid = e.currentTarget.value.trim();
      e.currentTarget.value = ''; // clear
      if (!rfidUid) return;

      try {
        let sessionId = undefined;
        let deviceName = undefined;
        try {
          const userObj = JSON.parse(localStorage.getItem('currentUser') || '{}');
          if (userObj.role === 'User') {
            sessionId = userObj.sessionId;
            deviceName = userObj.deviceName;
          }
        } catch(e) {}

        const res = await fetch('/api/rfid/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rfidUid, sessionId, deviceName, kioskType }),
        });
        const data = await res.json();
        
        if (data.success) {
          setScannedStudent(data.student);
          setScannedLog(data.log);
          setScanState('success');
          // Speak success
          const sName = data.student.name || data.student.Name || data.student['Student Name'] || 'Student';
          const action = data.log.type === 'EXIT' ? 'Exit recorded for' : 'Attendance marked for';
          const msg = new SpeechSynthesisUtterance(`${action} ${sName}`);
          window.speechSynthesis.speak(msg);
        } else {
          setErrorMessage(data.error || 'RFID Not Found');
          if (res.status === 429) {
            setScanState('warning');
            const msg = new SpeechSynthesisUtterance(data.error);
            window.speechSynthesis.speak(msg);
          } else {
            setScanState('error');
          }
        }

        // Reset to waiting after a delay
        setTimeout(() => {
          setScanState('waiting');
          setScannedStudent(null);
          setScannedLog(null);
          setErrorMessage('');
        }, 4000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const studentName = scannedStudent?.name || scannedStudent?.Name || scannedStudent?.['Student Name'] || 'Unknown Member';
  const rollNumber = scannedStudent?.rollNumber || scannedStudent?.['Roll Number'] || scannedStudent?.RollNo || 'N/A';
  const department = scannedStudent?.department || scannedStudent?.Class || scannedStudent?.Department || 'N/A';
  const registration = scannedStudent?.registrationNumber || scannedStudent?.['AEM Unique ID'] || scannedStudent?.Registration || 'N/A';
  const isExit = scannedLog?.type === 'EXIT';

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-4xl mx-auto">
      {/* Hidden input for RFID reader keyboard wedge */}
      <input 
        ref={inputRef}
        type="text" 
        className="opacity-0 absolute -z-10" 
        onKeyDown={handleScan}
        autoFocus
        autoComplete="off"
      />
      
      <div className="w-full max-w-3xl flex flex-col gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <span className={`w-2 h-2 rounded-full ${scanState === 'waiting' ? 'bg-indigo-500' : scanState === 'success' ? (isExit ? 'bg-amber-500' : 'bg-emerald-500') : scanState === 'warning' ? 'bg-orange-500' : 'bg-rose-500'}`}></span>
              Live Terminal #04
              <span className="ml-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500">
                {kioskType} Mode
              </span>
            </h2>
            <span className="text-xs text-slate-400 font-mono tracking-widest">{scanState === 'waiting' ? 'SCANNER READY' : 'PROCESSING'}</span>
          </div>

          <AnimatePresence mode="wait">
            {scanState === 'waiting' && (
              <motion.div
                key="waiting"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl p-16 flex flex-col items-center justify-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="h-24 w-24 rounded-full bg-white shadow-sm flex items-center justify-center mb-6">
                      <ScanLine className="h-10 w-10 text-indigo-400" />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-medium text-slate-600">Waiting for RFID tap...</h3>
                </div>
              </motion.div>
            )}

            {scanState === 'success' && scannedStudent && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className={`${isExit ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'} border rounded-2xl p-6 flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left`}>
                  <div className="relative flex-shrink-0">
                    <div className={`w-32 h-32 rounded-2xl bg-white border ${isExit ? 'border-amber-200' : 'border-emerald-200'} shadow-sm overflow-hidden flex items-center justify-center`}>
                      {scannedStudent.photoUrl ? (
                        <img src={scannedStudent.photoUrl} alt="Member" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-4xl font-bold uppercase">
                          {studentName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className={`absolute -bottom-2 -right-2 ${isExit ? 'bg-amber-500' : 'bg-emerald-500'} text-white rounded-full p-2 border-2 ${isExit ? 'border-amber-50' : 'border-emerald-50'} shadow-sm`}>
                      {isExit ? <LogOut className="w-5 h-5" strokeWidth={3} /> : <LogIn className="w-5 h-5" strokeWidth={3} />}
                    </div>
                  </div>

                  <div className="flex-1 space-y-1 w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 sm:gap-0">
                      <div>
                        <p className={`${isExit ? 'text-amber-700' : 'text-emerald-700'} text-xs font-bold uppercase tracking-widest mb-1`}>
                          {isExit ? 'Exit Recorded' : 'Entry Marked'}
                        </p>
                        <h3 className="text-2xl font-bold text-slate-900">{studentName}</h3>
                        <p className="text-xs text-slate-500 mt-1 font-semibold uppercase">{scannedStudent.memberType}</p>
                      </div>
                      <span className={`bg-white px-3 py-1 rounded-full text-xs font-bold ${isExit ? 'text-amber-600 border-amber-100' : 'text-emerald-600 border-emerald-100'} border`}>
                        {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}
                      </span>
                    </div>
                    
                    <div className={`grid grid-cols-2 gap-4 mt-6 text-left border-t ${isExit ? 'border-amber-100' : 'border-emerald-100'} pt-4`}>
                      <div>
                        <p className="text-xs text-slate-400">RFID UID</p>
                        <p className="text-sm font-mono text-slate-500 uppercase">{scannedStudent.rfidUid}</p>
                      </div>
                      {Object.entries(scannedStudent)
                        .filter(([key]) => !['id', 'photoUrl', 'rfidUid', 'memberType', 'name', 'Name', 'Student Name', 'createdAt', 'updatedAt', 'branchId'].includes(key))
                        .map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-slate-400 uppercase tracking-widest">{key}</p>
                          <p className="text-sm font-semibold text-slate-800">{String(value || '-')}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {scanState === 'warning' && (
              <motion.div
                key="warning"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
              >
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-12 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 border border-orange-100">
                    <AlertTriangle className="h-10 w-10 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-orange-700 mb-2">{errorMessage}</h3>
                  <p className="text-orange-500 font-medium">Please wait before scanning again.</p>
                </div>
              </motion.div>
            )}

            {scanState === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
              >
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-12 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
                    <AlertCircle className="h-10 w-10 text-rose-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-rose-700 mb-2">{errorMessage}</h3>
                  <p className="text-rose-500">Please contact administration or try registering this card.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {scanState !== 'waiting' && (
            <div className="mt-8 text-center py-4 border-2 border-dashed border-slate-100 rounded-xl">
              <p className="text-slate-400 text-sm">Processing next tap...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
