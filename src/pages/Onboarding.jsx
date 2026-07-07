import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { brands, publishing } from '../api';

const INDUSTRIES = [
  'Technology',
  'E-commerce',
  'SaaS',
  'Marketing',
  'Consulting',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Other'
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    brandName: '',
    industry: '',
    colors: { primary: '#BFFF00', secondary: '#0a0a0a' },
    logo: null,
    voiceDescription: '',
    sampleContent: '',
    targetAudience: '',
    competitors: [],
    competitorInput: ''
  });

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
      setError(null);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      setError(null);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCompetitor = () => {
    if (formData.competitorInput.trim() && formData.competitors.length < 5) {
      setFormData(prev => ({
        ...prev,
        competitors: [...prev.competitors, prev.competitorInput.trim()],
        competitorInput: ''
      }));
    }
  };

  const handleRemoveCompetitor = (index) => {
    setFormData(prev => ({
      ...prev,
      competitors: prev.competitors.filter((_, i) => i !== index)
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, logo: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = async () => {
    try {
      setLoading(true);
      setError(null);

      const brandData = {
        name: formData.brandName,
        industry: formData.industry,
        colors: formData.colors,
        voiceDescription: formData.voiceDescription,
        targetAudience: formData.targetAudience,
        competitors: formData.competitors,
        sampleContent: formData.sampleContent
      };

      const res = await brands.create(brandData);
      navigate('/dashboard', { state: { brandId: res.data.id } });
    } catch (err) {
      setError(err.message || 'Failed to create brand');
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
    <div className="min-h-screen bg-beheard-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i <= step ? 'bg-beheard-lime' : 'bg-beheard-border'
                }`}
              />
            ))}
          </div>
          <p className="text-beheard-text-tertiary text-sm">Step {step} of 7</p>
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="card mb-6"
          >
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">What's your brand name?</h2>
                <input
                  type="text"
                  placeholder="Brand name"
                  value={formData.brandName}
                  onChange={(e) => handleInputChange('brandName', e.target.value)}
                  className="w-full mb-4"
                />
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full"
                >
                  <option value="">Select industry</option>
                  {INDUSTRIES.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Brand colors & logo</h2>
                <div className="mb-4">
                  <label className="block text-beheard-text-secondary mb-2">Primary color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.colors.primary}
                      onChange={(e) => handleInputChange('colors', {
                        ...formData.colors,
                        primary: e.target.value
                      })}
                      className="w-16 h-10 rounded-beheard cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.colors.primary}
                      onChange={(e) => handleInputChange('colors', {
                        ...formData.colors,
                        primary: e.target.value
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-beheard-text-secondary mb-2">Secondary color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.colors.secondary}
                      onChange={(e) => handleInputChange('colors', {
                        ...formData.colors,
                        secondary: e.target.value
                      })}
                      className="w-16 h-10 rounded-beheard cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.colors.secondary}
                      onChange={(e) => handleInputChange('colors', {
                        ...formData.colors,
                        secondary: e.target.value
                      })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-beheard-text-secondary mb-2">Logo (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="w-full"
                  />
                  {formData.logo && (
                    <img src={formData.logo} alt="Logo preview" className="mt-2 h-20" />
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Brand voice & samples</h2>
                <textarea
                  placeholder="Describe your brand voice (e.g., Confident, direct, witty...)"
                  value={formData.voiceDescription}
                  onChange={(e) => handleInputChange('voiceDescription', e.target.value)}
                  rows={3}
                  className="w-full mb-4"
                />
                <textarea
                  placeholder="Sample content (examples of your brand's writing)"
                  value={formData.sampleContent}
                  onChange={(e) => handleInputChange('sampleContent', e.target.value)}
                  rows={3}
                  className="w-full"
                />
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Target audience</h2>
                <textarea
                  placeholder="Describe your target audience (demographics, interests, pain points...)"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  rows={5}
                  className="w-full"
                />
              </div>
            )}

            {step === 5 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Competitors (up to 5)</h2>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Competitor name"
                    value={formData.competitorInput}
                    onChange={(e) => handleInputChange('competitorInput', e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCompetitor()}
                    className="flex-1"
                  />
                  <button
                    onClick={handleAddCompetitor}
                    className="btn-primary"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.competitors.map((comp, idx) => (
                    <div
                      key={idx}
                      className="bg-beheard-hover border border-beheard-border rounded-beheard px-3 py-1 flex items-center gap-2"
                    >
                      {comp}
                      <button
                        onClick={() => handleRemoveCompetitor(idx)}
                        className="text-beheard-text-tertiary hover:text-beheard-text"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 6 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Connect Instagram & Facebook</h2>
                <p className="text-beheard-text-secondary mb-4">
                  Connect your Meta account to publish content directly to Instagram and Facebook.
                </p>
                <button
                  onClick={() => {
                    // Meta OAuth will be handled here
                    handleNext();
                  }}
                  className="btn-primary w-full mb-2"
                >
                  Connect Meta Account
                </button>
                <button
                  onClick={handleNext}
                  className="btn-secondary w-full"
                >
                  Skip for now
                </button>
              </div>
            )}

            {step === 7 && (
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-beheard-lime rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-beheard-black" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
                <p className="text-beheard-text-secondary mb-6">
                  Your brand is ready. Let's start creating amazing content.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Error message */}
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-beheard p-3 mb-4 text-red-100">
            {error}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-2 justify-between">
          <button
            onClick={handlePrev}
            disabled={step === 1}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {step < 7 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && (!formData.brandName || !formData.industry)) ||
                (step === 3 && !formData.voiceDescription) ||
                (step === 4 && !formData.targetAudience)
              }
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Get Started'}
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
