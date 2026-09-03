import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Plus, Heart, Share2, Edit3, Trash2, Eye, LogOut, Sparkles, 
  Check, Calendar, Users, ExternalLink, Loader2 
} from 'lucide-react';

export default function CreatorDashboard({ user, onLogout, onSelectExperience, onLivePreview }) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // New Experience Modal state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('Feliz Día del Amor y la Amistad');
  const [newRecipient, setNewRecipient] = useState('');
  const [newSender, setNewSender] = useState('');
  const [newNote, setNewNote] = useState('Tienes una carta especial de Amor y Amistad esperando por ti...');
  const [createError, setCreateError] = useState(null);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const list = await api.getMyExperiences();
      setExperiences(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newRecipient.trim() || !newSender.trim()) {
      setCreateError('Por favor especifica para quién es la carta y de parte de quién.');
      return;
    }

    setCreating(true);
    setCreateError(null);
    try {
      const created = await api.createExperience({
        title: newTitle,
        recipient_name: newRecipient,
        sender_name: newSender,
        envelope_note: newNote
      });
      setShowNewModal(false);
      // Reset
      setNewRecipient('');
      setNewSender('');
      fetchExperiences();
      // Directly open the editor for this new experience!
      onSelectExperience(created.id);
    } catch (err) {
      setCreateError(err.message || 'Error al crear la experiencia.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta carta de Amor y Amistad?')) return;
    try {
      await api.deleteExperience(id);
      fetchExperiences();
    } catch (err) {
      alert(err.message || 'Error al eliminar.');
    }
  };

  const handleCopyLink = (exp) => {
    const shareUrl = `${window.location.origin}/?slug=${exp.slug}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(exp.id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <div className="dashboard-container animate-enter" id="creator-dashboard-screen">
      {/* Top Bar */}
      <header className="dashboard-topbar glass-panel">
        <div className="brand-badge">
          <Heart size={24} fill="#ff4d6d" color="#ff4d6d" />
          <div>
            <h1 className="brand-name font-serif">chismOSOS</h1>
            <span className="brand-tag">Amor y Amistad 2026</span>
          </div>
        </div>

        <div className="user-profile-bar">
          <span className="user-greeting">
            Hola, <strong>{user?.username}</strong>
          </span>
          <button type="button" className="btn-secondary btn-sm" onClick={onLogout} id="btn-logout">
            <LogOut size={15} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <span className="hero-badge">
            <Sparkles size={14} className="text-gold" />
            14 de Septiembre • Colombia
          </span>
          <h2 className="hero-title font-serif">Panel de Personalización</h2>
          <p className="hero-desc">
            Crea detalles únicos tipo carta virtual: sobres con apertura interactiva, cuadros de decisiones y carruseles con fotos y mensajes de hasta 250 palabras.
          </p>
        </div>

        <button
          type="button"
          id="btn-create-experience-open"
          className="btn-primary create-btn"
          onClick={() => setShowNewModal(true)}
        >
          <Plus size={20} />
          <span>Crear Nueva Carta</span>
        </button>
      </section>

      {/* Experiences Grid */}
      <section className="dashboard-list-section">
        <h3 className="section-title font-serif">Tus Cartas Creadas ({experiences.length})</h3>

        {loading ? (
          <div className="loading-state">
            <Loader2 size={32} className="spinner text-gold" />
            <p>Cargando tus cartas de amor y amistad...</p>
          </div>
        ) : experiences.length === 0 ? (
          <div className="empty-state glass-panel">
            <Heart size={48} className="empty-icon text-gold" />
            <h4 className="font-serif empty-title">Aún no has creado ninguna carta</h4>
            <p className="empty-sub">
              Empieza ahora mismo creando un detalle inolvidable para tu pareja, mejor amig@ o esa persona especial.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setShowNewModal(true)}
            >
              <Plus size={18} />
              <span>Crear mi primera carta</span>
            </button>
          </div>
        ) : (
          <div className="experiences-grid">
            {experiences.map((exp) => {
              const cardCount = exp.cards ? exp.cards.length : 0;
              const stepCount = exp.selection_steps ? exp.selection_steps.length : 0;
              const isCopied = copiedId === exp.id;

              return (
                <div key={exp.id} className="experience-card glass-panel" id={`exp-card-${exp.id}`}>
                  <div className="card-top">
                    <span className="card-recipient-tag">
                      Para: <strong>{exp.recipient_name}</strong>
                    </span>
                    <span className="card-from-tag">De: {exp.sender_name}</span>
                  </div>

                  <h4 className="card-title font-serif">{exp.title}</h4>
                  
                  <div className="card-stats">
                    <span className="stat-pill">
                      🖼️ {cardCount} {cardCount === 1 ? 'Foto/Detalle' : 'Fotos/Detalles'}
                    </span>
                    <span className="stat-pill">
                      ❓ {stepCount} {stepCount === 1 ? 'Pregunta' : 'Preguntas'}
                    </span>
                  </div>

                  <p className="card-note-preview">
                    "{exp.envelope_note || 'Sin nota de sobre'}"
                  </p>

                  <div className="card-actions-bar">
                    <div className="card-buttons-main">
                      <button
                        type="button"
                        className="btn-gold btn-sm action-btn"
                        onClick={() => onSelectExperience(exp.id)}
                        title="Personalizar tarjetas y textos"
                      >
                        <Edit3 size={14} />
                        <span>Editar</span>
                      </button>

                      <button
                        type="button"
                        className="btn-secondary btn-sm action-btn"
                        onClick={() => onLivePreview(exp)}
                        title="Ver como lo verá el destinatario"
                      >
                        <Eye size={14} />
                        <span>Ver</span>
                      </button>

                      <button
                        type="button"
                        className="btn-primary btn-sm action-btn"
                        onClick={() => handleCopyLink(exp)}
                        title="Copiar enlace para enviar por WhatsApp"
                      >
                        {isCopied ? <Check size={14} /> : <Share2 size={14} />}
                        <span>{isCopied ? '¡Copiado!' : 'Compartir'}</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      className="icon-btn text-danger action-delete-btn"
                      onClick={() => handleDelete(exp.id)}
                      title="Eliminar carta"
                      aria-label="Eliminar carta"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Create Modal */}
      {showNewModal && (
        <div className="modal-backdrop">
          <div className="create-modal glass-panel animate-enter">
            <div className="modal-header">
              <h3 className="modal-title font-serif">Crear Nueva Carta de Amor y Amistad</h3>
              <p className="modal-sub">Personaliza los nombres iniciales y la dedicatoria del sobre</p>
            </div>

            {createError && (
              <div className="dialog-error">
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="create-form">
              <div className="form-group">
                <label className="form-label" htmlFor="new-title">Título de la Experiencia</label>
                <input
                  id="new-title"
                  type="text"
                  className="form-input"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej. Feliz Día del Amor y la Amistad"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label" htmlFor="new-recipient">¿Para quién es? (Destinatario)</label>
                  <input
                    id="new-recipient"
                    type="text"
                    className="form-input"
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    placeholder="Ej. Camila, Mi personita favorita"
                    required
                    autoFocus
                  />
                </div>

                <div className="form-group flex-1">
                  <label className="form-label" htmlFor="new-sender">¿De parte de quién? (Tu nombre)</label>
                  <input
                    id="new-sender"
                    type="text"
                    className="form-input"
                    value={newSender}
                    onChange={(e) => setNewSender(e.target.value)}
                    placeholder="Ej. Carlos"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="new-note">Mensaje en el exterior del sobre</label>
                <textarea
                  id="new-note"
                  className="form-textarea"
                  style={{ minHeight: '80px' }}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Ej. Tienes un detalle especial esperando por ti..."
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowNewModal(false)}
                  disabled={creating}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="btn-confirm-create-exp"
                  className="btn-primary"
                  disabled={creating}
                >
                  {creating ? <Loader2 size={16} className="spinner" /> : <Sparkles size={16} />}
                  <span>Crear y Personalizar Fotos</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem 1.25rem 4rem;
          position: relative;
          z-index: 1;
        }

        .dashboard-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.75rem;
          border-radius: var(--radius-lg);
          margin-bottom: 2.5rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.02) 100%), var(--glass-bg);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1.5px solid var(--glass-border);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), inset 0 1.5px 1.5px rgba(255, 255, 255, 0.32);
        }

        .brand-badge {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .brand-name {
          font-size: 1.45rem;
          color: #fff;
          line-height: 1;
        }

        .brand-tag {
          font-size: 0.72rem;
          color: var(--gold-400);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .user-profile-bar {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .user-greeting {
          font-size: 0.95rem;
          color: var(--rose-200);
        }

        /* Hero */
        .dashboard-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 3rem;
          background: linear-gradient(135deg, rgba(86, 17, 33, 0.65) 0%, rgba(35, 8, 14, 0.5) 100%);
          backdrop-filter: blur(22px) saturate(160%);
          -webkit-backdrop-filter: blur(22px) saturate(160%);
          border: 1.5px solid rgba(244, 209, 136, 0.35);
          padding: 2.5rem;
          border-radius: var(--radius-lg);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), inset 0 1.5px 2px rgba(255, 255, 255, 0.28);
        }

        @media (max-width: 768px) {
          .dashboard-hero {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(244, 209, 136, 0.12);
          border: 1.5px solid rgba(244, 209, 136, 0.4);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.3);
          color: var(--gold-300);
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }

        .hero-title {
          font-size: clamp(1.8rem, 3.5vw, 2.4rem);
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .hero-desc {
          color: var(--rose-100);
          font-size: 1rem;
          max-width: 650px;
          line-height: 1.5;
        }

        .create-btn {
          padding: 0.95rem 1.8rem;
          font-size: 1.05rem;
          flex-shrink: 0;
        }

        /* Section */
        .section-title {
          font-size: 1.5rem;
          color: #fff;
          margin-bottom: 1.5rem;
        }

        .experiences-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.75rem;
          width: 100%;
        }

        @media (max-width: 480px) {
          .experiences-grid {
            grid-template-columns: 1fr;
          }
        }

        .experience-card {
          border-radius: var(--radius-md);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%), rgba(43, 8, 17, 0.65);
          backdrop-filter: blur(20px) saturate(150%);
          -webkit-backdrop-filter: blur(20px) saturate(150%);
          border: 1.5px solid var(--glass-border);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), inset 0 1.5px 1.5px rgba(255, 255, 255, 0.28);
          transition: var(--transition-smooth);
          overflow: hidden;
          box-sizing: border-box;
          width: 100%;
        }

        .experience-card:hover {
          border-color: var(--glass-border-highlight);
          transform: translateY(-4px);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.5), 0 0 25px rgba(255, 77, 109, 0.3), inset 0 1.5px 2px rgba(255, 255, 255, 0.42);
        }

        .card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
        }

        .card-recipient-tag {
          color: var(--gold-300);
        }

        .card-from-tag {
          color: var(--text-muted);
        }

        .card-title {
          font-size: 1.3rem;
          color: #fff;
          line-height: 1.3;
        }

        .card-stats {
          display: flex;
          gap: 0.75rem;
        }

        .stat-pill {
          background: rgba(255, 255, 255, 0.08);
          border: 1.2px solid rgba(255, 255, 255, 0.22);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.2);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          color: var(--rose-200);
        }

        .card-note-preview {
          font-size: 0.88rem;
          color: var(--text-muted);
          font-style: italic;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.65rem 0.9rem;
          border-radius: var(--radius-sm);
        }

        .card-actions-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.6rem;
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          width: 100%;
          box-sizing: border-box;
        }

        .card-buttons-main {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.45rem;
          flex: 1;
          min-width: 0;
        }

        .action-btn {
          padding: 0.42rem 0.75rem !important;
          font-size: 0.8rem !important;
          gap: 0.3rem !important;
          white-space: nowrap;
          border-radius: var(--radius-full);
        }

        .action-delete-btn {
          flex-shrink: 0;
          margin-left: auto;
          border-radius: var(--radius-sm);
          background: rgba(231, 76, 60, 0.12);
          border: 1.2px solid rgba(231, 76, 60, 0.35);
        }

        .action-delete-btn:hover {
          background: rgba(231, 76, 60, 0.3) !important;
          border-color: #ff6b6b;
          transform: scale(1.08);
        }

        .empty-state {
          border-radius: var(--radius-lg);
          padding: 4rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          border: 1.5px solid var(--glass-border);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%), var(--glass-bg);
          box-shadow: inset 0 1.5px 1.5px rgba(255, 255, 255, 0.3);
        }

        .empty-title {
          font-size: 1.6rem;
          color: #fff;
        }

        .empty-sub {
          color: var(--text-muted);
          max-width: 450px;
          line-height: 1.5;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 4rem 0;
          color: var(--rose-200);
        }

        /* Modal */
        .create-modal {
          width: 100%;
          max-width: 540px;
          border-radius: var(--radius-lg);
          padding: 2.25rem 2rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.02) 100%), rgba(26, 5, 9, 0.88);
          backdrop-filter: blur(26px) saturate(170%);
          -webkit-backdrop-filter: blur(26px) saturate(170%);
          border: 1.5px solid var(--glass-border);
          box-shadow: 0 30px 70px rgba(0, 0, 0, 0.8), inset 0 1.5px 2px rgba(255, 255, 255, 0.35);
        }

        .modal-header {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--glass-border);
        }

        .modal-title {
          font-size: 1.5rem;
          color: #fff;
          margin-bottom: 0.25rem;
        }

        .modal-sub {
          font-size: 0.88rem;
          color: var(--text-muted);
        }

        .modal-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--glass-border);
        }
      `}</style>
    </div>
  );
}
