import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { BrandProvider, useBrand } from './BrandContext';
import { BrandGate } from './BrandGate';
import AppShell from './AppShell';
import { Home, Plus, Calendar, BarChart3, Menu } from 'lucide-react';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';

// Main Pages
import DashboardHome from './pages/DashboardHome';
import CreateContent from './pages/CreateContent';
import ContentLibrary from './pages/ContentLibrary';
import ContentDetail from './pages/ContentDetail';
import SocialCalendar from './pages/SocialCalendar';
import CampaignsList from './pages/CampaignsList';
import CreateCampaign from './pages/CreateCampaign';
import CampaignDetail from './pages/CampaignDetail';
import CreatePR from './pages/CreatePR';
import PRLibrary from './pages/PRLibrary';
import CreativeStudio from './pages/CreativeStudio';
import CreativeGallery from './pages/CreativeGallery';
import Analytics from './pages/Analytics';
import BrandSettings from './pages/BrandSettings';
import UserSettings from './pages/UserSettings';

function ProtectedPageWrapper({ children, pageTitle }) {
  return (
    <AppShell pageTitle={pageTitle}>
      {children}
    </AppShell>
  );
}

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [createOpen, setCreateOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { selectedBrandId, brandList } = useBrand();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Plus, label: 'Create', action: () => setCreateOpen(true) },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Menu, label: 'More', action: () => setMoreOpen(true) }
  ];

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-[#1a1a1a] flex justify-around h-16 z-40">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => item.path ? navigate(item.path) : item.action?.()}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition ${
              item.path && isActive(item.path)
                ? 'text-[#BFFF00]'
                : 'text-[#666] hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Create Sheet */}
      {createOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-[#111111] border-t border-[#1a1a1a] rounded-t-lg p-4 space-y-2">
            <button
              onClick={() => { navigate('/content/new'); setCreateOpen(false); }}
              className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold py-3 rounded"
            >
              Post
            </button>
            <button
              onClick={() => { navigate('/campaigns/new'); setCreateOpen(false); }}
              className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold py-3 rounded"
            >
              Campaign
            </button>
            <button
              onClick={() => { navigate('/pr/new'); setCreateOpen(false); }}
              className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold py-3 rounded"
            >
              PR
            </button>
            <button
              onClick={() => { navigate('/creative'); setCreateOpen(false); }}
              className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold py-3 rounded"
            >
              Image
            </button>
            <button
              onClick={() => setCreateOpen(false)}
              className="w-full bg-[#BFFF00] text-black font-semibold py-3 rounded hover:bg-[#a8e600]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* More Sheet */}
      {moreOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-[#111111] border-t border-[#1a1a1a] rounded-t-lg p-4 space-y-2">
            <button
              onClick={() => { navigate('/content'); setMoreOpen(false); }}
              className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold py-3 rounded text-left px-4"
            >
              Content Library
            </button>
            <button
              onClick={() => { navigate('/campaigns'); setMoreOpen(false); }}
              className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold py-3 rounded text-left px-4"
            >
              Campaigns
            </button>
            <button
              onClick={() => { navigate('/pr'); setMoreOpen(false); }}
              className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold py-3 rounded text-left px-4"
            >
              PR Library
            </button>
            <button
              onClick={() => { navigate('/creative'); setMoreOpen(false); }}
              className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold py-3 rounded text-left px-4"
            >
              Creative Studio
            </button>
            <button
              onClick={() => { navigate('/creative/gallery'); setMoreOpen(false); }}
              className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold py-3 rounded text-left px-4"
            >
              Image Gallery
            </button>
            <button
              onClick={() => { if (selectedBrandId) navigate('/brand/' + selectedBrandId); setMoreOpen(false); }}
              disabled={!selectedBrandId || brandList.length === 0}
              className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold py-3 rounded text-left px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Brand Settings
            </button>
            <button
              onClick={() => { navigate('/settings'); setMoreOpen(false); }}
              className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-semibold py-3 rounded text-left px-4"
            >
              Settings
            </button>
            <button
              onClick={() => setMoreOpen(false)}
              className="w-full bg-[#BFFF00] text-black font-semibold py-3 rounded hover:bg-[#a8e600]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function ProtectedRoute({ children, pageTitle }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <BrandGate>
      <ProtectedPageWrapper pageTitle={pageTitle}>
        {children}
      </ProtectedPageWrapper>
    </BrandGate>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<ProtectedRoute pageTitle="Dashboard"><DashboardHome /></ProtectedRoute>} />
        <Route path="/content/new" element={<ProtectedRoute pageTitle="Create Content"><CreateContent /></ProtectedRoute>} />
        <Route path="/content" element={<ProtectedRoute pageTitle="Content Library"><ContentLibrary /></ProtectedRoute>} />
        <Route path="/content/:contentId" element={<ProtectedRoute pageTitle="Content Detail"><ContentDetail /></ProtectedRoute>} />
        <Route path="/campaigns/new" element={<ProtectedRoute pageTitle="Create Campaign"><CreateCampaign /></ProtectedRoute>} />
        <Route path="/campaigns" element={<ProtectedRoute pageTitle="Campaigns"><CampaignsList /></ProtectedRoute>} />
        <Route path="/campaigns/:campaignId" element={<ProtectedRoute pageTitle="Campaign Detail"><CampaignDetail /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute pageTitle="Social Calendar"><SocialCalendar /></ProtectedRoute>} />
        <Route path="/pr/new" element={<ProtectedRoute pageTitle="Create PR"><CreatePR /></ProtectedRoute>} />
        <Route path="/pr" element={<ProtectedRoute pageTitle="PR Library"><PRLibrary /></ProtectedRoute>} />
        <Route path="/creative" element={<ProtectedRoute pageTitle="Creative Studio"><CreativeStudio /></ProtectedRoute>} />
        <Route path="/creative/gallery" element={<ProtectedRoute pageTitle="Image Gallery"><CreativeGallery /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute pageTitle="Analytics"><Analytics /></ProtectedRoute>} />
        <Route path="/brand/:brandId" element={<ProtectedRoute pageTitle="Brand Settings"><BrandSettings /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute pageTitle="Settings"><UserSettings /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>

      {user && location.pathname !== '/onboarding' && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <BrandProvider>
          <AppRoutes />
        </BrandProvider>
      </AuthProvider>
    </Router>
  );
}
