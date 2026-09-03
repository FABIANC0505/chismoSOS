import React, { useState } from 'react';
import { api } from '../../services/api';
import { Heart, Lock, User, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

export default function AuthModal({ onLoginSuccess, onClose }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        if (password.length < 6) {
          throw new Error("La contraseña debe tener al menos 6 caracteres.");
        }
        await api.register(username, password);
      } else {
        await api.login(username, password);
      }
      onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Error al autenticar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" id="auth-modal-overlay">
      <div className="auth-card glass-panel animate-enter">
        <div className="auth-header">
          <div className="auth-logo">
            <Heart size={32} fill="#ff4d6d" color="#ff4d6d" />
          </div>
          <h2 className="auth-title font-serif">
            {isRegister ? 'Crear Cuenta en chismoSOS' : 'Iniciar Sesión'}
          </h2>
          <p className="auth-subtitle">
            {isRegister 
              ? 'Regístrate para personalizar y enviar tus cartas de Amor y Amistad'
              : 'Accede a tu panel para gestionar tus detalles y recuerdos'}
          </p>
        </div>

        {error && (
          <div className="auth-alert-error" id="auth-error-msg">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="auth-username">Nombre de Usuario</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                id="auth-username"
                type="text"
                className="form-input with-icon"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej. cupido2026"
                required
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="auth-password">Contraseña</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="auth-password"
                type="password"
                className="form-input with-icon"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            id="btn-submit-auth"
            className="btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? <Loader2 size={18} className="spinner" /> : <Sparkles size={18} />}
            <span>{isRegister ? 'Registrarme y Comenzar' : 'Ingresar al Panel'}</span>
          </button>
        </form>

        <div className="auth-footer">
          <button
            type="button"
            className="toggle-auth-btn"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
          >
            {isRegister
              ? '¿Ya tienes una cuenta? Inicia sesión aquí'
              : '¿Aún no tienes cuenta? Regístrate gratis'}
          </button>

          {onClose && (
            <button type="button" className="btn-secondary btn-sm" onClick={onClose}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 2, 4, 0.85);
          backdrop-filter: blur(12px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .auth-card {
          width: 100%;
          max-width: 440px;
          border-radius: var(--radius-lg);
          padding: 2.5rem 2rem;
          border: 1.5px solid var(--glass-border);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.75);
        }

        .auth-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.75rem;
        }

        .auth-logo {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255, 77, 109, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 77, 109, 0.3);
        }

        .auth-title {
          font-size: 1.7rem;
          color: #fff;
        }

        .auth-subtitle {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .auth-alert-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(231, 76, 60, 0.18);
          border: 1px solid rgba(231, 76, 60, 0.4);
          color: #ff8b8b;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.88rem;
          margin-bottom: 1.25rem;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: var(--rose-200);
          pointer-events: none;
        }

        .form-input.with-icon {
          padding-left: 2.75rem;
        }

        .auth-submit-btn {
          width: 100%;
          padding: 0.9rem;
          font-size: 1rem;
          margin-top: 0.5rem;
        }

        .auth-footer {
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .toggle-auth-btn {
          background: none;
          border: none;
          color: var(--gold-300);
          font-size: 0.9rem;
          cursor: pointer;
          text-decoration: underline;
          transition: var(--transition-smooth);
        }

        .toggle-auth-btn:hover {
          color: #fff;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
