import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ScanLine, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deviceName, setDeviceName] = useState('Scanner-' + Math.floor(Math.random() * 1000));
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, deviceName })
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.user);
        toast.success(`Welcome back, ${data.user.name}`);
      } else {
        toast.error(data.error || 'Invalid credentials');
      }
    } catch (err) {
      toast.error('Network error during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white mb-4">
              <ScanLine className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 text-center">Sign in to GOTEK RFID</h1>
            <p className="text-sm text-slate-500 mt-2 text-center">Manage your campus attendance and RFID systems.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs uppercase tracking-widest text-slate-500 font-bold">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@institution.edu" 
                className="bg-slate-50 rounded-lg border-slate-200 h-10" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs uppercase tracking-widest text-slate-500 font-bold">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="bg-slate-50 rounded-lg border-slate-200 h-10" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deviceName" className="text-xs uppercase tracking-widest text-slate-500 font-bold">Device Name (Kiosks)</Label>
              <Input 
                id="deviceName" 
                type="text" 
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="Scanner-1" 
                className="bg-slate-50 rounded-lg border-slate-200 h-10" 
              />
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 shadow-sm font-bold mt-4" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-center text-slate-500 font-bold tracking-widest uppercase mb-4">Quick Demo Login</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'IT Support (Ultra)', email: 'itsupport@technosprint.net' },
                { label: 'Global Tech (Super)', email: 'superadmin@globaltech.edu' },
                { label: 'Springfield (Super)', email: 'superadmin@springfield.edu' },
                { label: 'Branch Admin', email: 'admin@demo.com' },
                { label: 'Kiosk (Scanner)', email: 'kiosk@demo.com' }
              ].map(demo => (
                <Button 
                  key={demo.email} 
                  type="button" 
                  variant="outline" 
                  className="text-xs h-9 bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 font-medium"
                  onClick={() => {
                    setEmail(demo.email);
                    setPassword('admin@123');
                    toast.info(`Credentials filled for ${demo.label}`);
                  }}
                >
                  {demo.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">
          &copy; {new Date().getFullYear()} Techno Sprint RFID Solutions
        </p>
      </div>
    </div>
  );
}
