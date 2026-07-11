import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '../Logo';

const CONTACT_EMAIL = 'wehearyou.studio@gmail.com';
const LAST_UPDATED = 'July 2026';

function Section({ title, children }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-[#f0f0f0] mb-2">{title}</h2>
      <div className="text-sm text-[#aaaaaa] leading-relaxed space-y-2">{children}</div>
    </section>
  );
}

export default function Privacy() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0f0f0]">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a] max-w-4xl mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <Logo size="md" />
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-[#888888] hover:text-[#f0f0f0] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </button>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-[#666666] mb-10">Last updated: {LAST_UPDATED}</p>

        <Section title="1. Introduction">
          <p>
            BeHeard ("we", "us", "our") is an AI-powered marketing platform that helps you create
            content, run campaigns, and publish to social media. This Privacy Policy explains what
            information we collect, how we use it, and the choices you have. By using BeHeard, you
            agree to the practices described here.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We collect the following information:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account information:</strong> your name, email address, and password (stored hashed).</li>
            <li><strong>Brand information:</strong> brand name, industry, website, voice, audience, competitors, logo, and preferences you provide during onboarding.</li>
            <li><strong>Content you create:</strong> posts, campaigns, PR pieces, and generated images.</li>
            <li><strong>Meta (Facebook/Instagram) data:</strong> if you connect your Meta account, we access your Facebook Page ID, Page access token, and linked Instagram business account ID in order to publish content and read post analytics on your behalf.</li>
            <li><strong>Usage data:</strong> basic technical information needed to operate the service.</li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          <ul className="list-disc pl-5 space-y-1">
            <li>To provide and operate the platform and its features.</li>
            <li>To generate marketing content and images using AI based on your inputs.</li>
            <li>To publish content and retrieve analytics from your connected Meta accounts, at your request.</li>
            <li>To authenticate you and keep your account secure.</li>
          </ul>
        </Section>

        <Section title="4. AI Processing">
          <p>
            To generate content and images, the information you submit (such as topics, brand
            details, and prompts) is sent to third-party AI providers — <strong>Anthropic (Claude)</strong> for
            text and <strong>Google (Gemini)</strong> for images. These providers process the data to return
            results and are governed by their own privacy policies. We do not use your data to train
            our own models.
          </p>
        </Section>

        <Section title="5. Meta Platform Integration">
          <p>
            When you connect a Meta account, we request only the permissions required to publish
            posts and read post insights (such as <em>pages_show_list</em>, <em>pages_manage_posts</em>,
            <em> pages_read_engagement</em>, <em>instagram_basic</em>, and <em>instagram_content_publish</em>).
            Access tokens are stored securely and are used solely to perform actions you initiate.
            You can disconnect at any time, which stops all access.
          </p>
        </Section>

        <Section title="6. How We Share Information">
          <p>
            We do not sell your personal information. We share data only with the service providers
            needed to operate BeHeard: Anthropic and Google (AI generation), Meta (publishing and
            analytics you request), and our database/hosting providers (MongoDB Atlas, Railway,
            Vercel). We may disclose information if required by law.
          </p>
        </Section>

        <Section title="7. Data Storage &amp; Security">
          <p>
            Your data is stored in MongoDB Atlas. Passwords are hashed with bcrypt and access is
            protected by signed authentication tokens (JWT). We take reasonable measures to protect
            your data, but no method of transmission or storage is 100% secure.
          </p>
        </Section>

        <Section title="8. Data Retention">
          <p>
            We retain your information for as long as your account is active. You can delete your
            account at any time from Settings, which permanently removes your user record, brands,
            content, campaigns, PR pieces, and generated images from our database.
          </p>
        </Section>

        <Section title="9. Your Rights">
          <p>
            You can access and update your information in the app, disconnect connected accounts, and
            delete your account and associated data. To exercise any privacy right or ask a question,
            contact us at the email below.
          </p>
        </Section>

        <Section title="10. Cookies &amp; Local Storage">
          <p>
            We use browser local storage to keep you signed in (your authentication token) and to
            remember your selected brand. We do not use third-party advertising cookies.
          </p>
        </Section>

        <Section title="11. Children's Privacy">
          <p>BeHeard is not intended for anyone under 16, and we do not knowingly collect data from children.</p>
        </Section>

        <Section title="12. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Material changes will be reflected by
            updating the "Last updated" date above.
          </p>
        </Section>

        <Section title="13. Contact Us">
          <p>
            Questions about this Privacy Policy? Email us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#BFFF00] hover:underline">{CONTACT_EMAIL}</a>.
          </p>
        </Section>
      </main>

      <footer className="px-6 py-6 border-t border-[#1a1a1a] text-center">
        <p className="text-xs text-[#555555]">© 2026 BeHeard · AI Marketing Platform</p>
      </footer>
    </div>
  );
}
