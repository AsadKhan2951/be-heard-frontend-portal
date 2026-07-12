import React, { useEffect } from 'react';
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

// Reveal elements marked with [data-reveal] as they scroll into view
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function Landing() {
  const navigate = useNavigate();
  useScrollReveal();

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-[#f0f0f0]">
      {/* Animated background decor */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="lp-orb absolute -top-40 left-1/2 -translate-x-1/2 w-[620px] h-[620px] rounded-full bg-[#BFFF00]/10 blur-[130px]" />
        <div className="lp-orb-slow absolute top-[42%] -left-40 w-[420px] h-[420px] rounded-full bg-[#BFFF00]/[0.06] blur-[110px]" />
        <div className="lp-orb absolute top-[72%] -right-40 w-[460px] h-[460px] rounded-full bg-[#BFFF00]/[0.05] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: 'radial-gradient(#1a1a1a 1px, transparent 1px)',
            backgroundSize: '34px 34px',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, black, transparent 72%)',
            maskImage: 'radial-gradient(ellipse at 50% 0%, black, transparent 72%)'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Nav */}
        <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0a0a]/70 border-b border-[#1a1a1a]">
          <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
            <Logo size="lg" />
            <button
              onClick={() => navigate('/login')}
              className="lp-shine px-4 py-2 rounded-lg bg-[#BFFF00] text-[#0a0a0a] text-sm font-semibold hover:bg-[#a8e600] transition-colors"
            >
              Sign In
            </button>
          </nav>
        </header>

        {/* Hero */}
        <section className="px-6 py-20 text-center max-w-3xl mx-auto">
          <div
            data-reveal
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#BFFF00]/30 bg-[#BFFF00]/5 text-[#BFFF00] text-xs font-medium mb-6"
          >
            <span className="lp-pulse-dot w-1.5 h-1.5 rounded-full bg-[#BFFF00]" />
            <Sparkles className="w-3 h-3" />
            AI-Powered Marketing Platform
          </div>
          <h1 data-reveal style={{ transitionDelay: '90ms' }} className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
            Your brand's voice,
            <br />
            <span className="lp-gradient-text">amplified by AI</span>
          </h1>
          <p data-reveal style={{ transitionDelay: '180ms' }} className="text-lg text-[#888888] mb-8 max-w-xl mx-auto">
            Create content, run campaigns, generate images, write PR, and publish directly to Instagram and Facebook — all from one platform.
          </p>
          <div data-reveal style={{ transitionDelay: '270ms' }} className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/signup')}
              className="group lp-shine lp-lift flex items-center gap-2 px-6 py-3 rounded-xl bg-[#BFFF00] text-[#0a0a0a] font-semibold hover:bg-[#a8e600] transition-colors"
            >
              Get Started <ArrowRight className="lp-arrow w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 rounded-xl border border-[#1a1a1a] text-[#f0f0f0] font-medium hover:border-[#BFFF00]/40 hover:bg-[#BFFF00]/5 transition-colors"
            >
              View Demo
            </button>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-16 max-w-5xl mx-auto">
          <h2 data-reveal className="text-2xl font-bold text-center mb-10">
            Everything your brand needs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                data-reveal
                style={{ transitionDelay: `${i * 80}ms` }}
                className="lp-card bg-[#111111] border border-[#1a1a1a] rounded-lg p-5"
              >
                <div className="lp-card-icon w-9 h-9 rounded-lg bg-[#1a1a1a] flex items-center justify-center mb-3">
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
          <div
            data-reveal
            className="lp-card relative overflow-hidden bg-[#111111] border border-[#1a1a1a] rounded-2xl p-10 max-w-xl mx-auto"
          >
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-[#BFFF00]/10 blur-[90px]" />
            <div className="relative">
              <h2 className="text-2xl font-bold mb-3">Ready to be heard?</h2>
              <p className="text-sm text-[#888888] mb-6">Set up your brand in minutes. No credit card required.</p>
              <button
                onClick={() => navigate('/signup')}
                className="group lp-shine lp-lift inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#BFFF00] text-[#0a0a0a] font-semibold hover:bg-[#a8e600] transition-colors"
              >
                Start for Free <ArrowRight className="lp-arrow w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-6 border-t border-[#1a1a1a] text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <button onClick={() => navigate('/privacy')} className="text-xs text-[#888888] hover:text-[#f0f0f0] transition-colors">Privacy Policy</button>
            <span className="text-[#333]">·</span>
            <button onClick={() => navigate('/terms')} className="text-xs text-[#888888] hover:text-[#f0f0f0] transition-colors">Terms of Service</button>
          </div>
          <p className="text-xs text-[#555555]">© 2026 BeHeard · AI Marketing Platform</p>
        </footer>
      </div>
    </div>
  );
}
