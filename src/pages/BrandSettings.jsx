import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import api, { brands } from '../api';

const DEFAULT_COLORS = {
  primary: '#BFFF00',
  secondary: '#0a0a0a'
};

export default function BrandSettings() {
  const navigate = useNavigate();
  const { brandId } = useParams();
  const isCreateMode = !brandId || brandId === 'new';

  const [loading, setLoading] = useState(!isCreateMode);
  const [saving, setSaving] = useState(false);
  const [testingVoice, setTestingVoice] = useState(false);
  const [voiceTest, setVoiceTest] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    colors: DEFAULT_COLORS,
    voiceDescription: '',
    targetAudience: '',
    competitors: '',
    sampleContent: ''
  });

  useEffect(() => {
    if (!isCreateMode) {
      loadBrand();
    }
  }, [brandId]);

  const loadBrand = async () => {
    try {
      setLoading(true);
      const response = await brands.get(brandId);
      setFormData({
        name: response.data.name || '',
        industry: response.data.industry || '',
        colors: response.data.colors || DEFAULT_COLORS,
        voiceDescription: response.data.voice_description || '',
        targetAudience: response.data.target_audience || '',
        competitors: Array.isArray(response.data.competitors)
          ? response.data.competitors.join(', ')
          : '',
        sampleContent: response.data.sample_content || ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load brand');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value
      }
    }));
  };

  const buildPayload = () => ({
    name: formData.name.trim(),
    industry: formData.industry.trim(),
    colors: formData.colors,
    voiceDescription: formData.voiceDescription.trim(),
    targetAudience: formData.targetAudience.trim(),
    competitors: formData.competitors
      .split(',')
      .map(item => item.trim())
      .filter(Boolean),
    sampleContent: formData.sampleContent.trim()
  });

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.industry.trim()) {
      setError('Brand name and industry are required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const payload = buildPayload();

      if (isCreateMode) {
        const response = await brands.create(payload);
        navigate(`/brand/${response.data.id}`);
        return;
      }

      await brands.update(brandId, payload);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save brand');
    } finally {
      setSaving(false);
    }
  };

  const handleTestVoice = async () => {
    if (isCreateMode) {
      setError('Create the brand first, then test its voice');
      return;
    }

    if (!formData.voiceDescription.trim()) {
      setError('Add a voice description first');
      return;
    }

    try {
      setTestingVoice(true);
      setError(null);
      const response = await api.post('/content/generate', {
        brandId,
        contentType: 'post',
        platform: 'instagram',
        topic: 'Test topic',
        tone: 'professional',
        length: 'short',
        hashtags: false,
        cta: false,
        generateImage: false
      });
      setVoiceTest(response.data.versions?.[0] || null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to test brand voice');
    } finally {
      setTestingVoice(false);
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
      <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] p-4 flex items-center gap-3 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-[#1a1a1a] rounded">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">
          {isCreateMode ? 'Create Brand' : 'Brand Settings'}
        </h1>
      </div>

      <div className="p-4 space-y-6">
        {error && (
          <div className="bg-red-900 border border-red-700 rounded p-3 text-red-100">
            {error}
          </div>
        )}

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
                placeholder="Brand name"
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
                placeholder="Industry"
                className="w-full bg-[#111111] border border-[#1a1a1a] rounded p-3 text-white"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Brand Colors</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-16 h-12 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="flex-1 bg-[#111111] border border-[#1a1a1a] rounded p-3 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Secondary Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-16 h-12 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="flex-1 bg-[#111111] border border-[#1a1a1a] rounded p-3 text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Brand Voice</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Voice Description</label>
              <textarea
                name="voiceDescription"
                value={formData.voiceDescription}
                onChange={handleChange}
                placeholder="Describe tone, personality, and values"
                rows={4}
                className="w-full bg-[#111111] border border-[#1a1a1a] rounded p-3 text-white placeholder-[#666]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Sample Content</label>
              <textarea
                name="sampleContent"
                value={formData.sampleContent}
                onChange={handleChange}
                placeholder="Paste sample copy written in your brand voice"
                rows={4}
                className="w-full bg-[#111111] border border-[#1a1a1a] rounded p-3 text-white placeholder-[#666]"
              />
            </div>

            {!isCreateMode && (
              <button
                onClick={handleTestVoice}
                disabled={testingVoice}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white font-semibold py-3 rounded hover:bg-[#2a2a2a] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {testingVoice ? <Loader2 size={18} className="animate-spin" /> : null}
                Test Voice
              </button>
            )}

            {voiceTest && (
              <div className="bg-[#111111] border border-[#BFFF00] rounded p-4">
                <div className="text-sm text-[#999] mb-2">Sample Output</div>
                <p className="text-sm text-[#ccc] whitespace-pre-wrap">{voiceTest}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Audience & Market</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Target Audience</label>
              <textarea
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                placeholder="Who are you trying to reach?"
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
                placeholder="Comma-separated competitor names"
                rows={3}
                className="w-full bg-[#111111] border border-[#1a1a1a] rounded p-3 text-white placeholder-[#666]"
              />
            </div>
          </div>
        </div>

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
            {isCreateMode ? 'Create Brand' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
