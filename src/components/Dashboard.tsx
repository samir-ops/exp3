import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { LogOut, PenSquare, FolderOpen, Zap } from 'lucide-react';
import PostComposer from './PostComposer';
import DraftList from './DraftList';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'composer' | 'drafts'>('composer');

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'A';

  return (
    <div className="dashboard-layout">
      {/* ── Navbar ── */}
      <nav className="navbar" aria-label="Main navigation">
        <div className="nav-container">
          {/* Brand */}
          <div className="nav-brand">
            <div className="nav-brand-icon">
              <Zap size={18} color="white" />
            </div>
            <span className="nav-brand-name">PostComposer</span>
          </div>

          {/* Center tabs */}
          <div className="nav-center" role="tablist">
            <button
              role="tab"
              id="tab-composer"
              aria-selected={activeTab === 'composer'}
              className={`nav-tab ${activeTab === 'composer' ? 'active' : ''}`}
              onClick={() => setActiveTab('composer')}
            >
              <PenSquare size={15} />
              Compose
            </button>
            <button
              role="tab"
              id="tab-drafts"
              aria-selected={activeTab === 'drafts'}
              className={`nav-tab ${activeTab === 'drafts' ? 'active' : ''}`}
              onClick={() => setActiveTab('drafts')}
            >
              <FolderOpen size={15} />
              Drafts
            </button>
          </div>

          {/* Right side */}
          <div className="nav-right">
            <div className="user-chip">
              <div className="user-avatar">{initials}</div>
              <span>{user?.username}</span>
            </div>
            <button
              id="logout-btn"
              onClick={logout}
              className="btn-logout"
              aria-label="Logout"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="dashboard-main">
        {/* Sidebar (mobile: horizontal strip) */}
        <aside className="sidebar" aria-label="Sidebar navigation">
          <span className="sidebar-section-label">Navigation</span>
          <button
            className={`sidebar-btn ${activeTab === 'composer' ? 'active' : ''}`}
            onClick={() => setActiveTab('composer')}
          >
            <PenSquare size={16} />
            Compose Post
          </button>
          <button
            className={`sidebar-btn ${activeTab === 'drafts' ? 'active' : ''}`}
            onClick={() => setActiveTab('drafts')}
          >
            <FolderOpen size={16} />
            Drafts &amp; Posts
          </button>
        </aside>

        {/* Content */}
        <div className="content-area">
          <div className="panel" role="tabpanel">
            {activeTab === 'composer' ? <PostComposer /> : <DraftList />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
