import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { brands, analytics } from '../api';
import { Plus, TrendingUp, Calendar, Zap, BarChart3 } from 'lucide-react';

export default function DashboardHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [brandList, setBrandList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const brandsRes = await brands.list();
      setBrandList(brandsRes.data);
      
      if (brandsRes.data.length > 0) {
        setSelectedBrand(brandsRes.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBrand) {
      loadStats();
    }
  }, [selectedBrand]);

  const loadStats = async () => {
    try {
      const res = await analytics.getDashboardStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-beheard-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-80px">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {selectedBrand && brandList.find(b => b.id === selectedBrand)?.name}
          </h1>
          <p className="text-beheard-text-secondary text-sm">Welcome back, {user?.name}</p>
        </div>
        <button
          onClick={() => navigate('/content/new')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New +
        </button>
      </div>

      {/* Brand selector */}
      {brandList.length > 1 && (
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {brandList.map(brand => (
            <button
              key={brand.id}
              onClick={() => setSelectedBrand(brand.id)}
              className={`px-4 py-2 rounded-beheard whitespace-nowrap transition-colors ${
                selectedBrand === brand.id
                  ? 'bg-beheard-lime text-beheard-black'
                  : 'bg-beheard-card border border-beheard-border text-beheard-text'
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>
      )}

      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-beheard-text-tertiary text-xs mb-1">Total Content</p>
                <p className="text-2xl font-bold text-beheard-text">{stats.totalContent}</p>
              </div>
              <Zap className="w-6 h-6 text-beheard-text-tertiary" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-beheard-text-tertiary text-xs mb-1">Scheduled</p>
                <p className="text-2xl font-bold text-beheard-text">{stats.scheduled}</p>
              </div>
              <Calendar className="w-6 h-6 text-beheard-text-tertiary" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-beheard-text-tertiary text-xs mb-1">Published</p>
                <p className="text-2xl font-bold text-beheard-text">{stats.published}</p>
              </div>
              <TrendingUp className="w-6 h-6 text-beheard-text-tertiary" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-beheard-text-tertiary text-xs mb-1">Engagement</p>
                <p className="text-2xl font-bold text-beheard-lime">{stats.engagementRate}%</p>
              </div>
              <BarChart3 className="w-6 h-6 text-beheard-text-tertiary" />
            </div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => navigate('/content/new?type=post')}
            className="card-hover flex flex-col items-center justify-center py-4"
          >
            <Plus className="w-5 h-5 mb-2 text-beheard-lime" />
            <span className="text-xs text-center">Create Post</span>
          </button>
          <button
            onClick={() => navigate('/content/new?type=campaign')}
            className="card-hover flex flex-col items-center justify-center py-4"
          >
            <TrendingUp className="w-5 h-5 mb-2 text-beheard-lime" />
            <span className="text-xs text-center">Campaign</span>
          </button>
          <button
            onClick={() => navigate('/content/new?type=pr')}
            className="card-hover flex flex-col items-center justify-center py-4"
          >
            <Zap className="w-5 h-5 mb-2 text-beheard-lime" />
            <span className="text-xs text-center">PR Piece</span>
          </button>
        </div>
      </div>

      {/* Mini calendar */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">This Week</h2>
        <div className="card">
          <div className="grid grid-cols-7 gap-1 text-center">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day}>
                <p className="text-xs text-beheard-text-tertiary mb-2">{day}</p>
                <div className="aspect-square rounded-beheard bg-beheard-hover flex items-center justify-center text-xs text-beheard-text-secondary">
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent content */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent Content</h2>
          <button
            onClick={() => navigate('/content')}
            className="text-beheard-lime text-sm hover:underline"
          >
            View All
          </button>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="card-hover flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium">Social Post #{i}</p>
                <p className="text-xs text-beheard-text-tertiary">Instagram • Draft</p>
              </div>
              <div className="text-xs text-beheard-text-secondary">2h ago</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
