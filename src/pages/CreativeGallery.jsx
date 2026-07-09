import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Trash2, Plus } from 'lucide-react';
import api from '../api';

export default function CreativeGallery() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const response = await api.get('/creative/gallery');
      setImages(response.data);
    } catch (err) {
      console.error('Failed to load gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!confirm('Delete this image?')) return;
    try {
      await api.delete(`/creative/${imageId}`);
      setImages(prev => prev.filter(img => img.id !== imageId));
      setSelectedImage(null);
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20 lg:pb-8">
      {/* Header */}
      <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-[#1a1a1a] rounded">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Image Gallery</h1>
        </div>
        <button
          onClick={() => navigate('/creative')}
          className="bg-[#BFFF00] text-black p-2 rounded hover:bg-[#a8e600]"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="text-center py-8 text-[#666]">Loading gallery...</div>
        ) : images.length === 0 ? (
          <div className="text-center py-8 text-[#666]">
            <p>No images yet</p>
            <button
              onClick={() => navigate('/creative')}
              className="text-[#BFFF00] hover:underline mt-2"
            >
              Create one now
            </button>
          </div>
        ) : (
          <>
            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
              {images.map(image => (
                <div
                  key={image.id}
                  onClick={() => setSelectedImage(image)}
                  className="aspect-square bg-[#111111] border border-[#1a1a1a] rounded overflow-hidden cursor-pointer hover:border-[#2a2a2a] transition group"
                >
                  <img
                    src={image.image_url}
                    alt="Gallery"
                    className="w-full h-full object-cover group-hover:opacity-80 transition"
                  />
                </div>
              ))}
            </div>

            {/* Image Detail Modal */}
            {selectedImage && (
              <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
                <div className="w-full bg-[#111111] border-t border-[#1a1a1a] rounded-t-lg p-4 max-h-[80vh] overflow-y-auto">
                  {/* Image */}
                  <img
                    src={selectedImage.image_url}
                    alt="Selected"
                    className="w-full rounded mb-4"
                  />

                  {/* Prompt */}
                  <div className="mb-4">
                    <div className="text-sm text-[#999] mb-2">Image Prompt</div>
                    <p className="text-sm text-[#ccc] bg-[#0a0a0a] p-3 rounded">
                      {selectedImage.prompt}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#0a0a0a] p-3 rounded">
                      <div className="text-xs text-[#666]">Created</div>
                      <div className="text-sm font-semibold">
                        {new Date(selectedImage.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    {selectedImage.brand_name && (
                      <div className="bg-[#0a0a0a] p-3 rounded">
                        <div className="text-xs text-[#666]">Brand</div>
                        <div className="text-sm font-semibold">{selectedImage.brand_name}</div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = selectedImage.image_url;
                        a.download = `creative-${selectedImage.id}.png`;
                        a.click();
                      }}
                      className="flex-1 bg-[#BFFF00] text-black font-semibold py-3 rounded hover:bg-[#a8e600]"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(selectedImage.id)}
                      className="bg-[#1a1a1a] border border-[#2a2a2a] text-white font-semibold py-3 px-4 rounded hover:bg-red-500/20 hover:border-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Close */}
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="w-full mt-3 bg-[#1a1a1a] border border-[#2a2a2a] text-white font-semibold py-3 rounded hover:bg-[#2a2a2a]"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
