import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Upload } from 'lucide-react';
import { brands, analytics, API_ORIGIN } from '../api';
import { useBrand } from '../BrandContext';

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
  const { refreshBrands, setSelectedBrandId } = useBrand();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [brandId, setBrandId] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoUploading, setLogoUploading] = useState(false);

  const [formData, setFormData] = useState({
    brandName: '',
    industry: '',
    colors: { primary: '#BFFF00', secondary: '#0a0a0a' },
    logoUrl: '',
    voiceDescription: '',
    sampleContent: '',
    targetAudience: '',
    competitors: [],
    competitorInput: ''
  });
  const [brandProfile, setBrandProfile] = useState(null);
  const [sampleCaption, setSampleCaption] = useState(null);

  // Load draft brand on mount
  useEffect(() => {
    const resumeBrand = async () => {
      try {
        const storedBrandId = localStorage.getItem('beheard_onboarding_brand');
        if (storedBrandId) {
          const res = await brands.get(storedBrandId);
          const brand = res.data;
          
          // Resume at saved step
          setStep(brand.onboarding_step || 1);
          setBrandId(brand.id);
          
          // Restore form data from brand
          setFormData({
            brandName: brand.name || '',
            industry: brand.industry || '',
            colors: brand.colors || { primary: '#BFFF00', secondary: '#0a0a0a' },
            logoUrl: brand.logo_url || '',
            voiceDescription: brand.voice_description || '',
            sampleContent: brand.sample_content || '',
            targetAudience: brand.target_audience || '',
            competitors: brand.competitors || [],
            competitorInput: ''
          });
          
          if (brand.logo_url) {
            setLogoPreview(brand.logo_url);
          }
        }
      } catch (err) {
        console.error('Failed to resume onboarding:', err);
      } finally {
        setLoading(false);
      }
    };

    resumeBrand();
  }, []);

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

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLogoUploading(true);
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const res = await fetch(`${API_ORIGIN}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataUpload
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const { url } = await res.json();
      setFormData(prev => ({ ...prev, logoUrl: url }));
      setLogoPreview(url);

      // Save logo URL to brand if it exists
      if (brandId) {
        await brands.update(brandId, { logoUrl: url });
      }
    } catch (err) {
      console.error('Logo upload error:', err);
      setError('Failed to upload logo');
    } finally {
      setLogoUploading(false);
    }
  };

  const handleNext = async () => {
    try {
      setSaving(true);
      setError(null);

      // Step 1: Create brand if not exists
      if (step === 1) {
        if (!formData.brandName || !formData.industry) {
          setError('Please fill in all required fields');
          setSaving(false);
          return;
        }

        if (!brandId) {
          const res = await brands.create({
            name: formData.brandName,
            industry: formData.industry
          });
          const newBrandId = res.data.id;
          setBrandId(newBrandId);
          localStorage.setItem('beheard_onboarding_brand', newBrandId);
        } else {
          // Update existing brand
          await brands.update(brandId, {
            name: formData.brandName,
            industry: formData.industry,
            onboarding_step: 2
          });
        }
      } else {
        // Save current step data
        const updates = { onboarding_step: step + 1 };

        if (step === 2) {
          updates.logoUrl = formData.logoUrl;
        } else if (step === 3) {
          updates.voiceDescription = formData.voiceDescription;
        } else if (step === 4) {
          updates.sampleContent = formData.sampleContent;
        } else if (step === 5) {
          updates.targetAudience = formData.targetAudience;
        } else if (step === 6) {
          updates.competitors = formData.competitors;
        }

        await brands.update(brandId, updates);
      }

      if (step < 7) {
        setStep(step + 1);
      }
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      setError(null);
    }
  };

  const handleConnectMeta = async () => {
    try {
      setSaving(true);
      setError(null);

      // Get OAuth URL with brandId
      const res = await fetch(`${API_ORIGIN}/api/meta/oauth-url?brandId=${brandId}`, {
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
      setError('Meta connection is not configured yet — click "Skip for now" to continue. (Requires a Facebook App: META_APP_ID / META_APP_SECRET.)');
      setSaving(false);
    }
  };

  const handleComplete = async () => {
    try {
      setSaving(true);
      setError(null);

      // Generate brand profile
      const profileRes = await brands.regenerateProfile(brandId);
      setBrandProfile(profileRes);

      // Generate sample caption
      const contentRes = await analytics.generateContent({
        brandId,
        contentType: 'Social Post',
        platform: 'instagram',
        topic: 'Brand introduction',
        tone: 'Professional',
        length: 'Medium',
        hashtags: true,
        cta: false,
        generateImage: false
      });
      if (contentRes && contentRes.versions && contentRes.versions[0]) {
        setSampleCaption(contentRes.versions[0]);
      }

      // Move to reveal screen (step 8)
      setStep(8);
    } catch (err) {
      console.error('Complete error:', err);
      setError('Failed to complete onboarding');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i <= step ? 'bg-[#BFFF00]' : 'bg-[#333]'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-[#888]">Step {step} of 8</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-[#111111] border border-[#1a1a1a] rounded-lg p-8 mb-6"
          >
            {/* Step 1: Brand Name & Industry */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Let's start with your brand</h2>
                  <p className="text-[#888]">What's your brand name and industry?</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Brand Name *</label>
                  <input
                    type="text"
                    value={formData.brandName}
                    onChange={(e) => handleInputChange('brandName', e.target.value)}
                    placeholder="e.g., TechFlow"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded px-4 py-3 text-white placeholder-[#666]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Industry *</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded px-4 py-3 text-white"
                  >
                    <option value="">Select an industry</option>
                    {INDUSTRIES.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Logo Upload */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Upload your logo</h2>
                  <p className="text-[#888]">This will represent your brand</p>
                </div>

                <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#2a2a2a] rounded-lg p-8 cursor-pointer hover:border-[#BFFF00] transition-colors">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={handleLogoUpload}
                    disabled={logoUploading}
                    className="hidden"
                    id="logo-input"
                  />
                  <label htmlFor="logo-input" className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="max-w-32 max-h-32 mb-4" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mb-2 text-[#BFFF00]" />
                        <p className="text-sm font-medium">Click to upload</p>
                        <p className="text-xs text-[#888]">PNG, JPG, WEBP, SVG (max 5MB)</p>
                      </>
                    )}
                  </label>
                </div>

                {logoUploading && <p className="text-sm text-[#BFFF00]">Uploading...</p>}
              </div>
            )}

            {/* Step 3: Voice Description */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Define your brand voice</h2>
                  <p className="text-[#888]">How should your content sound?</p>
                </div>

                <textarea
                  value={formData.voiceDescription}
                  onChange={(e) => handleInputChange('voiceDescription', e.target.value)}
                  placeholder="e.g., Professional yet approachable, innovative, customer-focused..."
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded px-4 py-3 text-white placeholder-[#666] h-32 resize-none"
                />
              </div>
            )}

            {/* Step 4: Sample Content */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Share sample content</h2>
                  <p className="text-[#888]">Paste an example of your best content</p>
                </div>

                <textarea
                  value={formData.sampleContent}
                  onChange={(e) => handleInputChange('sampleContent', e.target.value)}
                  placeholder="Paste your sample content here..."
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded px-4 py-3 text-white placeholder-[#666] h-32 resize-none"
                />
              </div>
            )}

            {/* Step 5: Target Audience */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Who's your audience?</h2>
                  <p className="text-[#888]">Describe your ideal customer</p>
                </div>

                <textarea
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  placeholder="e.g., Tech-savvy entrepreneurs aged 25-45, interested in AI and automation..."
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded px-4 py-3 text-white placeholder-[#666] h-32 resize-none"
                />
              </div>
            )}

            {/* Step 6: Competitors */}
            {step === 6 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Who are your competitors?</h2>
                  <p className="text-[#888]">Add up to 5 competitors (optional)</p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.competitorInput}
                    onChange={(e) => handleInputChange('competitorInput', e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCompetitor()}
                    placeholder="Enter competitor name"
                    className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded px-4 py-2 text-white placeholder-[#666]"
                  />
                  <button
                    onClick={handleAddCompetitor}
                    disabled={formData.competitors.length >= 5}
                    className="bg-[#BFFF00] text-black px-4 py-2 rounded font-medium disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.competitors.map((comp, idx) => (
                    <div
                      key={idx}
                      className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-4 py-2 flex items-center gap-2"
                    >
                      <span className="text-sm">{comp}</span>
                      <button
                        onClick={() => handleRemoveCompetitor(idx)}
                        className="text-[#888] hover:text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Connect Meta */}
            {step === 6 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Connect your Meta account</h2>
                  <p className="text-[#888]">Link Instagram and Facebook for publishing (optional)</p>
                </div>

                <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                      📱
                    </div>
                    <div>
                      <p className="font-medium">Instagram & Facebook</p>
                      <p className="text-sm text-[#888]">Publish directly to your accounts</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleConnectMeta}
                    disabled={saving}
                    className="w-full bg-[#BFFF00] hover:bg-[#a8e600] disabled:opacity-50 text-black py-3 rounded font-medium transition"
                  >
                    {saving ? 'Connecting...' : 'Connect Meta Account'}
                  </button>
                  <button
                    onClick={() => setStep(7)}
                    disabled={saving}
                    className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white py-3 rounded font-medium transition"
                  >
                    Skip for now
                  </button>
                </div>
              </div>
            )}

            {/* Step 7: Review */}
            {step === 7 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
                  <p className="text-[#888]">Review your brand details</p>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-[#888]">Brand Name</p>
                    <p className="font-medium">{formData.brandName}</p>
                  </div>
                  <div>
                    <p className="text-[#888]">Industry</p>
                    <p className="font-medium">{formData.industry}</p>
                  </div>
                  {logoPreview && (
                    <div>
                      <p className="text-[#888]">Logo</p>
                      <img src={logoPreview} alt="Logo" className="max-w-24 max-h-24 mt-2" />
                    </div>
                  )}
                  {formData.voiceDescription && (
                    <div>
                      <p className="text-[#888]">Brand Voice</p>
                      <p className="font-medium">{formData.voiceDescription}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 8 && brandProfile && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Here's what I learned about your brand</h2>
                  <p className="text-[#888]">AI-powered brand profile</p>
                </div>

                {brandProfile.tone_attributes && brandProfile.tone_attributes.length > 0 && (
                  <div>
                    <p className="text-[#888] text-sm mb-3">Tone Attributes</p>
                    <div className="flex flex-wrap gap-2">
                      {brandProfile.tone_attributes.map((attr, i) => (
                        <div key={i} className="bg-[#111111] border border-[#1a1a1a] px-3 py-1 rounded text-sm">
                          {attr.trait} <span className="text-[#888]">({attr.intensity}/5)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {brandProfile.key_messages && brandProfile.key_messages.length > 0 && (
                  <div>
                    <p className="text-[#888] text-sm mb-3">Key Messages</p>
                    <div className="space-y-2">
                      {brandProfile.key_messages.slice(0, 3).map((msg, i) => (
                        <p key={i} className="text-sm">• {msg}</p>
                      ))}
                    </div>
                  </div>
                )}

                {brandProfile.hashtag_bank && brandProfile.hashtag_bank.instagram && brandProfile.hashtag_bank.instagram.length > 0 && (
                  <div>
                    <p className="text-[#888] text-sm mb-3">Sample Hashtags</p>
                    <p className="text-sm">{brandProfile.hashtag_bank.instagram.slice(0, 5).join(' ')}</p>
                  </div>
                )}

                {sampleCaption && (
                  <div>
                    <p className="text-[#888] text-sm mb-3">Sample Instagram Caption</p>
                    <div className="bg-[#111111] border border-[#1a1a1a] p-4 rounded text-sm italic">
                      "{sampleCaption}"
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-200 text-sm">
                {error}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex gap-4">
          <button
            onClick={handlePrev}
            disabled={step === 1 || saving}
            className="flex-1 bg-[#1a1a1a] hover:bg-[#2a2a2a] disabled:opacity-50 text-white py-3 rounded font-medium flex items-center justify-center gap-2 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {step === 8 ? (
            <button
              onClick={async () => {
                try {
                  setSaving(true);
                  // Mark onboarding as complete
                  await brands.update(brandId, {
                    onboarding_complete: 1
                  });
                  // Clear draft key
                  localStorage.removeItem('beheard_onboarding_brand');
                  // Refresh brands context
                  await refreshBrands();
                  setSelectedBrandId(brandId);
                  navigate('/dashboard');
                } catch (err) {
                  console.error('Complete error:', err);
                  setError('Failed to complete onboarding');
                } finally {
                  setSaving(false);
                }
              }}
              disabled={saving}
              className="flex-1 bg-[#BFFF00] hover:bg-[#a8e600] disabled:opacity-50 text-black py-3 rounded font-medium flex items-center justify-center gap-2 transition"
            >
              <Check className="w-4 h-4" />
              {saving ? 'Completing...' : 'Take me to dashboard'}
            </button>
          ) : step === 7 ? (
            <button
              onClick={handleComplete}
              disabled={saving}
              className="flex-1 bg-[#BFFF00] hover:bg-[#a8e600] disabled:opacity-50 text-black py-3 rounded font-medium flex items-center justify-center gap-2 transition"
            >
              {saving ? 'Generating...' : 'Review Profile'}
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={saving}
              className="flex-1 bg-[#BFFF00] hover:bg-[#a8e600] disabled:opacity-50 text-black py-3 rounded font-medium flex items-center justify-center gap-2 transition"
            >
              {saving ? 'Saving...' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
