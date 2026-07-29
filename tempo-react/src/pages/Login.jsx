import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DASHBOARD_ROUTE_BY_ROLE, setAuth } from '../lib/auth';
import { authenticateUser } from '../lib/mockAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await authenticateUser(email, password);
      
      if (result.success) {
        // Set authentication data - role is determined by backend
        setAuth(result.user);
        
        // Navigate to appropriate dashboard based on user's role
        const dashboardRoute = DASHBOARD_ROUTE_BY_ROLE[result.user.role] || '/';
        navigate(dashboardRoute);
      }
    } catch (authError) {
      setError(authError.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login">
      <form className="form mx-auto mt-24" onSubmit={onSubmit}>
        <h1 className="section-title">Login</h1>
        
        {error && (
          <div className="error-message error-message--login" role="alert">
            <div className="error-message__icon" aria-hidden="true">⚠️</div>
            <p className="error-message__text">{error}</p>
          </div>
        )}

        <label className="form__field">
          <span className="form__label">Email</span>
          <input 
            type="email" 
            required 
            placeholder="you@example.com" 
            className="form__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </label>
        
        <label className="form__field">
          <span className="form__label">Password</span>
          <input 
            type="password" 
            required 
            placeholder="••••••••" 
            className="form__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </label>
        
        <button 
          className="button-login" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        {/* Demo Credentials Helper */}
        <div className="demo-credentials">
          <h3 className="demo-credentials__title">Demo Credentials</h3>
          <div className="demo-credentials__grid">
            <div className="demo-credentials__item">
              <strong>Admin:</strong>
              <div>admin@tempo-music.edu / admin123</div>
            </div>
            <div className="demo-credentials__item">
              <strong>Teacher:</strong>
              <div>teacher@tempo-music.edu / teacher123</div>
            </div>
            <div className="demo-credentials__item">
              <strong>Student:</strong>
              <div>student@tempo-music.edu / student123</div>
            </div>
            <div className="demo-credentials__item">
              <strong>Parent:</strong>
              <div>parent@tempo-music.edu / parent123</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}