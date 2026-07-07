import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { LogIn } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beheard-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl font-bold mb-2">
            <span className="text-beheard-lime">Be</span>
            <span className="text-beheard-text">Heard</span>
          </div>
          <p className="text-beheard-text-secondary">AI-powered marketing platform</p>
        </div>

        <form onSubmit={handleSubmit} className="card">
          <h2 className="text-2xl font-bold mb-6">Sign In</h2>

          {error && (
            <div className="bg-red-900 border border-red-700 rounded-beheard p-3 mb-4 text-red-100">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-beheard-text-secondary mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-beheard-text-secondary mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-beheard-text-secondary mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-beheard-lime hover:underline">
              Sign up
            </Link>
          </p>

          <div className="mt-6 pt-6 border-t border-beheard-border">
            <p className="text-beheard-text-tertiary text-sm mb-2">Demo credentials:</p>
            <p className="text-beheard-text-secondary text-sm">
              Email: <code className="bg-beheard-hover px-1 rounded">demo@beheard.ai</code>
            </p>
            <p className="text-beheard-text-secondary text-sm">
              Password: <code className="bg-beheard-hover px-1 rounded">demo123</code>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
