import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import CardEditorModal from './CardEditorModal';
import StepEditorModal from './StepEditorModal';
import { 
  ArrowLeft, Eye, Share2, Plus, Edit2, Trash2, ArrowUp, ArrowDown, 
  Save, Sparkles, Heart, HelpCircle, Check, Copy, ExternalLink, Loader2 
} from 'lucide-react';

export default function ExperienceEditor({ experienceId, onBack, onLivePreview }) {
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingGeneral, setSavingGeneral] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [envelopeNote, setEnvelopeNote] = useState('');

  // Modals
  const [cardToEdit, setCardToEdit] = useState(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [stepToEdit, setStepToEdit] = useState(null);
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);

  const fetchExperience = async () => {
    try {
      setLoading(true);
      const data = await api.getExperience(experienceId);
      setExperience(data);
      setTitle(data.title || '');
      setRecipientName(data.recipient_name || '');
      setSenderName(data.sender_name || '');
      setEnvelopeNote(data.envelope_note || '');
    } catch (err) {
      alert(err.message || 'Error al cargar la experiencia.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, [experienceId]);

  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    setSavingGeneral(true);
    setSaveSuccess(false);
    try {
      const updated = await api.updateExperience(experienceId, {
        title,
        recipient_name: recipientName,
        sender_name: senderName,
        envelope_note: envelopeNote
      });
      setExperience(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Error al guardar los datos generales.');
    } finally {
      setSavingGeneral(false);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm('¿Deseas eliminar esta tarjeta de recuerdo?')) return;
    try {
      await api.deleteCard(cardId);
      fetchExperience();
    } catch (err) {
      alert(err.message || 'Error al eliminar la tarjeta.');
    }
  };

  const handleDeleteStep = async (stepId) => {
    if (!window.confirm('¿Deseas eliminar esta pregunta interactiva?')) return;
    try {
      await api.deleteStep(stepId);
      fetchExperience();
    } catch (err) {
      alert(err.message || 'Error al eliminar la pregunta.');
    }
  };

  const handleCopyShareLink = () => {
    if (!experience) return;
    const shareUrl = `${window.location.origin}/?slug=${experience.slug}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  if (loading) {
    return (
      <div className="editor-loading">
        <Loader2 size={36} className="spinner text-gold" />
        <p>Cargando detalles de tu carta...</p>
      </div>
    );
  }

  if (!experience) return null;

  const cards = experience.cards || [];
  const steps = experience.selection_steps || [];

  return (
    <div className="experience-editor-layout animate-enter" id="experience-editor-screen">
      {/* Top Navbar */}
      <header className="editor-navbar glass-panel">
        <div className="navbar-left">
          <button type="button" className="btn-secondary btn-sm" onClick={onBack}>
            <ArrowLeft size={16} />
            <span>Mis Cartas</span>
          </button>
          <div className="editor-title-box">
            <span className="editor-badge">Editor de Experiencia</span>
            <h2 className="editor-heading font-serif">{experience.title}</h2>
          </div>
        </div>

        <div className="navbar-right">
          <button
            type="button"
            className="btn-gold btn-sm"
            onClick={() => onLivePreview(experience)}
            id="btn-live-preview"
          >
            <Eye size={16} />
            <span>Previsualizar</span>
          </button>

          <button
            type="button"
            className="btn-primary btn-sm"
            onClick={handleCopyShareLink}
            id="btn-share-link"
          >
            {copiedLink ? <Check size={16} /> : <Share2 size={16} />}
            <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
          </button>
        </div>
      </header>

      {/* Editor Content Area */}
      <main className="editor-content-grid">
        {/* Left Column: General Configuration */}
        <section className="editor-col general-settings-col">
          <div className="settings-panel glass-panel">
            <div className="panel-header">
              <Heart size={20} className="text-gold" />
              <h3 className="panel-title font-serif">1. Datos del Sobre y Mensaje</h3>
            </div>

            <form onSubmit={handleSaveGeneral} className="general-form">
              <div className="form-group">
                <label className="form-label" htmlFor="exp-title">Título Principal de la Carta</label>
                <input
                  id="exp-title"
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Feliz Día del Amor y la Amistad"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label" htmlFor="exp-to">Para (Destinatario)</label>
                  <input
                    id="exp-to"
                    type="text"
                    className="form-input"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Ej. Mi amor, Mejor amig@"
                    required
                  />
                </div>

                <div className="form-group flex-1">
                  <label className="form-label" htmlFor="exp-from">De (Remitente)</label>
                  <input
                    id="exp-from"
                    type="text"
                    className="form-input"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Ej. Fabian"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="exp-note">Nota sobre el Exterior del Sobre</label>
                <textarea
                  id="exp-note"
                  className="form-textarea"
                  style={{ minHeight: '80px' }}
                  value={envelopeNote}
                  onChange={(e) => setEnvelopeNote(e.target.value)}
                  placeholder="Ej. Tienes un detalle especial esperando por ti..."
                />
              </div>

              <button
                type="submit"
                id="btn-save-general-settings"
                className="btn-primary"
                disabled={savingGeneral}
              >
                {savingGeneral ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
                <span>{saveSuccess ? '¡Guardado!' : 'Guardar Datos del Sobre'}</span>
              </button>
            </form>

            {/* Interactive Steps Manager */}
            <div className="sub-panel">
              <div className="sub-panel-header">
                <div>
                  <h4 className="sub-title font-serif">2. Cuadro de Preguntas / Decisiones</h4>
                  <p className="sub-desc">Preguntas que el destinatario responderá antes de ver el carrusel</p>
                </div>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => {
                    setStepToEdit(null);
                    setIsStepModalOpen(true);
                  }}
                >
                  <Plus size={14} />
                  <span>Añadir</span>
                </button>
              </div>

              <div className="steps-list">
                {steps.map((s, idx) => (
                  <div key={s.id} className="step-item glass-card">
                    <div className="step-info">
                      <span className="step-num">Pregunta {idx + 1}</span>
                      <p className="step-question">{s.question}</p>
                      <div className="step-options-preview">
                        <span>A: {s.option_a}</span>
                        <span>•</span>
                        <span>B: {s.option_b}</span>
                      </div>
                    </div>
                    <div className="step-actions">
                      <button
                        type="button"
                        className="icon-action-btn"
                        onClick={() => {
                          setStepToEdit(s);
                          setIsStepModalOpen(true);
                        }}
                        title="Editar pregunta"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        className="icon-action-btn text-danger"
                        onClick={() => handleDeleteStep(s.id)}
                        title="Eliminar pregunta"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}

                {steps.length === 0 && (
                  <p className="empty-hint">No hay preguntas previas. La carta irá directo al carrusel.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Carousel Cards Manager */}
        <section className="editor-col cards-col">
          <div className="cards-panel glass-panel">
            <div className="panel-header-with-action">
              <div>
                <span className="section-step-label">Paso Principal</span>
                <h3 className="panel-title font-serif">3. Carrusel de Recuerdos (Fotos y Textos)</h3>
                <p className="panel-sub">
                  Sube fotos y redacta textos emotivos. <strong>Límite estricto de 250 palabras por tarjeta.</strong>
                </p>
              </div>
              <button
                type="button"
                id="btn-add-card-open"
                className="btn-gold"
                onClick={() => {
                  setCardToEdit(null);
                  setIsCardModalOpen(true);
                }}
              >
                <Plus size={18} />
                <span>Agregar Tarjeta</span>
              </button>
            </div>

            {/* Cards List */}
            <div className="cards-grid">
              {cards.map((c, index) => (
                <div key={c.id} className="card-manage-item glass-card">
                  <div className="card-item-media">
                    {c.image_url ? (
                      <img src={c.image_url} alt={c.title} className="thumb-img" />
                    ) : (
                      <div className="thumb-placeholder">
                        <Heart size={24} className="text-gold" />
                      </div>
                    )}
                    <span className="card-item-index">#{index + 1}</span>
                  </div>

                  <div className="card-item-details">
                    <h4 className="card-item-title font-serif">{c.title || `Tarjeta ${index + 1}`}</h4>
                    <p className="card-item-snippet">{c.text_content}</p>
                    <div className="card-item-meta">
                      <span className="word-count-tag">
                        {c.word_count || c.text_content.trim().split(/\s+/).length} / 250 palabras
                      </span>
                    </div>
                  </div>

                  <div className="card-item-actions">
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => {
                        setCardToEdit(c);
                        setIsCardModalOpen(true);
                      }}
                      title="Editar contenido"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      type="button"
                      className="icon-btn text-danger"
                      onClick={() => handleDeleteCard(c.id)}
                      title="Eliminar tarjeta"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {cards.length === 0 && (
                <div className="empty-cards-state">
                  <Heart size={44} className="text-gold" />
                  <h4 className="font-serif">Tu carrusel aún no tiene tarjetas</h4>
                  <p>Haz clic en "Agregar Tarjeta" para subir fotos y redactar tus dedicatorias.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Card Editor Modal */}
      {isCardModalOpen && (
        <CardEditorModal
          experienceId={experienceId}
          card={cardToEdit}
          onSave={() => {
            setIsCardModalOpen(false);
            fetchExperience();
          }}
          onClose={() => setIsCardModalOpen(false)}
        />
      )}

      {/* Step Editor Modal */}
      {isStepModalOpen && (
        <StepEditorModal
          experienceId={experienceId}
          step={stepToEdit}
          onSave={() => {
            setIsStepModalOpen(false);
            fetchExperience();
          }}
          onClose={() => setIsStepModalOpen(false)}
        />
      )}

      <style>{`
        .experience-editor-layout {
          max-width: 1280px;
          margin: 0 auto;
          padding: 1.5rem 1.25rem 4rem;
          position: relative;
          z-index: 1;
        }

        .editor-navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-radius: var(--radius-lg);
          margin-bottom: 2rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.02) 100%), var(--glass-bg);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1.5px solid var(--glass-border);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), inset 0 1.5px 1.5px rgba(255, 255, 255, 0.32);
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .editor-badge {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--gold-400);
        }

        .editor-heading {
          font-size: 1.35rem;
          color: #fff;
        }

        .editor-content-grid {
          display: grid;
          grid-template-columns: 1fr 1.35fr;
          gap: 2rem;
        }

        @media (max-width: 960px) {
          .editor-content-grid {
            grid-template-columns: 1fr;
          }
        }

        .settings-panel, .cards-panel {
          border-radius: var(--radius-lg);
          padding: 2rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%), var(--glass-bg);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1.5px solid var(--glass-border);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), inset 0 1.5px 1.5px rgba(255, 255, 255, 0.3);
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--glass-border);
        }

        .panel-header-with-action {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.75rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--glass-border);
        }

        .section-step-label {
          font-size: 0.75rem;
          color: var(--rose-200);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .panel-title {
          font-size: 1.4rem;
          color: #fff;
          margin: 0.2rem 0;
        }

        .panel-sub {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        .form-row {
          display: flex;
          gap: 1rem;
        }

        .flex-1 {
          flex: 1;
        }

        .sub-panel {
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          border-top: 1px dashed rgba(255, 255, 255, 0.12);
        }

        .sub-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .sub-title {
          font-size: 1.15rem;
          color: #fff;
        }

        .sub-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .step-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.1rem 1.25rem;
          border-radius: var(--radius-sm);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%), rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1.5px solid var(--glass-border);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25), inset 0 1px 1.2px rgba(255, 255, 255, 0.25);
        }

        .step-num {
          font-size: 0.75rem;
          color: var(--gold-400);
          font-weight: 600;
        }

        .step-question {
          font-size: 0.95rem;
          color: #fff;
          margin: 0.2rem 0;
        }

        .step-options-preview {
          font-size: 0.8rem;
          color: var(--rose-200);
          display: flex;
          gap: 0.5rem;
        }

        .step-actions, .card-item-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .icon-action-btn, .icon-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1.2px solid rgba(255, 255, 255, 0.2);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.2);
          color: #fff;
          width: 34px;
          height: 34px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .icon-btn:hover, .icon-action-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: var(--glass-border-highlight);
          transform: translateY(-1px);
        }

        .text-danger {
          color: #ff6b6b;
        }
        .text-danger:hover {
          background: rgba(231, 76, 60, 0.2) !important;
        }

        /* Cards Grid */
        .cards-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .card-manage-item {
          display: grid;
          grid-template-columns: 110px 1fr auto;
          gap: 1.25rem;
          align-items: center;
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%), rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1.5px solid var(--glass-border);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.3), inset 0 1.2px 1.2px rgba(255, 255, 255, 0.26);
          transition: var(--transition-smooth);
        }

        .card-manage-item:hover {
          border-color: var(--glass-border-highlight);
          transform: translateY(-2px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45), 0 0 20px rgba(255, 77, 109, 0.25), inset 0 1.5px 1.5px rgba(255, 255, 255, 0.4);
        }

        @media (max-width: 600px) {
          .card-manage-item {
            grid-template-columns: 80px 1fr auto;
          }
        }

        .card-item-media {
          position: relative;
          width: 100%;
          height: 85px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: rgba(0, 0, 0, 0.4);
        }

        .thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumb-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-item-index {
          position: absolute;
          top: 4px;
          left: 4px;
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .card-item-details {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          overflow: hidden;
        }

        .card-item-title {
          font-size: 1.05rem;
          color: #fff;
        }

        .card-item-snippet {
          font-size: 0.88rem;
          color: var(--text-muted);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          line-height: 1.4;
        }

        .word-count-tag {
          font-size: 0.75rem;
          color: var(--gold-300);
          font-weight: 600;
          background: rgba(244, 209, 136, 0.1);
          padding: 2px 8px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(244, 209, 136, 0.2);
          display: inline-block;
        }

        .empty-cards-state {
          padding: 3.5rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-muted);
        }

        .empty-hint {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-style: italic;
          padding: 0.5rem 0;
        }

        .editor-loading {
          min-height: 70vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: var(--rose-200);
        }
      `}</style>
    </div>
  );
}
