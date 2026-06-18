import React, { useState, useEffect, useRef } from 'react';
import { ScanLine, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Student } from '../types';

type ScanState = 'waiting' | 'success' | 'error';

export default function AttendanceScanner() {
  const [scanState, setScanState] = useState<ScanState>('waiting');
  const [scannedStudent, setScannedStudent] = useState<Student | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

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
        const res = await fetch('/api/rfid/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rfidUid }),
        });
        const data = await res.json();
        
        if (data.success) {
          setScannedStudent(data.student);
          setScanState('success');
          // Speak success (if enabled in enterprise settings)
          const msg = new SpeechSynthesisUtterance(`Attendance marked for ${data.student.name}`);
          window.speechSynthesis.speak(msg);
        } else {
          setErrorMessage(data.error || 'RFID Not Found');
          setScanState('error');
        }

        // Reset to waiting after a delay
        setTimeout(() => {
          setScanState('waiting');
          setScannedStudent(null);
          setErrorMessage('');
        }, 4000);
      } catch (err) {
        console.error(err);
      }
    }
  };

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
              <span className={`w-2 h-2 rounded-full ${scanState === 'waiting' ? 'bg-indigo-500' : scanState === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
              Live Terminal #04
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
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
                  <div className="relative flex-shrink-0">
                    <div className="w-32 h-32 rounded-2xl bg-white border border-emerald-200 shadow-sm overflow-hidden flex items-center justify-center">
                      {scannedStudent.photoUrl ? (
                        <img src={scannedStudent.photoUrl} alt="Student" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-4xl font-bold">
                          {scannedStudent.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-2 border-2 border-emerald-50 shadow-sm">
                      <Check className="w-5 h-5" strokeWidth={3} />
                    </div>
                  </div>

                  <div className="flex-1 space-y-1 w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 sm:gap-0">
                      <div>
                        <p className="text-emerald-700 text-xs font-bold uppercase tracking-widest mb-1">Attendance Marked</p>
                        <h3 className="text-2xl font-bold text-slate-900">{scannedStudent.name}</h3>
                      </div>
                      <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-emerald-600 border border-emerald-100">
                        {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6 text-left border-t border-emerald-100 pt-4">
                      <div>
                        <p className="text-xs text-slate-400">Roll Number</p>
                        <p className="text-sm font-semibold text-slate-800">{scannedStudent.rollNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Department</p>
                        <p className="text-sm font-semibold text-slate-800">{scannedStudent.department}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Registration</p>
                        <p className="text-sm font-semibold text-slate-800">{scannedStudent.registrationNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">RFID UID</p>
                        <p className="text-sm font-mono text-slate-500 uppercase">{scannedStudent.rfidUid}</p>
                      </div>
                    </div>
                  </div>
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

          {(scanState === 'success' || scanState === 'error') && (
            <div className="mt-8 text-center py-4 border-2 border-dashed border-slate-100 rounded-xl">
              <p className="text-slate-400 text-sm">Processing next tap...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
