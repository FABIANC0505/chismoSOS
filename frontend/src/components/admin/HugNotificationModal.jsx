import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, X, CheckCircle, Clock, Share2, Eye, Sparkles, Send } from 'lucide-react';

export default function HugNotificationModal({ 
  isOpen, 
  onClose, 
  experiences = [], 
  onLivePreview, 
  onSelectExperience,
  isCelebration = false 
}) {
  useEffect(() => {
    if (isOpen && isCelebration) {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ff758f', '#c9184a', '#dfb15b', '#f4d188', '#ffffff']
      });
    }
  }, [isOpen, isCelebration]);

  if (!isOpen) return null;

  const experiencesWithHugs = experiences.filter(e => (e.hug_count || 0) > 0);
  const totalHugs = experiences.reduce((acc, e) => acc + (e.hug_count || 0), 0);

  const formatHugDate = (dateStr) => {
    if (!dateStr) return 'Recientemente';
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(date);
    } catch {
      return 'Recientemente';
    }
  };

  return (
    <div className="modal-backdrop" id="hug-notification-modal-backdrop" onClick={onClose}>
      <div 
        className="hug-modal-dialog glass-panel animate-enter" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="hug-modal-header">
          <div className="hug-header-title-box">
            <div className="hug-pulse-icon-wrap">
              <Heart size={26} fill="#ff4d6d" color="#ff4d6d" className="hug-heart-pulse" />
              <span className="hug-pulse-glow" />
            </div>
            <div>
              <span className="hug-super-badge">Detalle Entregado</span>
              <h2 className="hug-modal-title font-serif">¡Abrazos Recibidos! ❤️</h2>
            </div>
          </div>
          <button 
            type="button" 
            className="hug-close-btn" 
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Counter Summary */}
        <div className="hug-summary-bar glass-card">
          <div className="summary-left">
            <span className="summary-number">{totalHugs}</span>
            <div className="summary-labels">
              <strong className="text-gold">
                {totalHugs === 1 ? 'Abrazo de Amor y Amistad recibido' : 'Abrazos de Amor y Amistad recibidos'}
              </strong>
              <p className="summary-sub">
                {totalHugs > 0 
                  ? 'Tus destinatarios han leído tus cartas y confirmaron su entrega enviándote un abrazo.' 
                  : 'Aquí verás las confirmaciones en cuanto tus destinatarios lean sus cartas.'}
              </p>
            </div>
          </div>
          {totalHugs > 0 && (
            <div className="delivery-status-badge">
              <CheckCircle size={16} className="text-gold" />
              <span>Cartas Entregadas</span>
            </div>
          )}
        </div>

        {/* List of Hug Notifications */}
        <div className="hug-notifications-list">
          {experiencesWithHugs.length === 0 ? (
            <div className="hug-empty-state">
              <Heart size={44} className="text-gold" opacity={0.5} />
              <h4 className="font-serif">Aún no hay abrazos registrados</h4>
              <p>
                Comparte el enlace de tu carta por WhatsApp o mensaje directo. Cuando la persona termine de leerla y pulse <em>"Enviar un abrazo de vuelta"</em>, te llegará aquí la notificación inmediata con la confirmación de entrega.
              </p>
            </div>
          ) : (
            experiencesWithHugs.map((exp) => (
              <div key={exp.id} className="hug-item-card glass-card animate-enter">
                <div className="hug-item-top">
                  <div className="recipient-pill">
                    <Heart size={14} fill="#ff4d6d" color="#ff4d6d" />
                    <span>Para: <strong>{exp.recipient_name}</strong></span>
                  </div>
                  <div className="hug-time-pill">
                    <Clock size={12} />
                    <span>{formatHugDate(exp.last_hug_at)}</span>
                  </div>
                </div>

                <h3 className="hug-item-title font-serif">{exp.title}</h3>

                <div className="hug-item-message-box">
                  <p className="hug-item-message">
                    ✨ <strong>¡Carta recibida y leída!</strong> <strong>{exp.recipient_name}</strong> ha llegado al final de tu carta virtual y te envió <strong>{exp.hug_count} {exp.hug_count === 1 ? 'abrazo' : 'abrazos'} de vuelta</strong> para agradecerte por este detalle tan especial.
                  </p>
                </div>

                <div className="hug-item-actions">
                  {onLivePreview && (
                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() => {
                        onClose();
                        onLivePreview(exp);
                      }}
                    >
                      <Eye size={14} />
                      <span>Ver carta</span>
                    </button>
                  )}

                  {onSelectExperience && (
                    <button
                      type="button"
                      className="btn-gold btn-sm"
                      onClick={() => {
                        onClose();
                        onSelectExperience(exp.id);
                      }}
                    >
                      <span>Editar detalles</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="hug-modal-footer">
          <button 
            type="button" 
            className="btn-primary" 
            onClick={onClose}
            style={{ width: '100%' }}
          >
            <span>¡Qué alegría! Continuar con una sonrisa 😊</span>
          </button>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(10, 2, 4, 0.78);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .hug-modal-dialog {
          width: 100%;
          max-width: 580px;
          border-radius: var(--radius-lg);
          padding: 2rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%), rgba(26, 5, 9, 0.94);
          backdrop-filter: blur(28px) saturate(180%);
          -webkit-backdrop-filter: blur(28px) saturate(180%);
          border: 1.5px solid var(--glass-border-highlight);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.9), 0 0 35px rgba(255, 77, 109, 0.25);
          max-height: 90vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .hug-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--glass-border);
          padding-bottom: 1rem;
        }

        .hug-header-title-box {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .hug-pulse-icon-wrap {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 77, 109, 0.15);
          border: 1px solid rgba(255, 77, 109, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hug-heart-pulse {
          animation: heartBeat 1.4s infinite ease-in-out;
        }

        .hug-pulse-glow {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid rgba(255, 77, 109, 0.4);
          animation: rippleEffect 2s infinite cubic-bezier(0.1, 0.8, 0.3, 1);
        }

        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.18); }
        }

        @keyframes rippleEffect {
          0% { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        .hug-super-badge {
          display: inline-block;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--gold-400);
          font-weight: 600;
        }

        .hug-modal-title {
          font-size: 1.45rem;
          color: #fff;
          margin: 0;
        }

        .hug-close-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--glass-border);
          color: #fff;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .hug-close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.08);
        }

        .hug-summary-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          background: rgba(255, 77, 109, 0.1);
          border: 1px solid rgba(255, 77, 109, 0.25);
          border-radius: var(--radius-md);
          gap: 1rem;
        }

        .summary-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .summary-number {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--ruby-400);
          font-family: var(--font-serif);
          line-height: 1;
        }

        .summary-labels strong {
          display: block;
          font-size: 0.95rem;
        }

        .summary-sub {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-top: 0.15rem;
          line-height: 1.3;
        }

        .delivery-status-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(223, 177, 91, 0.15);
          border: 1px solid var(--gold-400);
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          color: var(--gold-300);
          font-weight: 600;
          white-space: nowrap;
        }

        .hug-notifications-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 45vh;
          overflow-y: auto;
          padding-right: 0.25rem;
        }

        .hug-empty-state {
          text-align: center;
          padding: 2rem 1rem;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .hug-empty-state h4 {
          color: #fff;
          font-size: 1.15rem;
        }

        .hug-empty-state p {
          font-size: 0.88rem;
          max-width: 400px;
          line-height: 1.5;
        }

        .hug-item-card {
          padding: 1.15rem;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          transition: var(--transition-smooth);
        }

        .hug-item-card:hover {
          border-color: rgba(255, 77, 109, 0.45);
          background: rgba(255, 255, 255, 0.07);
        }

        .hug-item-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.82rem;
        }

        .recipient-pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #fff;
        }

        .hug-time-pill {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--text-muted);
          font-size: 0.78rem;
        }

        .hug-item-title {
          font-size: 1.1rem;
          color: var(--gold-300);
          margin: 0;
        }

        .hug-item-message-box {
          background: rgba(0, 0, 0, 0.25);
          padding: 0.75rem 0.9rem;
          border-radius: var(--radius-sm);
          border-left: 3px solid var(--ruby-400);
        }

        .hug-item-message {
          font-size: 0.85rem;
          color: #fff;
          line-height: 1.45;
          margin: 0;
        }

        .hug-item-actions {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          justify-content: flex-end;
          margin-top: 0.25rem;
        }

        .hug-modal-footer {
          margin-top: 0.5rem;
        }

        @media (max-width: 600px) {
          .hug-modal-dialog {
            padding: 1.5rem 1.25rem;
          }
          .hug-summary-bar {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
