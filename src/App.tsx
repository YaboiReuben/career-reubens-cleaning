import React, { useState, useEffect } from 'react';
import { SprayCan, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Careers from './pages/Careers';

// Types
type AppStatus = 'open' | 'closing-soon' | 'closed';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Default to open since admin panel is removed
  const appStatus: AppStatus = 'open';

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
        <ScrollToTop />
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <div className="flex items-center gap-3 select-none">
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
