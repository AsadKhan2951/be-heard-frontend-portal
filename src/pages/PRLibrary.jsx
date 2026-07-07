import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronLeft, Filter, Trash2 } from 'lucide-react';
import api from '../api';

const PR_TYPES = {
  'press-release': 'Press Release',
  'media-pitch': 'Media Pitch',
  'brand-story': 'Brand Story',
  'crisis': 'Crisis',
  'thought-leadership': 'Thought Leadership'
};

export default function PRLibrary() {
  const navigate = useNavigate();
  const [prPieces, setPRPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadPRPieces();
  }, [filter]);

  const loadPRPieces = async () => {
    try {
      const params = filter !== 'all' ? { type: filter } : {};
      const response = await api.get('/pr', { params });
      setPRPieces(response.data);
    } catch (err) {
      console.error('Failed to load PR pieces:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (prId) => {
    if (!confirm('Delete this PR piece?')) return;
    try {
      await api.delete(`/pr/${prId}`);
      setPRPieces(prev => prev.filter(p => p.id !== prId));
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-[#1a1a1a] rounded">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">PR Library</h1>
        </div>
        <button
          onClick={() => navigate('/pr/new')}
          className="bg-[#BFFF00] text-black p-2 rounded hover:bg-[#a8e600]"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Filter */}
      <div className="border-b border-[#1a1a1a] p-4 overflow-x-auto">
        <div className="flex gap-2 whitespace-nowrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded font-medium transition ${
              filter === 'all'
                ? 'bg-[#BFFF00] text-black'
                : 'bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]'
            }`}
          >
            All
          </button>
          {Object.entries(PR_TYPES).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded font-medium transition ${
                filter === key
                  ? 'bg-[#BFFF00] text-black'
                  : 'bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* PR List */}
      <div className="p-4 space-y-3">
        {loading ? (
          <div className="text-center py-8 text-[#666]">Loading...</div>
        ) : prPieces.length === 0 ? (
          <div className="text-center py-8 text-[#666]">
            <p>No PR pieces yet</p>
            <button
              onClick={() => navigate('/pr/new')}
              className="text-[#BFFF00] hover:underline mt-2"
            >
              Create one now
            </button>
          </div>
        ) : (
          prPieces.map(pr => (
            <div
              key={pr.id}
              onClick={() => navigate(`/pr/${pr.id}`)}
              className="bg-[#111111] border border-[#1a1a1a] rounded p-4 cursor-pointer hover:border-[#2a2a2a] transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-[#1a1a1a] px-2 py-1 rounded">
                      {PR_TYPES[pr.type]}
                    </span>
                    <span className="text-xs text-[#666]">
                      {new Date(pr.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">{pr.title}</h3>
                  <p className="text-sm text-[#999] line-clamp-2">{pr.body}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(pr.id);
                  }}
                  className="p-2 hover:bg-[#1a1a1a] rounded text-[#999] hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
