import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle, Loader2, User, Lock, Zap } from 'lucide-react';
import { loginUser } from '../services/authService';
import { useAuth } from '../AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser(username, password);
      login(response.token, response.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <Zap size={22} color="white" />
          </div>
          <span className="auth-logo-text">PostComposer</span>
        </div>

        {/* Header */}
        <div className="auth-header">
          <h1>Welcome back</h1>
          <p>
            Sign in with&nbsp;
            <code>admin</code>&nbsp;/&nbsp;<code>admin</code>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="error-message" role="alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="username"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                disabled={isLoading}
                autoComplete="username"
                autoFocus
              />
              <User size={15} className="input-icon" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="current-password"
              />
              <Lock size={15} className="input-icon" />
            </div>
          </div>

          <button
            type="submit"
            id="login-submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ marginTop: '0.5rem' }}
          >
            {isLoading ? (
              <Loader2 size={18} className="loading-spinner" />
            ) : (
              <LogIn size={18} />
            )}
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
