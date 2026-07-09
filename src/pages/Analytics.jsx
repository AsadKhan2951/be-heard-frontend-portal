import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';
import { useBrand } from '../BrandContext';

export default function Analytics() {
  const navigate = useNavigate();
  const { brandList, selectedBrandId } = useBrand();
  const [brandId, setBrandId] = useState('');
  const [dateRange, setDateRange] = useState('7');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!brandId && selectedBrandId) {
      setBrandId(selectedBrandId);
    }
  }, [brandId, selectedBrandId]);

  useEffect(() => {
    if (brandId) {
      loadAnalytics();
    }
  }, [brandId, dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await api.get('/analytics', {
        params: { brandId, dateRange }
      });
      setAnalytics(response.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!brandId) return;
    setSyncing(true);
    try {
      await api.post('/analytics/sync', { brandId });
      loadAnalytics();
    } catch (err) {
      alert('Failed to sync: ' + err.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20 lg:pb-8">
      {/* Header */}
      <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-[#1a1a1a] rounded">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Analytics</h1>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing || !brandId}
          className="p-2 hover:bg-[#1a1a1a] rounded disabled:opacity-50"
        >
          <RefreshCw size={20} className={syncing ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Brand & Date Range Selector */}
        <div className="grid grid-cols-2 gap-3">
          <select
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            className="bg-[#111111] border border-[#1a1a1a] rounded p-3 text-white"
          >
            <option value="">Select brand</option>
            {brandList.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-[#111111] border border-[#1a1a1a] rounded p-3 text-white"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8 text-[#666]">Loading analytics...</div>
        ) : !analytics?.connected ? (
          <div className="bg-[#111111] border border-[#1a1a1a] rounded p-6 text-center">
            <p className="text-[#999] mb-3">Connect Meta account to view real analytics</p>
            <button
              onClick={() => navigate('/settings')}
              className="bg-[#BFFF00] text-black font-semibold px-4 py-2 rounded hover:bg-[#a8e600]"
            >
              Connect Meta
            </button>
          </div>
        ) : (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {analytics.contentMetrics?.map((metric, idx) => (
                <div key={idx} className="bg-[#111111] border border-[#1a1a1a] rounded p-4">
                  <div className="text-xs text-[#999] mb-2 capitalize">{metric.platform}</div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-[#666]">Posts</div>
                      <div className="text-lg font-semibold">{metric.total_posts}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#666]">Avg Engagement</div>
                      <div className="text-lg font-semibold">{metric.avg_engagement}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Engagement Chart */}
            {analytics.pageInsights?.page_engaged_users && (
              <div className="bg-[#111111] border border-[#1a1a1a] rounded p-4">
                <h3 className="font-semibold mb-4">Engagement Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={analytics.pageInsights.page_engaged_users}>
                    <CartesianGrid stroke="#1a1a1a" />
                    <XAxis stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #1a1a1a' }} />
                    <Line type="monotone" dataKey="value" stroke="#BFFF00" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Reach Chart */}
            {analytics.pageInsights?.page_impressions && (
              <div className="bg-[#111111] border border-[#1a1a1a] rounded p-4">
                <h3 className="font-semibold mb-4">Impressions</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analytics.pageInsights.page_impressions}>
                    <CartesianGrid stroke="#1a1a1a" />
                    <XAxis stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #1a1a1a' }} />
                    <Bar dataKey="value" fill="#BFFF00" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Top Posts */}
            {analytics.topPosts && analytics.topPosts.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Top Performing Posts</h3>
                <div className="space-y-2">
                  {analytics.topPosts.map((post, idx) => (
                    <div key={idx} className="bg-[#111111] border border-[#1a1a1a] rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs bg-[#1a1a1a] px-2 py-1 rounded capitalize">
                          {post.platform}
                        </span>
                        <span className="text-xs text-[#666]">
                          {new Date(post.published_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-xs text-[#666]">Engagement</div>
                          <div className="font-semibold">{post.engagement}</div>
                        </div>
                        <div>
                          <div className="text-xs text-[#666]">Impressions</div>
                          <div className="font-semibold">{post.impressions}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Last Sync */}
            <div className="text-xs text-[#666] text-center py-2">
              Last synced: {analytics.fetchedAt ? new Date(analytics.fetchedAt).toLocaleString() : 'Never'}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
