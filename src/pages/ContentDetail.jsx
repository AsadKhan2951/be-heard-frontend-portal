import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { content as contentAPI } from '../api';
import { ArrowLeft, Edit2, Share2, Trash2, Calendar } from 'lucide-react';

export default function ContentDetail() {
  const { contentId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedBody, setEditedBody] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContent();
  }, [contentId]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const res = await contentAPI.get(contentId);
      setItem(res.data);
      setEditedBody(typeof res.data.body === 'string' ? res.data.body : res.data.body[0]);
    } catch (err) {
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await contentAPI.update(contentId, { body: editedBody });
      setItem(prev => ({ ...prev, body: editedBody }));
      setEditing(false);
    } catch (err) {
      setError('Failed to save');
    }
  };

  const handlePublish = async (platform) => {
    try {
      setPublishing(true);
      await contentAPI.publish(contentId, platform);
      await loadContent();
    } catch (err) {
      setError('Failed to publish');
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Delete this content?')) {
      try {
        await contentAPI.delete(contentId);
        navigate('/content');
      } catch (err) {
        setError('Failed to delete');
      }
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-beheard-text-secondary">Loading...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-4">
        <div className="text-beheard-text-secondary">Content not found</div>
      </div>
    );
  }

  const bodyText = typeof item.body === 'string' ? item.body : item.body[0];
  const performance = item.performance || {};

  return (
    <div className="p-4 pb-80px">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/content')}
          className="flex items-center gap-2 text-beheard-text-secondary hover:text-beheard-text"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="btn-secondary flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="btn-secondary text-red-400 hover:bg-red-900"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-900 border border-red-700 rounded-beheard p-3 mb-4 text-red-100">
          {error}
        </div>
      )}

      {/* Content */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-beheard-text-secondary text-sm">{item.type}</p>
            <p className="text-beheard-text-secondary text-sm">{item.platform}</p>
          </div>
          <span className={`text-xs px-3 py-1 rounded-beheard ${
            item.status === 'published' ? 'bg-green-900 text-green-100' :
            item.status === 'scheduled' ? 'bg-blue-900 text-blue-100' :
            'bg-beheard-hover text-beheard-text-secondary'
          }`}>
            {item.status}
          </span>
        </div>

        {editing ? (
          <div className="space-y-3">
            <textarea
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              rows={6}
              className="w-full"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary flex-1"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-beheard-text whitespace-pre-wrap">{bodyText}</p>
        )}
      </div>

      {/* Image */}
      {item.image_url && (
        <div className="card mb-6">
          <p className="text-beheard-text-secondary text-sm mb-3">Generated Image</p>
          <img
            src={item.image_url}
            alt="Generated"
            className="w-full rounded-beheard"
          />
        </div>
      )}

      {/* Performance metrics */}
      {item.status === 'published' && Object.keys(performance).length > 0 && (
        <div className="card mb-6">
          <h3 className="font-semibold mb-3">Performance</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(performance).map(([key, value]) => (
              <div key={key} className="bg-beheard-hover p-3 rounded-beheard">
                <p className="text-beheard-text-secondary text-xs mb-1 capitalize">
                  {key.replace(/_/g, ' ')}
                </p>
                <p className="text-lg font-bold text-beheard-lime">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {item.status === 'draft' && (
        <div className="space-y-2">
          <button
            onClick={() => handlePublish('instagram')}
            disabled={publishing}
            className="btn-primary w-full"
          >
            Publish to Instagram
          </button>
          <button
            onClick={() => handlePublish('facebook')}
            disabled={publishing}
            className="btn-primary w-full"
          >
            Publish to Facebook
          </button>
          <button
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Schedule for Later
          </button>
        </div>
      )}

      {item.status === 'scheduled' && (
        <div className="card text-center py-4">
          <p className="text-beheard-text-secondary text-sm">
            Scheduled for {new Date(item.scheduled_for).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
