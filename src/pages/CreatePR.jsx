import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import api from '../api';

const PR_TYPES = {
  'press-release': 'Press Release',
  'media-pitch': 'Media Pitch',
  'brand-story': 'Brand Story',
  'crisis': 'Crisis Statement',
  'thought-leadership': 'Thought Leadership'
};

export default function CreatePR() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brandId: '',
    type: 'press-release',
    topic: '',
    keyFacts: '',
    spokesperson: '',
    targetMedia: ''
  });
  const [generated, setGenerated] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.brandId || !formData.topic) {
      alert('Please fill in brand and topic');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/pr/generate', formData);
      setGenerated(response.data);
    } catch (err) {
      alert('Failed to generate PR: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] p-4 flex items-center gap-3 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-[#1a1a1a] rounded">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">Create PR</h1>
      </div>

      <div className="p-4 space-y-4">
        {!generated ? (
          <>
            {/* Type Selector */}
            <div>
              <label className="block text-sm font-medium mb-2">PR Type</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(PR_TYPES).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setFormData(prev => ({ ...prev, type: key }))}
                    className={`p-3 rounded border text-sm font-medium transition ${
                      formData.type === key
                        ? 'border-[#BFFF00] bg-[#1a1a1a]'
                        : 'border-[#1a1a1a] hover:border-[#2a2a2a]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <select
                name="brandId"
                value={formData.brandId}
                onChange={handleChange}
                className="w-full bg-[#111111] border border-[#1a1a1a] rounded p-3 text-white"
              >
                <option value="">Select a brand</option>
                {/* Brands will be fetched and populated */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Topic / Headline</label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g., New Product Launch"
                className="w-full bg-[#111111] border border-[#1a1a1a] rounded p-3 text-white placeholder-[#666]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Key Facts</label>
              <textarea
                name="keyFacts"
                value={formData.keyFacts}
                onChange={handleChange}
                placeholder="Main points to include..."
                rows={4}
                className="w-full bg-[#111111] border border-[#1a1a1a] rounded p-3 text-white placeholder-[#666]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Spokesperson</label>
              <input
                type="text"
                name="spokesperson"
                value={formData.spokesperson}
                onChange={handleChange}
                placeholder="Name and title"
                className="w-full bg-[#111111] border border-[#1a1a1a] rounded p-3 text-white placeholder-[#666]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Target Media</label>
              <input
                type="text"
                name="targetMedia"
                value={formData.targetMedia}
                onChange={handleChange}
                placeholder="e.g., Tech blogs, Business journals"
                className="w-full bg-[#111111] border border-[#1a1a1a] rounded p-3 text-white placeholder-[#666]"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-[#BFFF00] text-black font-semibold py-3 rounded hover:bg-[#a8e600] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : null}
              {loading ? 'Generating...' : 'Generate PR'}
            </button>
          </>
        ) : (
          <>
            {/* Generated PR Display */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{generated.topic}</h2>
                <button
                  onClick={() => setGenerated(null)}
                  className="text-[#666] hover:text-white"
                >
                  ← Edit
                </button>
              </div>

              {/* PR Content */}
              <div className="bg-[#111111] border border-[#1a1a1a] rounded p-4 prose prose-invert max-w-none">
                <div className="text-sm whitespace-pre-wrap text-[#ccc]">
                  {generated.content}
                </div>
              </div>

              {/* Suggested Outlets */}
              {generated.outlets && generated.outlets.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Suggested Media Outlets</h3>
                  <div className="space-y-2">
                    {generated.outlets.map((outlet, idx) => (
                      <div key={idx} className="bg-[#111111] border border-[#1a1a1a] rounded p-3">
                        <div className="font-medium">{outlet.name}</div>
                        <div className="text-sm text-[#999]">{outlet.type}</div>
                        <div className="text-xs text-[#666] mt-1">{outlet.focus}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/pr')}
                  className="flex-1 bg-[#BFFF00] text-black font-semibold py-3 rounded hover:bg-[#a8e600]"
                >
                  Save & View
                </button>
                <button
                  onClick={() => setGenerated(null)}
                  className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-white font-semibold py-3 rounded hover:bg-[#2a2a2a]"
                >
                  Regenerate
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
