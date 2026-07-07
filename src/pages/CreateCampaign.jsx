import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Loader } from 'lucide-react';
import { brands } from '../api';

const OBJECTIVES = [
  { id: 'awareness', label: 'Awareness', icon: '👁️' },
  { id: 'engagement', label: 'Engagement', icon: '💬' },
  { id: 'lead', label: 'Lead Gen', icon: '🎯' },
  { id: 'launch', label: 'Launch', icon: '🚀' },
  { id: 'event', label: 'Event', icon: '📅' }
];

const CHANNELS = [
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'facebook', label: 'Facebook', icon: 'f' },
  { id: 'twitter', label: 'Twitter', icon: '𝕏' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { id: 'email', label: 'Email', icon: '✉️' },
  { id: 'blog', label: 'Blog', icon: '📝' }
];

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [brandList, setBrandList] = useState([]);
  const [plan, setPlan] = useState(null);

  const [formData, setFormData] = useState({
    brandId: '',
    name: '',
    objective: '',
    startDate: '',
    endDate: '',
    budget: '',
    channels: [],
    frequency: 'Weekly'
  });

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

  const toggleChannel = (channelId) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.includes(channelId)
        ? prev.channels.filter(c => c !== channelId)
        : [...prev.channels, channelId]
    }));
  };

  const handleGeneratePlan = async () => {
    if (!formData.brandId || !formData.name || !formData.objective || !formData.startDate || !formData.endDate || formData.channels.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setGenerating(true);
      setError(null);

      const res = await fetch('/api/campaigns/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to generate plan');
      const data = await res.json();
      setPlan(data);
      setStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleApproveLaunch = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          strategy: plan.strategy,
          key_messages: plan.key_messages,
          content_plan: plan.content_plan,
          kpis: plan.kpis
        })
      });

      if (!res.ok) throw new Error('Failed to create campaign');
      const data = await res.json();
      navigate(`/campaigns/${data.id}`);
    } catch (err) {
      setError(err.message);
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
            onClick={() => navigate('/campaigns')}
            className="text-beheard-text-secondary hover:text-beheard-text mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold">Create Campaign</h1>
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
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Campaign Basics</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-beheard-text-secondary mb-2">Brand *</label>
                    <select
                      value={formData.brandId}
                      onChange={(e) => setFormData(prev => ({ ...prev, brandId: e.target.value }))}
                      className="w-full"
                    >
                      {brandList.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-beheard-text-secondary mb-2">Campaign Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Summer Product Launch"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-beheard-text-secondary mb-2">Objective *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {OBJECTIVES.map(obj => (
                        <button
                          key={obj.id}
                          onClick={() => setFormData(prev => ({ ...prev, objective: obj.id }))}
                          className={`card-hover p-3 text-center ${
                            formData.objective === obj.id
                              ? 'bg-beheard-lime text-beheard-black'
                              : ''
                          }`}
                        >
                          <div className="text-xl mb-1">{obj.icon}</div>
                          <p className="text-xs font-medium">{obj.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-beheard-text-secondary mb-2">Start Date *</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-beheard-text-secondary mb-2">End Date *</label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-beheard-text-secondary mb-2">Budget ($)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.budget}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Channels */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Channels & Frequency</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-beheard-text-secondary mb-3">Channels *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {CHANNELS.map(channel => (
                        <button
                          key={channel.id}
                          onClick={() => toggleChannel(channel.id)}
                          className={`card-hover p-3 text-center transition-all ${
                            formData.channels.includes(channel.id)
                              ? 'bg-beheard-lime text-beheard-black'
                              : ''
                          }`}
                        >
                          <p className="text-sm font-medium">{channel.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-beheard-text-secondary mb-2">Frequency *</label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                      className="w-full"
                    >
                      <option value="Daily">Daily</option>
                      <option value="3x Week">3x per Week</option>
                      <option value="Weekly">Weekly</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Generate Plan */}
            {step === 3 && (
              <div className="text-center">
                <h2 className="text-xl font-bold mb-4">Generating Campaign Plan...</h2>
                <div className="card py-12">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full border-4 border-beheard-border border-t-beheard-lime animate-spin" />
                  </div>
                  <p className="text-beheard-text-secondary">
                    Claude is creating your strategy, key messages, and content plan...
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Review Plan */}
            {step === 4 && plan && (
              <div>
                <h2 className="text-xl font-bold mb-4">Campaign Plan</h2>
                
                <div className="card mb-4">
                  <h3 className="font-semibold mb-2">Strategy</h3>
                  <p className="text-beheard-text-secondary text-sm">{plan.strategy}</p>
                </div>

                <div className="card mb-4">
                  <h3 className="font-semibold mb-2">Key Messages</h3>
                  <ul className="space-y-1">
                    {plan.key_messages.map((msg, i) => (
                      <li key={i} className="text-beheard-text-secondary text-sm">• {msg}</li>
                    ))}
                  </ul>
                </div>

                <div className="card mb-4">
                  <h3 className="font-semibold mb-2">Content Plan</h3>
                  <p className="text-beheard-text-secondary text-sm mb-2">
                    {plan.content_plan.length} content pieces across {formData.channels.length} channels
                  </p>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {plan.content_plan.slice(0, 5).map((item, i) => (
                      <div key={i} className="text-xs text-beheard-text-tertiary">
                        {item.date} • {item.platform} • {item.type}
                      </div>
                    ))}
                    {plan.content_plan.length > 5 && (
                      <p className="text-xs text-beheard-text-tertiary">
                        +{plan.content_plan.length - 5} more items
                      </p>
                    )}
                  </div>
                </div>

                <div className="card mb-4">
                  <h3 className="font-semibold mb-2">KPIs</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(plan.kpis).map(([key, value]) => (
                      <div key={key} className="bg-beheard-hover p-2 rounded-beheard">
                        <p className="text-xs text-beheard-text-tertiary capitalize">{key}</p>
                        <p className="text-sm font-semibold text-beheard-lime">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 sticky bottom-80px">
                  <button
                    onClick={() => setStep(2)}
                    className="btn-secondary flex-1"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleApproveLaunch}
                    disabled={loading}
                    className="btn-primary flex-1"
                  >
                    {loading ? 'Launching...' : 'Approve & Launch'}
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
                onClick={handleGeneratePlan}
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
                    Generate Plan
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
