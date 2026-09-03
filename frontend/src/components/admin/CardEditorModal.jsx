import React, { useState } from 'react';
import { api } from '../../services/api';
import { Upload, Image as ImageIcon, AlertTriangle, Check, X, Loader2 } from 'lucide-react';

const MAX_WORDS = 250;

function getWordCount(text) {
  if (!text) return 0;
  const words = text.trim().split(/\s+/);
  return words.filter(w => w.length > 0).length;
}

export default function CardEditorModal({ experienceId, card, onSave, onClose }) {
  const [title, setTitle] = useState(card ? card.title || '' : '');
  const [imageUrl, setImageUrl] = useState(card ? card.image_url || '' : '');
  const [textContent, setTextContent] = useState(card ? card.text_content || '' : '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const wordCount = getWordCount(textContent);
  const isOverLimit = wordCount > MAX_WORDS;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const res = await api.uploadImage(file);
      setImageUrl(res.image_url);
    } catch (err) {
      setError(err.message || 'Error al subir la imagen.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isOverLimit) {
      setError(`El texto excede el límite de ${MAX_WORDS} palabras. Actualmente tienes ${wordCount} palabras.`);
      return;
    }
    if (!textContent.trim()) {
      setError('Por favor ingresa un mensaje o detalle para la tarjeta.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (card && card.id) {
        await api.updateCard(card.id, {
          title,
          image_url: imageUrl,
          text_content: textContent
        });
      } else {
        await api.addCard(experienceId, {
          title,
          image_url: imageUrl,
          text_content: textContent
        });
      }
      onSave();
    } catch (err) {
      setError(err.message || 'Error al guardar la tarjeta.');
    } finally {
      setSaving(false);
    }
  };

  const getWordBadgeClass = () => {
    if (isOverLimit) return 'danger';
    if (wordCount > 220) return 'warn';
    return 'safe';
  };

  return (
    <div className="modal-backdrop" id="card-editor-modal">
      <div className="card-editor-dialog glass-panel animate-enter">
        <div className="dialog-header">
          <h3 className="dialog-title font-serif">
            {card ? 'Editar Tarjeta de Recuerdo' : 'Agregar Nueva Tarjeta al Carrusel'}
          </h3>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="dialog-error">
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="card-form">
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="card-title">Título o Capítulo del Recuerdo</label>
            <input
              id="card-title"
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Aquella tarde en el parque..."
            />
          </div>

          {/* Image Upload & Preview */}
          <div className="form-group">
            <label className="form-label">Fotografía del Recuerdo</label>
            <div className="image-field-grid">
              <div className="upload-controls">
                <label className="file-drop-zone">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden-file-input"
                    disabled={uploading}
                  />
                  {uploading ? (
                    <Loader2 size={24} className="spinner text-gold" />
                  ) : (
                    <Upload size={24} className="text-gold" />
                  )}
                  <span className="drop-text">
                    {uploading ? 'Subiendo fotografía...' : 'Subir imagen desde tu dispositivo'}
                  </span>
                  <span className="drop-hint">Formatos: JPG, PNG, WEBP</span>
                </label>

                <div className="or-divider">o ingresa una URL</div>

                <input
                  type="url"
                  className="form-input"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://ejemplo.com/foto.jpg"
                />
              </div>

              {/* Live Image Preview */}
              <div className="image-preview-box">
                {imageUrl ? (
                  <div className="preview-wrap">
                    <img src={imageUrl} alt="Vista previa" className="preview-img" />
                    <button
                      type="button"
                      className="remove-img-btn"
                      onClick={() => setImageUrl('')}
                      title="Quitar foto"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="preview-empty">
                    <ImageIcon size={32} opacity={0.4} />
                    <span>Sin imagen seleccionada</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Text Content with Word Counter */}
          <div className="form-group">
            <div className="label-with-counter">
              <label className="form-label" htmlFor="card-text">Mensaje o Detalle</label>
              <div className={`word-counter-badge ${getWordBadgeClass()}`}>
                <span>{wordCount} / {MAX_WORDS} palabras</span>
                {isOverLimit && <AlertTriangle size={14} />}
              </div>
            </div>
            
            <textarea
              id="card-text"
              className={`form-textarea ${isOverLimit ? 'textarea-error' : ''}`}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Escribe aquí las palabras dedicadas para este recuerdo (máximo 250 palabras)..."
              rows={5}
              required
            />
            
            {isOverLimit ? (
              <p className="counter-warning">
                Has superado el límite permitido de {MAX_WORDS} palabras por {wordCount - MAX_WORDS} palabras. Por favor sintetiza el texto.
              </p>
            ) : (
              <p className="counter-help">
                Texto fluido y emotivo ideal para transmitir amor y gratitud.
              </p>
            )}
          </div>

          <div className="dialog-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-save-card"
              className="btn-primary"
              disabled={saving || isOverLimit || uploading}
            >
              {saving ? <Loader2 size={18} className="spinner" /> : <Check size={18} />}
              <span>{card ? 'Guardar Cambios' : 'Agregar al Carrusel'}</span>
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .card-editor-dialog {
          width: 100%;
          max-width: 620px;
          border-radius: var(--radius-lg);
          padding: 2.25rem 2rem;
          border: 1.5px solid var(--glass-border);
          max-height: 90vh;
          overflow-y: auto;
        }

        .dialog-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--glass-border);
        }

        .dialog-title {
          font-size: 1.5rem;
          color: #fff;
        }

        .close-btn {
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
        }

        .dialog-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(231, 76, 60, 0.2);
          border: 1px solid rgba(231, 76, 60, 0.4);
          color: #ff8b8b;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          margin-bottom: 1.25rem;
        }

        .image-field-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 1rem;
          align-items: start;
        }

        @media (max-width: 600px) {
          .image-field-grid {
            grid-template-columns: 1fr;
          }
        }

        .upload-controls {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .file-drop-zone {
          border: 2px dashed rgba(244, 209, 136, 0.4);
          background: rgba(255, 255, 255, 0.03);
          border-radius: var(--radius-md);
          padding: 1.25rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
          transition: var(--transition-smooth);
          text-align: center;
        }

        .file-drop-zone:hover {
          background: rgba(255, 77, 109, 0.1);
          border-color: var(--ruby-400);
        }

        .hidden-file-input {
          display: none;
        }

        .drop-text {
          font-size: 0.9rem;
          font-weight: 500;
          color: #fff;
        }

        .drop-hint {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .or-divider {
          text-align: center;
          font-size: 0.75rem;
          color: var(--rose-200);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .image-preview-box {
          height: 160px;
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          overflow: hidden;
          background: rgba(15, 2, 4, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview-wrap {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-img-btn {
          position: absolute;
          top: 6px;
          right: 6px;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #fff;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .preview-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-size: 0.8rem;
        }

        .label-with-counter {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .textarea-error {
          border-color: #ff6b6b !important;
          box-shadow: 0 0 15px rgba(231, 76, 60, 0.35) !important;
        }

        .counter-warning {
          font-size: 0.82rem;
          color: #ff6b6b;
          font-weight: 500;
          margin-top: 0.3rem;
        }

        .counter-help {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.3rem;
        }

        .dialog-actions {
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
