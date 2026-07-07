import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { brands } from '../api';
import { Home, Plus, Calendar, BarChart3, MoreHorizontal, LogOut } from 'lucide-react';
import DashboardHome from './DashboardHome';
import ContentLibrary from './ContentLibrary';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState('home');
  const [brandList, setBrandList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadBrands();
  }, [user]);

  const loadBrands = async () => {
    try {
      const res = await brands.list();
      setBrandList(res.data);
    } catch (err) {
      console.error('Failed to load brands:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <DashboardHome />;
      case 'create':
        return <ContentLibrary />;
      case 'calendar':
        return (
          <div className="p-4">
            <h1 className="text-3xl font-bold mb-6">Content Calendar</h1>
            <div className="card text-center py-8">
              <p className="text-beheard-text-secondary">Calendar feature coming soon</p>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-4">
            <h1 className="text-3xl font-bold mb-6">Analytics</h1>
            <div className="card text-center py-8">
              <p className="text-beheard-text-secondary">Analytics feature coming soon</p>
            </div>
          </div>
        );
      case 'more':
        return (
          <div className="p-4">
            <h1 className="text-3xl font-bold mb-6">More</h1>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/settings')}
                className="btn-secondary w-full text-left"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="btn-secondary w-full text-left flex items-center gap-2 text-red-400"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-beheard-black pb-56px">
      {/* Main content */}
      <div className="max-w-2xl mx-auto">
        {renderPage()}
      </div>

      {/* Bottom navigation - Mobile first */}
      <div className="fixed bottom-0 left-0 right-0 bg-beheard-card border-t border-beheard-border">
        <div className="max-w-2xl mx-auto flex justify-around h-56px">
          <button
            onClick={() => setActivePage('home')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
              activePage === 'home' ? 'text-beheard-lime' : 'text-beheard-text-tertiary'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => setActivePage('create')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
              activePage === 'create' ? 'text-beheard-lime' : 'text-beheard-text-tertiary'
            }`}
          >
            <Plus className="w-6 h-6" />
            <span className="text-xs">Create</span>
          </button>
          <button
            onClick={() => setActivePage('calendar')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
              activePage === 'calendar' ? 'text-beheard-lime' : 'text-beheard-text-tertiary'
            }`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs">Calendar</span>
          </button>
          <button
            onClick={() => setActivePage('analytics')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
              activePage === 'analytics' ? 'text-beheard-lime' : 'text-beheard-text-tertiary'
            }`}
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs">Analytics</span>
          </button>
          <button
            onClick={() => setActivePage('more')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
              activePage === 'more' ? 'text-beheard-lime' : 'text-beheard-text-tertiary'
            }`}
          >
            <MoreHorizontal className="w-6 h-6" />
            <span className="text-xs">More</span>
          </button>
        </div>
      </div>
    </div>
  );
}
