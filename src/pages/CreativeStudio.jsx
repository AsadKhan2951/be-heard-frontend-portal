import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, Download, RefreshCw, Trash2 } from 'lucide-react';
import api from '../api';

const FORMATS = {
  'ig-post': 'Instagram Post (1:1)',
  'ig-story': 'Instagram Story (9:16)',
  'carousel': 'Carousel (1:1)',
  'cover': 'Cover Image (16:9)',
  'banner': 'Banner (1280:400)'
};

const STYLES = [
  'Photo', 'Illustration', 'Abstract', '3D', 'Flat', 'Minimal'
];

export default function CreativeStudio() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brandId: '',
    description: '',
    format: 'ig-post',
    style: 'Photo'
  });
  const [generated, setGenerated] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.brandId) {
      alert('Please select a brand');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/creative/generate', formData);
      setGenerated(response.data);
      setStep(3);
    } catch (err) {
      alert('Failed to generate image: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generated?.imageUrl) return;
    const a = document.createElement('a');
    a.href = generated.imageUrl;
    a.download = `creative-${generated.id}.png`;
    a.click();
  };

  const handleRegenerate = async () => {
    if (!generated?.id) return;
    setLoading(true);
    try {
      const response = await api.post(`/creative/${generated.id}/regenerate`);
      setGenerated(prev => ({ ...prev, imageUrl: response.data.imageUrl }));
    } catch (err) {
      alert('Failed to regenerate: ' + err.message);
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
        <h1 className="text-lg font-semibold">Creative Studio</h1>
      </div>

      <div className="p-4">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Create Visual</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <select
                name="brandId"
                value={formData.brandId}
                onChange={handleChange}
                className="w-full bg-[#111111] border border-[#1a1a1a] rounded p-3 text-white"
              >
                <option value="">Select a brand</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what you want to create..."
                rows={4}
                className="w-full bg-[#111111] border border-[#1a1a1a] rounded p-3 text-white placeholder-[#666]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Format</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(FORMATS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setFormData(prev => ({ ...prev, format: key }))}
                    className={`p-3 rounded border text-sm font-medium transition ${
                      formData.format === key
                        ? 'border-[#BFFF00] bg-[#1a1a1a]'
                        : 'border-[#1a1a1a] hover:border-[#2a2a2a]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Style</label>
              <div className="grid grid-cols-3 gap-2">
                {STYLES.map(style => (
                  <button
                    key={style}
                    onClick={() => setFormData(prev => ({ ...prev, style }))}
                    className={`p-3 rounded border text-sm font-medium transition ${
                      formData.style === style
                        ? 'border-[#BFFF00] bg-[#1a1a1a]'
                        : 'border-[#1a1a1a] hover:border-[#2a2a2a]'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-[#BFFF00] text-black font-semibold py-3 rounded hover:bg-[#a8e600] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : null}
              {loading ? 'Generating...' : 'Generate Image'}
            </button>
          </div>
        )}

        {step === 3 && generated && (
          <div className="space-y-4">
            {/* Image Display */}
            <div className="bg-[#111111] border border-[#1a1a1a] rounded overflow-hidden">
              <img
                src={generated.imageUrl}
                alt="Generated"
                className="w-full h-auto"
              />
            </div>

            {/* Image Prompt */}
            <div className="bg-[#111111] border border-[#1a1a1a] rounded p-4">
              <div className="text-sm text-[#999] mb-2">Image Prompt</div>
              <p className="text-sm text-[#ccc]">{generated.prompt}</p>
            </div>

            {/* Format Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#111111] border border-[#1a1a1a] rounded p-3">
                <div className="text-xs text-[#999]">Format</div>
                <div className="font-semibold">{FORMATS[generated.format]}</div>
              </div>
              <div className="bg-[#111111] border border-[#1a1a1a] rounded p-3">
                <div className="text-xs text-[#999]">Style</div>
                <div className="font-semibold">{generated.style}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownload}
                className="bg-[#1a1a1a] border border-[#2a2a2a] text-white font-semibold py-3 rounded hover:bg-[#2a2a2a] flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download
              </button>
              <button
                onClick={handleRegenerate}
                disabled={loading}
                className="bg-[#1a1a1a] border border-[#2a2a2a] text-white font-semibold py-3 rounded hover:bg-[#2a2a2a] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                Regenerate
              </button>
            </div>

            <button
              onClick={() => navigate('/creative/gallery')}
              className="w-full bg-[#BFFF00] text-black font-semibold py-3 rounded hover:bg-[#a8e600]"
            >
              View Gallery
            </button>

            <button
              onClick={() => {
                setStep(1);
                setGenerated(null);
              }}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white font-semibold py-3 rounded hover:bg-[#2a2a2a]"
            >
              Create Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
