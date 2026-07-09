import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import api from '../api';

export default function BrandSettings() {
  const navigate = useNavigate();
  const { brandId } = useParams();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingVoice, setTestingVoice] = useState(false);
  const [voiceTest, setVoiceTest] = useState(null);
  const [metaConnected, setMetaConnected] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    colors: {},
    voice_description: '',
    target_audience: '',
    competitors: '',
    hashtags_preference: 'sometimes',
    content_length: 'medium',
    banned_words: ''
  });

  useEffect(() => {
    loadBrand();
  }, [brandId]);

  const loadBrand = async () => {
    try {
      const response = await api.get(`/brands/${brandId}`);
      const brand = response.data;
      
      setFormData({
        name: brand.name,
        industry: brand.industry,
        colors: brand.colors || {},
        voice_description: brand.voice_description,
        target_audience: brand.target_audience,
        competitors: brand.competitors || '',
        hashtags_preference: brand.hashtags_preference || 'sometimes',
        content_length: brand.content_length || 'medium',
        banned_words: brand.banned_words || ''
      });
      
      // Check Meta connection status
      setMetaConnected(!!(brand.meta_page_id && brand.meta_ig_account_id));
      
      // Handle OAuth callback
      if (searchParams.get('meta') === 'connected') {
        alert('Meta account connected successfully!');
      } else if (searchParams.get('meta') === 'error') {
        alert('Failed to connect Meta account: ' + (searchParams.get('message') || 'Unknown error'));
      }
    } catch (err) {
      console.error('Failed to load brand:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTestVoice = async () => {
    if (!formData.voice_description) {
      alert('Please fill in voice description first');
      return;
    }

    setTestingVoice(true);
    try {
      const response = await api.post('/content/generate', {
        brandId,
        contentType: 'Social Post',
        platform: 'instagram',
        topic: 'Test topic',
        tone: 'Professional',
        length: 'Short',
        hashtags: false,
        cta: false,
        generateImage: false
      });
      setVoiceTest(response.data);
    } catch (err) {
      alert('Failed to test voice: ' + err.message);
    } finally {
      setTestingVoice(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/brands/${brandId}`, formData);
      alert('Brand settings saved!');
    } catch (err) {
      alert('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleConnectMeta = async () => {
    try {
      setSaving(true);
      const res = await fetch(`/api/meta/oauth-url?brandId=${brandId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!res.ok) {
        throw new Error('Failed to get OAuth URL');
      }
      
      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      console.error('Meta connect error:', err);
      alert('Failed to connect Meta account');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] p-4 flex items-center gap-3 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-[#1a1a1a] rounded">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">Brand Settings</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Identity Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Identity</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Brand Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#111111] border border-[#1a1a1a] rounded p-3 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Industry</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full bg-[#111111] border border-[#1a1a1a] rounded p-3 text-white"
              />
            </div>
          </div>
        </div>

        {/* Voice Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Brand Voice</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Voice Description</label>
              <textarea
                name="voice_description"
                value={formData.voice_description}
                onChange={handleChange}
                placeholder="How does your brand speak? (tone, personality, values)"
                rows={4}
                className="w-full bg-[#111111] border border-[#1a1a1a] rounded p-3 text-white placeholder-[#666]"
              />
            </div>

            <button
              onClick={handleTestVoice}
              disabled={testingVoice}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white font-semibold py-3 rounded hover:bg-[#2a2a2a] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {testingVoice ? <Loader2 size={18} className="animate-spin" /> : null}
              Test Voice
            </button>

            {voiceTest && (
              <div className="bg-[#111111] border border-[#BFFF00] rounded p-4">
                <div className="text-sm text-[#999] mb-2">Sample Post:</div>
                <p className="text-sm text-[#ccc]">{voiceTest.versions?.[0] || voiceTest.body?.[0] || voiceTest.body}</p>
              </div>
            )}
          </div>
        </div>

        {/* Audience Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Audience & Market</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Target Audience</label>
              <textarea
                name="target_audience"
                value={formData.target_audience}
                onChange={handleChange}
                placeholder="Who is your ideal customer?"
                rows={3}
                className="w-full bg-[#111111] border border-[#1a1a1a] rounded p-3 text-white placeholder-[#666]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Competitors</label>
              <textarea
                name="competitors"
                value={formData.competitors}
                onChange={handleChange}
                placeholder="Who are your main competitors?"
                rows={3}
                className="w-full bg-[#111111] border border-[#1a1a1a] rounded p-3 text-white placeholder-[#666]"
              />
            </div>
          </div>
        </div>

        {/* Content Preferences */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Content Preferences</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Hashtags</label>
              <select
                name="hashtags_preference"
                value={formData.hashtags_preference}
                onChange={handleChange}
                className="w-full bg-[#111111] border border-[#1a1a1a] rounded p-3 text-white"
              >
                <option value="always">Always include</option>
                <option value="sometimes">Sometimes include</option>
                <option value="never">Never include</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content Length</label>
              <select
                name="content_length"
                value={formData.content_length}
                onChange={handleChange}
                className="w-full bg-[#111111] border border-[#1a1a1a] rounded p-3 text-white"
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Banned Words</label>
              <textarea
                name="banned_words"
                value={formData.banned_words}
                onChange={handleChange}
                placeholder="Words to avoid (comma-separated)"
                rows={2}
                className="w-full bg-[#111111] border border-[#1a1a1a] rounded p-3 text-white placeholder-[#666]"
              />
            </div>
          </div>
        </div>

        {/* Connected Channels */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Connected Channels</h2>
          <div className="space-y-2">
            <div className="bg-[#111111] border border-[#1a1a1a] rounded p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">Instagram & Facebook</div>
                <div className={`text-sm ${metaConnected ? 'text-[#BFFF00]' : 'text-[#666]'}`}>
                  {metaConnected ? 'Connected' : 'Not connected'}
                </div>
              </div>
              <button
                onClick={handleConnectMeta}
                disabled={saving}
                className="text-[#BFFF00] hover:underline text-sm font-medium disabled:opacity-50"
              >
                {metaConnected ? 'Reconnect' : 'Connect'}
              </button>
            </div>
          </div>
        </div>

        {/* Save Button (Sticky) */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-[#1a1a1a] p-4 flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-white font-semibold py-3 rounded hover:bg-[#2a2a2a]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-[#BFFF00] text-black font-semibold py-3 rounded hover:bg-[#a8e600] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : null}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
