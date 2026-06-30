import { useState } from 'react';
import logImg from '../assets/log.png';

export default function AdminLogin({ onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'forgot' | 'reset'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);

    try {
      const apiHost = window.location.hostname;
      const response = await fetch(`http://${apiHost}:5005/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('admin_is_logged_in', 'true');
        localStorage.setItem('admin_username', data.username);
        onLoginSuccess();
      } else {
        setError(data.message || 'Invalid username or password.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to connect to the administration server. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!username.trim()) {
      setError('Please enter your username.');
      return;
    }

    setIsLoading(true);

    try {
      const apiHost = window.location.hostname;
      const response = await fetch(`http://${apiHost}:5005/api/admin/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(data.message || 'Verification code sent successfully.');
        setMode('reset');
      } else {
        setError(data.message || 'Failed to send verification code.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to connect to the administration server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!username.trim() || !resetCode.trim() || !newPassword.trim()) {
      setError('All fields are required.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const apiHost = window.location.hostname;
      const response = await fetch(`http://${apiHost}:5005/api/admin/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, resetCode, newPassword }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage('Password reset successful. Please sign in with your new password.');
        setMode('login');
        setPassword('');
        setResetCode('');
        setNewPassword('');
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to connect to the administration server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 relative select-none font-sans overflow-hidden">
      {/* Dynamic abstract ambient backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neutral-900/40 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8 flex flex-col items-center justify-center">
          <img src={logImg} alt="MM Jewellery Logo" className="h-10 w-auto object-contain mb-1" />
          <span className="font-serif text-sm tracking-[0.2em] text-gold-400 font-semibold whitespace-nowrap">
            MM Jewellery
          </span>
          <p className="text-neutral-450 text-[10px] uppercase tracking-[0.15em] font-light mt-1">
            Administration Portal
          </p>
        </div>

        {/* Login/Reset Glassmorphism Box */}
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 md:p-10 shadow-2xl shadow-black/80 relative">
          {/* Subtle gold top border light */}
          <div className="absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent"></div>

          <h2 className="font-serif text-xl text-white font-medium mb-6 text-center">
            {mode === 'login' && 'Sign In'}
            {mode === 'forgot' && 'Reset Password'}
            {mode === 'reset' && 'Verification'}
          </h2>

          {error && (
            <div className="bg-red-950/40 border border-red-500/20 text-red-300 rounded-lg p-3 text-xs leading-relaxed mb-6 font-light">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 rounded-lg p-3 text-xs leading-relaxed mb-6 font-light">
              {successMessage}
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  disabled={isLoading}
                  className="w-full bg-black/60 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-gold-400/50 transition-colors"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setSuccessMessage('');
                      setMode('forgot');
                    }}
                    className="text-[11px] text-gold-400 hover:text-gold-300 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  disabled={isLoading}
                  className="w-full bg-black/60 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-gold-400/50 transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#aa7c11] hover:bg-gold-500 text-white font-medium text-sm tracking-widest uppercase py-3.5 rounded-lg shadow-lg hover:shadow-gold-500/10 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  'Access Portal'
                )}
              </button>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-5">
              <p className="text-xs text-neutral-400 leading-relaxed font-light mb-2">
                Enter your administrative username to receive a 6-digit password reset verification code on your registered email address.
              </p>
              
              {/* Username Input */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  disabled={isLoading}
                  className="w-full bg-black/60 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-gold-400/50 transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#aa7c11] hover:bg-gold-500 text-white font-medium text-sm tracking-widest uppercase py-3.5 rounded-lg shadow-lg hover:shadow-gold-500/10 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Code...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setSuccessMessage('');
                    setMode('login');
                  }}
                  className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  &larr; Back to Sign In
                </button>
              </div>
            </form>
          )}

          {mode === 'reset' && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-5">
              <p className="text-xs text-neutral-400 leading-relaxed font-light mb-2">
                A verification code has been dispatched. Please enter the 6-digit code below along with your new password.
              </p>

              {/* Reset Code Input */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  disabled={isLoading}
                  maxLength={6}
                  className="w-full bg-black/60 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white tracking-widest text-center placeholder-neutral-600 focus:outline-none focus:border-gold-400/50 transition-colors"
                />
              </div>

              {/* New Password Input */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-neutral-400 font-medium">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  disabled={isLoading}
                  className="w-full bg-black/60 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-gold-400/50 transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#aa7c11] hover:bg-gold-500 text-white font-medium text-sm tracking-widest uppercase py-3.5 rounded-lg shadow-lg hover:shadow-gold-500/10 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setSuccessMessage('');
                    setMode('login');
                  }}
                  className="text-xs text-neutral-450 hover:text-white transition-colors cursor-pointer"
                >
                  &larr; Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* Go Back Link */}
          <div className="text-center mt-6">
            <a href="/" className="text-neutral-500 hover:text-neutral-300 text-xs tracking-wider transition-colors">
              &larr; Return to main site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
