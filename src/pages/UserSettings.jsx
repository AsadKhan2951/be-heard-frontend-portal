import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, LogOut, Trash2 } from 'lucide-react';
import { AuthContext } from '../AuthContext';
import api from '../api';

const PLANS = [
  { name: 'Starter', price: 49, features: ['5 brands', '100 posts/month', 'Basic analytics'] },
  { name: 'Pro', price: 149, features: ['Unlimited brands', '1000 posts/month', 'Real-time analytics', 'Priority support'] },
  { name: 'Enterprise', price: 399, features: ['Everything in Pro', 'Team collaboration', 'Custom integrations', 'Dedicated support'] }
];

export default function UserSettings() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [currentPlan, setCurrentPlan] = useState('Pro');
  const [deleting, setDeleting] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure? This cannot be undone.')) return;

    setDeleting(true);
    try {
      await api.delete('/auth/account');
      logout();
      navigate('/login');
    } catch (err) {
      alert('Failed to delete account: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] p-4 flex items-center gap-3 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-[#1a1a1a] rounded">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">Settings</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          <div className="bg-[#111111] border border-[#1a1a1a] rounded p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#BFFF00] rounded-full flex items-center justify-center text-black font-bold">
                A
              </div>
              <div>
                <div className="font-semibold">Aamir Khan</div>
                <div className="text-sm text-[#666]">aamir@rad.io</div>
              </div>
            </div>
            <button className="text-[#BFFF00] hover:underline text-sm font-medium">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Plan Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Plan</h2>
          <div className="space-y-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                onClick={() => setCurrentPlan(plan.name)}
                className={`border rounded p-4 cursor-pointer transition ${
                  currentPlan === plan.name
                    ? 'border-[#BFFF00] bg-[#1a1a1a]'
                    : 'border-[#1a1a1a] hover:border-[#2a2a2a]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{plan.name}</div>
                  <div className="text-lg font-bold">${plan.price}</div>
                </div>
                <div className="text-xs text-[#999]">
                  {plan.features.join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Team</h2>
          <div className="bg-[#111111] border border-[#1a1a1a] rounded p-4">
            <div className="text-sm text-[#666] mb-3">Coming soon</div>
            <button className="text-[#BFFF00] hover:underline text-sm font-medium">
              Invite team members
            </button>
          </div>
        </div>

        {/* Integrations Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Integrations</h2>
          <div className="space-y-2">
            <div className="bg-[#111111] border border-[#1a1a1a] rounded p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">Meta (Instagram & Facebook)</div>
                <div className="text-sm text-[#666]">Connected</div>
              </div>
              <span className="text-xs bg-[#1a1a1a] px-2 py-1 rounded">Active</span>
            </div>
            <div className="bg-[#111111] border border-[#1a1a1a] rounded p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">Slack</div>
                <div className="text-sm text-[#666]">Coming soon</div>
              </div>
              <span className="text-xs bg-[#1a1a1a] px-2 py-1 rounded">Soon</span>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Data</h2>
          <button className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white font-semibold py-3 rounded hover:bg-[#2a2a2a]">
            Export Data as CSV
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white font-semibold py-3 rounded hover:bg-[#2a2a2a] flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </button>

        {/* Delete Account */}
        <button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="w-full bg-red-500/10 border border-red-500/30 text-red-400 font-semibold py-3 rounded hover:bg-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Trash2 size={18} />
          Delete Account
        </button>
      </div>
    </div>
  );
}
