import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { content as contentAPI } from '../api';
import { Grid3x3, List, Plus, Search, Filter, Trash2 } from 'lucide-react';

export default function ContentLibrary() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    platform: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    loadContent();
  }, [filters]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const res = await contentAPI.list(filters);
      setContentList(res.data);
    } catch (err) {
      console.error('Failed to load content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contentId) => {
    if (confirm('Delete this content?')) {
      try {
        await contentAPI.delete(contentId);
        setContentList(contentList.filter(c => c.id !== contentId));
      } catch (err) {
        console.error('Failed to delete:', err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-900 text-green-100';
      case 'scheduled':
        return 'bg-blue-900 text-blue-100';
      case 'draft':
        return 'bg-beheard-hover text-beheard-text-secondary';
      default:
        return 'bg-beheard-card text-beheard-text-secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Content Library</h1>
        <button
          onClick={() => navigate('/content/new')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New
        </button>
      </div>

      {/* Filters and view toggle */}
      <div className="mb-6 space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-beheard-text-tertiary" />
            <input
              type="text"
              placeholder="Search content..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-9"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="text-sm"
          >
            <option value="">All Types</option>
            <option value="Social Post">Social Post</option>
            <option value="Blog">Blog</option>
            <option value="Email">Email</option>
            <option value="Ad Copy">Ad Copy</option>
          </select>

          <select
            value={filters.platform}
            onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))}
            className="text-sm"
          >
            <option value="">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="text-sm"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-beheard ${
              viewMode === 'grid'
                ? 'bg-beheard-lime text-beheard-black'
                : 'bg-beheard-card text-beheard-text'
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-beheard ${
              viewMode === 'list'
                ? 'bg-beheard-lime text-beheard-black'
                : 'bg-beheard-card text-beheard-text'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-8 text-beheard-text-secondary">Loading...</div>
      ) : contentList.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-beheard-text-secondary mb-4">No content yet</p>
          <button
            onClick={() => navigate('/content/new')}
            className="btn-primary"
          >
            Create your first content
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {contentList.map(item => (
            <div
              key={item.id}
              onClick={() => navigate(`/content/${item.id}`)}
              className="card-hover cursor-pointer"
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.type}
                  className="w-full h-32 object-cover rounded-beheard mb-2"
                />
              )}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-2">
                    {typeof item.body === 'string' ? item.body : item.body[0]}
                  </p>
                  <p className="text-xs text-beheard-text-tertiary mt-1">{item.type}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="text-beheard-text-tertiary hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
                <span className="text-xs text-beheard-text-tertiary">{item.platform}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {contentList.map(item => (
            <div
              key={item.id}
              onClick={() => navigate(`/content/${item.id}`)}
              className="card-hover cursor-pointer flex items-center justify-between"
            >
              <div className="flex-1">
                <p className="font-medium">
                  {typeof item.body === 'string' ? item.body.substring(0, 60) : item.body[0].substring(0, 60)}...
                </p>
                <div className="flex gap-2 mt-1 text-xs text-beheard-text-tertiary">
                  <span>{item.type}</span>
                  <span>•</span>
                  <span>{item.platform}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="text-beheard-text-tertiary hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
