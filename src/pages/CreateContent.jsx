import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Loader } from 'lucide-react';
import { brands, content as contentAPI } from '../api';

const CONTENT_TYPES = [
  { id: 'post', label: 'Social Post', icon: '📱' },
  { id: 'blog', label: 'Blog', icon: '📝' },
  { id: 'email', label: 'Email', icon: '✉️' },
  { id: 'ad', label: 'Ad Copy', icon: '📢' },
  { id: 'product', label: 'Product Desc', icon: '🛍️' },
  { id: 'thread', label: 'Thread', icon: '🧵' },
  { id: 'reel', label: 'Reel Script', icon: '🎬' },
  { id: 'carousel', label: 'Carousel', icon: '🎠' }
];

const PLATFORMS = ['instagram', 'facebook', 'twitter', 'linkedin', 'email', 'website'];

export default function CreateContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [brandList, setBrandList] = useState([]);

  const [formData, setFormData] = useState({
    brandId: '',
    contentType: searchParams.get('type') || 'post',
    platform: 'instagram',
    topic: '',
    tone: 'professional',
    length: 'medium',
    hashtags: true,
    cta: true,
    generateImage: true
  });

  const [generatedContent, setGeneratedContent] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(0);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const res = await brands.list();
      setBrandList(res.data);
      if (res.data.length > 0) {
        setFormData(prev => ({ ...prev, brandId: res.data[0].id }));
      }
    } catch (err) {
      setError('Failed to load brands');
    }
  };

  const handleGenerate = async () => {
    if (!formData.brandId || !formData.topic) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setGenerating(true);
      setError(null);

      const res = await contentAPI.generate(
        formData.brandId,
        formData.contentType,
        formData.platform,
        formData.topic,
        formData.tone,
        formData.length,
        formData.hashtags,
        formData.cta,
        formData.generateImage
      );

      setGeneratedContent(res.data);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate content');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Save logic here
      navigate('/content');
    } catch (err) {
      setError('Failed to save content');
    } finally {
      setLoading(false);
    }
  };

  const stepVariants = {
    enter: { opacity: 0, x: 100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  return (
    <div className="min-h-screen bg-beheard-black p-4 pb-80px">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-beheard-text-secondary hover:text-beheard-text mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold">Create Content</h1>
          <p className="text-beheard-text-secondary">Step {step} of 4</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  i <= step ? 'bg-beheard-lime' : 'bg-beheard-border'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-beheard p-3 mb-4 text-red-100">
            {error}
          </div>
        )}

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Type Selector */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-4">What type of content?</h2>
                <div className="grid grid-cols-2 gap-3">
                  {CONTENT_TYPES.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setFormData(prev => ({ ...prev, contentType: type.id }))}
                      className={`card-hover p-4 text-center transition-all ${
                        formData.contentType === type.id
                          ? 'bg-beheard-hover border-beheard-lime border-2'
                          : ''
                      }`}
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <p className="text-sm font-medium">{type.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Form Fields */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Content Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-beheard-text-secondary mb-2">Brand</label>
                    <select
                      value={formData.brandId}
                      onChange={(e) => setFormData(prev => ({ ...prev, brandId: e.target.value }))}
                      className="w-full"
                    >
                      {brandList && brandList.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-beheard-text-secondary mb-2">Platform</label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
                      className="w-full"
                    >
                      {PLATFORMS.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-beheard-text-secondary mb-2">Topic *</label>
                    <input
                      type="text"
                      placeholder="What should the content be about?"
                      value={formData.topic}
                      onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-beheard-text-secondary mb-2">Tone</label>
                    <select
                      value={formData.tone}
                      onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value }))}
                      className="w-full"
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="witty">Witty</option>
                      <option value="urgent">Urgent</option>
                      <option value="inspiring">Inspiring</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-beheard-text-secondary mb-2">Length</label>
                    <select
                      value={formData.length}
                      onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
                      className="w-full"
                    >
                      <option value="short">Short (under 100 words)</option>
                      <option value="medium">Medium (100-300 words)</option>
                      <option value="long">Long (300+ words)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hashtags}
                        onChange={(e) => setFormData(prev => ({ ...prev, hashtags: e.target.checked }))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Include hashtags</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.cta}
                        onChange={(e) => setFormData(prev => ({ ...prev, cta: e.target.checked }))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Include call-to-action</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.generateImage}
                        onChange={(e) => setFormData(prev => ({ ...prev, generateImage: e.target.checked }))}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Generate image</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Generate */}
            {step === 3 && (
              <div className="text-center">
                <h2 className="text-xl font-bold mb-4">Generating Content...</h2>
                <div className="card py-12">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full border-4 border-beheard-border border-t-beheard-lime animate-spin" />
                  </div>
                  <p className="text-beheard-text-secondary">
                    Creating 3 versions with AI-generated images...
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && generatedContent && (
              <div>
                <h2 className="text-xl font-bold mb-4">Review & Publish</h2>
                
                {/* Version tabs */}
                <div className="flex gap-2 mb-4">
                  {generatedContent.versions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedVersion(i)}
                      className={`px-4 py-2 rounded-beheard text-sm transition-colors ${
                        selectedVersion === i
                          ? 'bg-beheard-lime text-beheard-black'
                          : 'bg-beheard-card border border-beheard-border'
                      }`}
                    >
                      Version {i + 1}
                    </button>
                  ))}
                </div>

                {/* Content preview */}
                <div className="card mb-4">
                  <textarea
                    value={generatedContent.versions[selectedVersion]}
                    onChange={(e) => {
                      const newVersions = [...generatedContent.versions];
                      newVersions[selectedVersion] = e.target.value;
                      setGeneratedContent(prev => ({
                        ...prev,
                        versions: newVersions
                      }));
                    }}
                    rows={6}
                    className="w-full mb-4"
                  />

                  {generatedContent.imageUrl && (
                    <div>
                      <p className="text-beheard-text-secondary text-sm mb-2">Generated Image:</p>
                      <img
                        src={generatedContent.imageUrl}
                        alt="Generated"
                        className="w-full rounded-beheard"
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 sticky bottom-80px">
                  <button
                    onClick={() => setStep(2)}
                    className="btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="btn-secondary flex-1"
                  >
                    Regenerate
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn-primary flex-1"
                  >
                    {loading ? 'Saving...' : 'Save & Publish'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        {step < 4 && (
          <div className="flex gap-2 justify-between mt-8 sticky bottom-80px">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="btn-secondary flex items-center gap-2 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            {step === 3 ? (
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 flex-1"
              >
                {generating ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => setStep(step + 1)}
                className="btn-primary flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
