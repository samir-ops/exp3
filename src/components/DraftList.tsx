import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, FileText } from 'lucide-react';
import { selectAllDrafts, removeDraft } from '../store/draftsSlice';

const DraftList: React.FC = () => {
  const dispatch = useDispatch();
  const drafts = useSelector(selectAllDrafts);

  const sortedDrafts = useMemo(() => {
    return [...drafts].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [drafts]);

  return (
    <div className="drafts-container">
      {/* Header */}
      <div className="drafts-header">
        <h2>Saved Drafts</h2>
        {sortedDrafts.length > 0 && (
          <span className="drafts-count">{sortedDrafts.length} draft{sortedDrafts.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* Empty state */}
      {sortedDrafts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FileText size={28} />
          </div>
          <h3>No drafts yet</h3>
          <p>Head to the Composer, write something great, and save it as a draft.</p>
        </div>
      ) : (
        <div className="drafts-grid">
          {sortedDrafts.map(draft => (
            <article key={draft.id} className="draft-card">
              {/* Delete button */}
              <div className="draft-actions">
                <button
                  className="btn-icon danger"
                  onClick={() => dispatch(removeDraft(draft.id))}
                  aria-label="Delete draft"
                  title="Delete draft"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Content preview */}
              <p className="draft-content">{draft.content}</p>

              {/* Footer */}
              <div className="draft-footer">
                <div className="platform-tags">
                  {draft.platforms.map(p => (
                    <span key={p} className={`tag ${p}`}>{p}</span>
                  ))}
                </div>
                <span className="date-tag" title={new Date(draft.updatedAt).toLocaleString()}>
                  {new Date(draft.updatedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(DraftList);
