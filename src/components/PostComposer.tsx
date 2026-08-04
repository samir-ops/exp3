import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Save, Send, AlertTriangle, CheckCircle2, Hash, Briefcase, Globe } from 'lucide-react';
import { addPost } from '../store/postsSlice';
import { saveDraft } from '../store/draftsSlice';
import type { Platform } from '../types';

const PLATFORM_LIMITS: Record<Platform, number> = {
  twitter: 280,
  linkedin: 3000,
  facebook: 63206,
};

const PLATFORMS: { id: Platform; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'twitter',  label: 'Twitter',  icon: <Hash size={15} />,      color: 'twitter'  },
  { id: 'facebook', label: 'Facebook', icon: <Globe size={15} />,      color: 'facebook' },
  { id: 'linkedin', label: 'LinkedIn', icon: <Briefcase size={15} />,  color: 'linkedin' },
];

/* SVG ring character counter */
const CharRing: React.FC<{ count: number; limit: number }> = ({ count, limit }) => {
  const r = 13;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(count / limit, 1);
  const offset = circ - pct * circ;

  const state =
    pct >= 1   ? 'danger'  :
    pct >= 0.9 ? 'warning' : '';

  return (
    <div className="char-ring" aria-hidden="true">
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle className="char-ring-bg" cx="16" cy="16" r={r} />
        <circle
          className={`char-ring-fill ${state}`}
          cx="16" cy="16" r={r}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
    </div>
  );
};

const PostComposer: React.FC = () => {
  const dispatch = useDispatch();
  const [content, setContent]   = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['twitter']);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const charLimit = selectedPlatforms.length === 0
    ? 280
    : Math.min(...selectedPlatforms.map(p => PLATFORM_LIMITS[p]));

  const remaining  = charLimit - content.length;
  const isOverLimit = remaining < 0;
  const pct         = content.length / charLimit;
  const counterState =
    isOverLimit   ? 'danger'  :
    pct >= 0.9    ? 'warning' : '';

  const showFeedback = useCallback((type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 3500);
    return () => clearTimeout(t);
  }, [feedback]);

  const handlePublish = () => {
    if (selectedPlatforms.length === 0) {
      showFeedback('error', 'Please select at least one platform.');
      return;
    }
    if (!content.trim()) {
      showFeedback('error', 'Post content cannot be empty.');
      return;
    }
    if (isOverLimit) {
      showFeedback('error', 'Content exceeds the character limit for selected platforms.');
      return;
    }

    dispatch(addPost({
      id: Math.random().toString(36).substr(2, 9),
      content,
      platforms: selectedPlatforms,
      createdAt: new Date().toISOString(),
      status: 'published',
    }));

    showFeedback('success', '🎉 Post published successfully!');
    setContent('');
  };

  const handleSaveDraft = () => {
    if (!content.trim()) {
      showFeedback('error', 'Cannot save an empty draft.');
      return;
    }

    dispatch(saveDraft({
      id: Math.random().toString(36).substr(2, 9),
      content,
      platforms: selectedPlatforms,
      updatedAt: new Date().toISOString(),
    }));

    showFeedback('success', '✅ Draft saved locally!');
    setContent('');
  };

  return (
    <div className="composer-container">
      {/* Header */}
      <div className="composer-header">
        <h2>Compose New Post</h2>
        <p>Write once, publish everywhere — across your selected platforms.</p>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`feedback-alert ${feedback.type}`} role="alert">
          {feedback.type === 'error'
            ? <AlertTriangle size={16} />
            : <CheckCircle2 size={16} />
          }
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Platform Selector */}
      <div className="platform-selector">
        <label>Target Platforms</label>
        <div className="platform-buttons">
          {PLATFORMS.map(({ id, label, icon, color }) => (
            <button
              key={id}
              id={`platform-${id}`}
              aria-pressed={selectedPlatforms.includes(id)}
              className={`platform-btn ${selectedPlatforms.includes(id) ? `active ${color}` : ''}`}
              onClick={() => togglePlatform(id)}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="editor-area">
        <div className={`editor-box ${isOverLimit ? 'over-limit' : ''}`}>
          <textarea
            id="post-content"
            placeholder="What do you want to share with the world?"
            value={content}
            onChange={e => setContent(e.target.value)}
            className="composer-textarea"
            rows={7}
            aria-label="Post content"
          />
          <div className="editor-footer">
            <div className="char-progress-wrapper">
              <CharRing count={content.length} limit={charLimit} />
              <span
                className={`char-counter ${counterState}`}
                aria-live="polite"
                aria-label={`${Math.abs(remaining)} characters ${isOverLimit ? 'over limit' : 'remaining'}`}
              >
                {isOverLimit
                  ? `${Math.abs(remaining)} over limit`
                  : `${remaining} left`
                }
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Limit: {charLimit.toLocaleString()} chars
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="composer-actions">
        <button
          id="save-draft-btn"
          className="btn btn-secondary"
          onClick={handleSaveDraft}
          disabled={!content.trim()}
        >
          <Save size={16} />
          Save Draft
        </button>
        <button
          id="publish-btn"
          className="btn btn-primary"
          onClick={handlePublish}
          disabled={isOverLimit || !content.trim()}
          style={{ width: 'auto' }}
        >
          <Send size={16} />
          Publish Post
        </button>
      </div>
    </div>
  );
};

export default PostComposer;
