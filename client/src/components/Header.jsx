import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Home, BarChart2, Grid, Gamepad, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();



  const handleLogout = async () => {
    try {
      const response = await axios.post(`${API_URL}/user/logout`, {}, {
        withCredentials: true
      });

      if (response.status === 200) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      } else {
        console.error('Logout failed:', response.data);
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Network error during logout. Please try again.');
    }
  };

  const menuItems = [
    { name: "Home", path: "/home", icon: <Home size={20} /> },
    { name: "Games", path: "/games", icon: <Gamepad size={20} /> },
    { name: "Top Charts", path: "/top-charts", icon: <BarChart2 size={20} /> },
  ];

  // Control body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Main Header */}
      <div className={`${theme.backgroundSecondary} backdrop-blur-md shadow-lg border-b ${theme.border}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer shrink-0"
              onClick={() => navigate('/home')}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="-50 -50 100 100">
                  <defs>
                    <linearGradient id="cosmic1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#06c1ff' }} />
                      <stop offset="100%" style={{ stopColor: '#0b8fd8' }} />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <circle cx="0" cy="0" r="50" fill="url(#cosmic1)" filter="url(#glow)"/>
                  <path d="M 0 0 Q 15 -15 25 0 Q 15 25 -10 15 Q -25 -5 -15 -20 Q 5 -25 20 -10" 
                        fill="none" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                  <circle cx="0" cy="0" r="4" fill="white"/>
                  <circle cx="18" cy="-8" r="2" fill="white"/>
                  <circle cx="-12" cy="10" r="2" fill="white"/>
                </svg>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-[#06c1ff] to-[#0b8fd8] bg-clip-text text-transparent">
                Khelzy
              </span>
            </div>

    

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <div className="hidden md:block">
                <ThemeToggle />
              </div>

              {/* Hamburger Menu Button */}
              <button
                className={`p-2 hover:bg-[#06c1ff]/5 rounded-lg ${theme.secondary} hover:${theme.primary} transition-colors`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed top-20 right-0 bottom-0 w-72 ${theme.backgroundSecondary} shadow-xl z-50 transform transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-4">

          {/* Mobile Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 ${theme.secondary} hover:${theme.primary} hover:bg-[#06c1ff]/5 rounded-lg text-sm font-medium transition-colors`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          
          {/* Mobile Auth Button */}
          
            <button
              onClick={handleLogout}
              className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-[#06c1ff] to-[#0b8fd8] text-[#0b2d72] rounded-lg text-sm font-medium shadow-md hover:shadow-lg hover:shadow-[#06c1ff]/20 transition-all"
            >
              Logout
            </button>
          
        </div>
      </div>
    </header>
  );
};

export default Header;