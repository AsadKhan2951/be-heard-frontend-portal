import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, BarChart2, Megaphone, Newspaper, Palette, Calendar } from 'lucide-react';
import Logo from '../Logo';

const FEATURES = [
  { icon: Sparkles, title: 'AI Content Generation', desc: 'Claude-powered captions, posts, threads, and scripts tailored to your brand voice.' },
  { icon: Megaphone, title: 'Campaign Planner', desc: 'Full campaign strategy with content calendar, KPIs, and key messages in minutes.' },
  { icon: BarChart2, title: 'Real Meta Analytics', desc: 'Live Instagram & Facebook insights via Meta Insights API — no mock data.' },
  { icon: Newspaper, title: 'PR Writer', desc: 'Press releases, media pitches, and brand stories written in your voice.' },
  { icon: Palette, title: 'Creative Studio', desc: 'AI image generation via Gemini for every post format — square, story, landscape.' },
  { icon: Calendar, title: 'Social Calendar', desc: 'Visual scheduling and direct publishing to Instagram and Facebook.' }
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a] max-w-6xl mx-auto">
        <Logo size="md" />
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 rounded-lg bg-[#BFFF00] text-[#0a0a0a] text-sm font-semibold hover:bg-[#a8e600] transition-colors"
        >
          Sign In
        </button>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#BFFF00]/30 bg-[#BFFF00]/5 text-[#BFFF00] text-xs font-medium mb-6">
          <Sparkles className="w-3 h-3" />
          AI-Powered Marketing Platform
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
          Your brand's voice,
          <br />
          <span className="text-[#BFFF00]">amplified by AI</span>
        </h1>
        <p className="text-lg text-[#888888] mb-8 max-w-xl mx-auto">
          Create content, run campaigns, generate images, write PR, and publish directly to Instagram and Facebook — all from one platform.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate('/signup')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#BFFF00] text-[#0a0a0a] font-semibold hover:bg-[#a8e600] transition-colors"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 rounded-xl border border-[#1a1a1a] text-[#f0f0f0] font-medium hover:border-[#2a2a2a] transition-colors"
          >
            View Demo
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">
          Everything your brand needs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-[#111111] border border-[#1a1a1a] rounded-lg p-5 hover:border-[#2a2a2a] transition-colors">
              <div className="w-9 h-9 rounded-lg bg-[#1a1a1a] flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 text-[#BFFF00]" />
              </div>
              <h3 className="text-sm font-semibold text-[#f0f0f0] mb-1.5">{title}</h3>
              <p className="text-xs text-[#888888] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 text-center">
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-lg p-10 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">Ready to be heard?</h2>
          <p className="text-sm text-[#888888] mb-6">Set up your brand in minutes. No credit card required.</p>
          <button
            onClick={() => navigate('/signup')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#BFFF00] text-[#0a0a0a] font-semibold hover:bg-[#a8e600] transition-colors"
          >
            Start for Free <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-[#1a1a1a] text-center">
        <p className="text-xs text-[#555555]">© 2025 BeHeard · AI Marketing Platform</p>
      </footer>
    </div>
  );
}
