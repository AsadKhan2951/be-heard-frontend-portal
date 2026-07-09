import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, Zap } from 'lucide-react';

export default function CampaignsList() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/campaigns', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to load campaigns');
      const data = await res.json();
      setCampaigns(data);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-900 text-green-100';
      case 'paused':
        return 'bg-yellow-900 text-yellow-100';
      case 'completed':
        return 'bg-blue-900 text-blue-100';
      default:
        return 'bg-beheard-hover text-beheard-text-secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <button
          onClick={() => navigate('/campaigns/new')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-8 text-beheard-text-secondary">Loading...</div>
      ) : campaigns.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-beheard-text-secondary mb-4">No campaigns yet</p>
          <button
            onClick={() => navigate('/campaigns/new')}
            className="btn-primary"
          >
            Create your first campaign
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {campaigns.map(campaign => (
            <div
              key={campaign.id}
              onClick={() => navigate(`/campaigns/${campaign.id}`)}
              className="card-hover cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold">{campaign.name}</h3>
                  <p className="text-xs text-beheard-text-tertiary mt-1">
                    {campaign.objective} • {campaign.channels.join(', ')}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-2">
                <div className="w-full bg-beheard-hover rounded-full h-1">
                  <div
                    className="bg-beheard-lime h-1 rounded-full"
                    style={{ width: '45%' }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-beheard-text-tertiary">
                <span>{campaign.channels.length} channels</span>
                <span>{campaign.start_date} to {campaign.end_date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
