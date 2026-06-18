import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  BarChart, Users, ScanLine, Settings, Menu, Bell,
  Search, Sun, Moon, LogOut, FileText
} from 'lucide-react';
import { useState } from 'react';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

import Dashboard from './components/Dashboard';
import Students from './components/Students';
import AttendanceScanner from './components/AttendanceScanner';
import Setup from './components/Setup';
import Reports from './components/Reports';
import Login from './components/Login';

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (user: any) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  if (!currentUser) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 overflow-hidden">
        {/* Sidebar */}
        <Sidebar currentUser={currentUser} onLogout={handleLogout} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0 hidden sm:flex">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Campus Overview</h1>
              <p className="text-xs text-slate-400">Institutional Portal &bull; Central Campus</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search Students..." 
                  className="w-64 pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      toast.info(`Searching for: ${e.currentTarget.value}`);
                    }
                  }}
                />
              </div>
              <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-indigo-600" onClick={() => toast.info('You have 0 new notifications')}>
                <Bell className="w-5 h-5" />
              </Button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-8 overflow-y-auto w-full max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/scan" element={<AttendanceScanner />} />
              <Route path="/settings" element={<Setup />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
      </div>
      <Toaster />
    </Router>
  );
}

function Sidebar({ currentUser, onLogout }: { currentUser: any, onLogout: () => void }) {
  const location = useLocation();
  const navigation = [
    { name: 'Dashboard', path: '/', icon: BarChart },
    { name: 'Attendance', path: '/scan', icon: ScanLine },
    { name: 'Students', path: '/students', icon: Users },
    { name: 'Reports', path: '/reports', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 hidden md:flex h-screen">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
          <ScanLine className="w-6 h-6 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight">GOTEK RFID</span>
      </div>
      
      <nav className="mt-4 flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-slate-100 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
            {currentUser?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-semibold truncate text-slate-900">{currentUser?.name || 'Jameson Miller'}</p>
            <p className="text-xs text-slate-500 truncate">{currentUser?.role || 'Super Admin'}</p>
          </div>
          <button className="text-slate-400 hover:text-red-600 transition-colors" onClick={onLogout}>
             <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
