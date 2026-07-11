import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, FileText, Zap, Calendar, BarChart3, Pen, Sparkles, Image, Settings, LogOut, Menu, X, ChevronDown
} from 'lucide-react';
import { useBrand } from './BrandContext';
import { useAuth } from './AuthContext';
import Logo from './Logo';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: Home },
  { label: 'Create', path: '/content', icon: FileText },
  { label: 'Campaigns', path: '/campaigns', icon: Zap },
  { label: 'Calendar', path: '/calendar', icon: Calendar },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'PR Writer', path: '/pr', icon: Pen },
  { label: 'Creative Studio', path: '/creative', icon: Sparkles },
  { label: 'Image Gallery', path: '/creative/gallery', icon: Image },
  { label: 'Brand', path: '/brand', icon: Settings },
  { label: 'Settings', path: '/settings', icon: Settings }
];

const MOBILE_NAV_ITEMS = [
  { label: 'Home', path: '/dashboard', icon: Home },
  { label: 'Create', path: '/content', icon: FileText },
  { label: 'Calendar', path: '/calendar', icon: Calendar },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'More', path: '/more', icon: Menu }
];

export default function AppShell({ children, pageTitle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { brandList, selectedBrandId, setSelectedBrandId } = useBrand();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBrandChange = (e) => {
    setSelectedBrandId(e.target.value);
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-[240px] lg:bg-[#0a0a0a] lg:border-r lg:border-[#1a1a1a] lg:flex lg:flex-col lg:z-50">
        {/* Logo */}
        <div className="p-6 border-b border-[#1a1a1a]">
          <Logo size="md" />
        </div>

        {/* Brand Switcher */}
        {brandList.length > 1 && (
          <div className="px-4 py-3 border-b border-[#1a1a1a]">
            <select
              value={selectedBrandId || ''}
              onChange={handleBrandChange}
              className="w-full bg-[#111111] border border-[#1a1a1a] rounded px-3 py-2 text-sm text-white"
            >
              {brandList.map(brand => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? 'text-[#BFFF00] bg-[#111111]'
                    : 'text-[#888] hover:text-white hover:bg-[#111111]'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-[#1a1a1a]">
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-lg p-3 space-y-3">
            <div>
              <p className="text-sm text-[#888]">Logged in as</p>
              <p className="font-medium text-white truncate">{user?.name || user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded text-sm font-medium transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Main Content */}
      <div className="hidden lg:block lg:ml-[240px]">
        {/* Top Bar */}
        <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] px-8 py-4 flex items-center justify-between z-40">
          <h1 className="text-2xl font-bold">{pageTitle || 'Dashboard'}</h1>
          <button
            onClick={() => navigate('/content')}
            className="bg-[#BFFF00] hover:bg-[#a8e600] text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            + New Content
          </button>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-8 py-6">
          {children}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden pb-20">
        {/* Mobile Header */}
        <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] px-4 py-4 flex items-center justify-between z-40">
          <Logo size="sm" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-[#111111] rounded"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Brand Switcher */}
        {brandList.length > 1 && (
          <div className="px-4 py-3 border-b border-[#1a1a1a]">
            <select
              value={selectedBrandId || ''}
              onChange={handleBrandChange}
              className="w-full bg-[#111111] border border-[#1a1a1a] rounded px-3 py-2 text-sm text-white"
            >
              {brandList.map(brand => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Mobile Content */}
        <div className="px-4 py-4">
          {children}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-[#1a1a1a] flex items-center justify-around h-20 z-50">
        {MOBILE_NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                active ? 'text-[#BFFF00]' : 'text-[#666] hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
