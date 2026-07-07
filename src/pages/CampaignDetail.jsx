import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader, Send } from 'lucide-react';
import { API_ORIGIN } from '../api';

export default function CampaignDetail() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCampaign();
  }, [campaignId]);

  const loadCampaign = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_ORIGIN}/api/campaigns/${campaignId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to load campaign');
      const data = await res.json();
      setCampaign(data);
    } catch (err) {
      setError('Failed to load campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAll = async () => {
    try {
      setGenerating(true);
      setError(null);

      const res = await fetch(`${API_ORIGIN}/api/campaigns/${campaignId}/generate-content`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!res.ok) throw new Error('Failed to generate content');
      const data = await res.json();
      
      setProgress(`Generated ${data.generated} of ${data.total} content pieces`);
      await loadCampaign();
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-beheard-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-4">
        <div className="text-beheard-text-secondary">Campaign not found</div>
      </div>
    );
  }

  const contentPlan = campaign.content_plan || [];
  const generatedCount = (campaign.content || []).length;
  const progress_percent = contentPlan.length > 0 ? (generatedCount / contentPlan.length) * 100 : 0;

  return (
    <div className="p-4 pb-80px">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/campaigns')}
          className="flex items-center gap-2 text-beheard-text-secondary hover:text-beheard-text"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900 border border-red-700 rounded-beheard p-3 mb-4 text-red-100">
          {error}
        </div>
      )}

      {/* Campaign info */}
      <div className="card mb-6">
        <h1 className="text-2xl font-bold mb-2">{campaign.name}</h1>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-beheard-text-tertiary">Objective</p>
            <p className="font-semibold capitalize">{campaign.objective}</p>
          </div>
          <div>
            <p className="text-beheard-text-tertiary">Status</p>
            <p className="font-semibold capitalize">{campaign.status}</p>
          </div>
          <div>
            <p className="text-beheard-text-tertiary">Duration</p>
            <p className="font-semibold">{campaign.start_date} to {campaign.end_date}</p>
          </div>
          <div>
            <p className="text-beheard-text-tertiary">Budget</p>
            <p className="font-semibold">${campaign.budget}</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="card mb-6">
        <h2 className="font-semibold mb-3">Content Generation Progress</h2>
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-beheard-text-secondary">
              {generatedCount} of {contentPlan.length} generated
            </span>
            <span className="text-sm font-semibold text-beheard-lime">{Math.round(progress_percent)}%</span>
          </div>
          <div className="w-full bg-beheard-hover rounded-full h-2">
            <div
              className="bg-beheard-lime h-2 rounded-full transition-all"
              style={{ width: `${progress_percent}%` }}
            />
          </div>
        </div>
        {progress && <p className="text-xs text-beheard-text-tertiary">{progress}</p>}
      </div>

      {/* Strategy */}
      <div className="card mb-6">
        <h3 className="font-semibold mb-2">Strategy</h3>
        <p className="text-sm text-beheard-text-secondary">{campaign.strategy}</p>
      </div>

      {/* Key Messages */}
      <div className="card mb-6">
        <h3 className="font-semibold mb-3">Key Messages</h3>
        <ul className="space-y-2">
          {campaign.key_messages.map((msg, i) => (
            <li key={i} className="text-sm text-beheard-text-secondary">
              <span className="text-beheard-lime">•</span> {msg}
            </li>
          ))}
        </ul>
      </div>

      {/* Content List */}
      <div className="card mb-6">
        <h3 className="font-semibold mb-3">Content Plan</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {contentPlan.map((item, i) => {
            const generated = campaign.content?.find(c => 
              c.media_brief === item.brief && c.platform === item.platform
            );
            return (
              <div key={i} className="flex items-center justify-between text-sm p-2 bg-beheard-hover rounded-beheard">
                <div className="flex-1">
                  <p className="font-medium">{item.type}</p>
                  <p className="text-xs text-beheard-text-tertiary">{item.date} • {item.platform}</p>
                </div>
                <div className={`text-xs px-2 py-1 rounded ${
                  generated ? 'bg-green-900 text-green-100' : 'bg-beheard-card text-beheard-text-tertiary'
                }`}>
                  {generated ? '✓ Generated' : 'Pending'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={handleGenerateAll}
          disabled={generating || generatedCount === contentPlan.length}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {generating ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Generating All Content...
            </>
          ) : (
            <>
              <Loader className="w-4 h-4" />
              Generate All Content
            </>
          )}
        </button>
        <button
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Publish All Ready
        </button>
      </div>
    </div>
  );
}
