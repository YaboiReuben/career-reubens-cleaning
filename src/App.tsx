import React, { useState, useEffect } from 'react';
import { SprayCan, Menu, X, Lock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Careers from './pages/Careers';

// Types
type AppStatus = 'open' | 'closing-soon' | 'closed';

export default function App() {
  const [appStatus, setAppStatus] = useState<AppStatus>('open');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch initial status
  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setAppStatus(data.status));
  }, []);

  // Fetch submissions if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/submissions')
        .then(res => res.json())
        .then(data => setSubmissions(data));
    }
  }, [isAuthenticated]);

  const handleLogoClick = () => {
    setLogoClicks(prev => {
      const newCount = prev + 1;
      if (newCount === 3) {
        setIsAdminOpen(true);
        return 0;
      }
      return newCount;
    });
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'reuben2026@!?') {
      setIsAuthenticated(true);
      setPasswordInput('');
    } else {
      alert('Incorrect password');
    }
  };

  const updateStatus = async (status: AppStatus) => {
    await fetch('/api/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    setAppStatus(status);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
        <ScrollToTop />
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <div 
                className="flex items-center gap-3 cursor-pointer select-none"
                onClick={handleLogoClick}
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <SprayCan size={24} />
                </div>
                <Link to="/" className="font-bold text-xl tracking-tight text-slate-900">
                  Reuben's <span className="text-blue-600">Cleaning</span>
                </Link>
              </div>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600">
                <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                <a href="/#services" className="hover:text-blue-600 transition-colors">Services</a>
                <a href="/#about" className="hover:text-blue-600 transition-colors">About Us</a>
                <a href="https://supportreubenscleaning.pages.dev" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">Contact</a>
                <Link 
                  to="/careers" 
                  className="bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                  Careers
                </Link>
              </nav>

              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 text-slate-600"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
              >
                <div className="px-4 py-4 flex flex-col gap-4">
                  <Link to="/" onClick={() => setIsMenuOpen(false)} className="font-medium text-slate-600">Home</Link>
                  <a href="/#services" onClick={() => setIsMenuOpen(false)} className="font-medium text-slate-600">Services</a>
                  <a href="/#about" onClick={() => setIsMenuOpen(false)} className="font-medium text-slate-600">About Us</a>
                  <Link to="/careers" onClick={() => setIsMenuOpen(false)} className="font-medium text-slate-600">Careers</Link>
                  <a href="https://supportreubenscleaning.pages.dev" target="_blank" rel="noopener noreferrer" className="font-medium text-slate-600">Contact</a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Admin Modal */}
        <AnimatePresence>
          {isAdminOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Lock className="w-5 h-5 text-blue-600" />
                    Admin Panel
                  </h2>
                  <button onClick={() => setIsAdminOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X />
                  </button>
                </div>

                <div className="p-6">
                  {!isAuthenticated ? (
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input 
                          type="password" 
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="Enter admin password"
                        />
                      </div>
                      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Unlock
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-8">
                      {/* Status Toggle */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-slate-900">Application Status</h3>
                        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                          {(['open', 'closing-soon', 'closed'] as const).map((status) => (
                            <button
                              key={status}
                              onClick={() => updateStatus(status)}
                              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                                appStatus === status 
                                  ? 'bg-white text-blue-600 shadow-sm' 
                                  : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              {status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Submissions List */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-slate-900">Recent Submissions</h3>
                        <div className="max-h-[400px] overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
                          {submissions.length === 0 ? (
                            <div className="p-4 text-center text-slate-500 text-sm">No submissions yet</div>
                          ) : (
                            submissions.map((sub) => (
                              <SubmissionItem key={sub.id} sub={sub} />
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/careers" element={<Careers appStatus={appStatus} />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4 text-white">
                  <SprayCan size={20} />
                  <span className="font-bold text-lg">Reuben's Cleaning</span>
                </div>
                <p className="text-sm leading-relaxed">
                  The leading employer for professional cleaners in Albury-Wodonga. 
                  Join a team that values quality and reliability.
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Recruitment</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/careers" className="hover:text-white">Apply Now</Link></li>
                  <li><a href="/#about" className="hover:text-white">Why Join Us</a></li>
                  <li><a href="https://supportreubenscleaning.pages.dev" className="hover:text-white">HR Support</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white">Terms of Employment</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-8 text-center text-xs">
              © {new Date().getFullYear()} Reuben's Cleaning Service. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

interface SubmissionItemProps {
  sub: any;
  key?: React.Key;
}

function SubmissionItem({ sub }: SubmissionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-4 hover:bg-slate-50 transition-colors">
      <div 
        className="flex justify-between items-start cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900">{sub.fullName}</span>
            {isExpanded ? <ChevronRight className="w-4 h-4 rotate-90 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </div>
          <div className="text-sm text-slate-600 mt-1">{sub.phone} • {sub.email}</div>
        </div>
        <span className="text-xs text-slate-400">{new Date(sub.createdAt).toLocaleDateString()}</span>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-4 border-t border-slate-100 space-y-4 text-sm text-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block font-medium text-slate-900 text-xs uppercase tracking-wider mb-1">Location</span>
                  {sub.suburb}
                </div>
                <div>
                  <span className="block font-medium text-slate-900 text-xs uppercase tracking-wider mb-1">Legal Work</span>
                  {sub.legalWork}
                </div>
                <div>
                  <span className="block font-medium text-slate-900 text-xs uppercase tracking-wider mb-1">Availability</span>
                  {sub.availabilityDays} ({sub.availabilityHours})
                </div>
                <div>
                  <span className="block font-medium text-slate-900 text-xs uppercase tracking-wider mb-1">Weekends</span>
                  {sub.weekendShifts}
                </div>
              </div>

              <div>
                <span className="block font-medium text-slate-900 text-xs uppercase tracking-wider mb-1">Experience</span>
                <p className="bg-slate-50 p-2 rounded border border-slate-100">{sub.experience}</p>
              </div>

              <div>
                <span className="block font-medium text-slate-900 text-xs uppercase tracking-wider mb-1">Last Jobs</span>
                <p className="bg-slate-50 p-2 rounded border border-slate-100">{sub.lastJobs}</p>
              </div>

              <div>
                <span className="block font-medium text-slate-900 text-xs uppercase tracking-wider mb-1">Why Fit?</span>
                <p className="bg-slate-50 p-2 rounded border border-slate-100">{sub.whyFit}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
