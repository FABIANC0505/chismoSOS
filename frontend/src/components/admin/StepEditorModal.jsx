import React, { useState } from 'react';
import { api } from '../../services/api';
import { Check, X, Loader2, Sparkles } from 'lucide-react';

export default function StepEditorModal({ experienceId, step, onSave, onClose }) {
  const [question, setQuestion] = useState(step ? step.question : '');
  const [optionA, setOptionA] = useState(step ? step.option_a : '');
  const [optionB, setOptionB] = useState(step ? step.option_b : '');
  const [optionC, setOptionC] = useState(step ? step.option_c || '' : '');
  const [reactionText, setReactionText] = useState(step ? step.reaction_text || '' : '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !optionA.trim() || !optionB.trim()) {
      setError('Por favor completa la pregunta y al menos dos opciones.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        question,
        option_a: optionA,
        option_b: optionB,
        option_c: optionC.trim() || null,
        reaction_text: reactionText.trim() || '¡Sabía que elegirías esa opción! ❤️'
      };

      if (step && step.id) {
        await api.updateStep(step.id, payload);
      } else {
        await api.addStep(experienceId, payload);
      }
      onSave();
    } catch (err) {
      setError(err.message || 'Error al guardar la pregunta interactiva.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" id="step-editor-modal">
      <div className="card-editor-dialog glass-panel animate-enter">
        <div className="dialog-header">
          <h3 className="dialog-title font-serif">
            {step ? 'Editar Cuadro de Selección' : 'Nueva Pregunta Interactiva'}
          </h3>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="dialog-error">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="step-form">
          <div className="form-group">
            <label className="form-label">Pregunta Interactiva</label>
            <input
              type="text"
              className="form-input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ej. ¿Prometes no reírte con las siguientes fotos?"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Opción 1 (A)</label>
            <input
              type="text"
              className="form-input"
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              placeholder="Ej. ¡Lo prometo con el corazón! ❤️"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Opción 2 (B)</label>
            <input
              type="text"
              className="form-input"
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              placeholder="Ej. ¡No prometo nada, jaja! ✨"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Opción 3 (Opcional)</label>
            <input
              type="text"
              className="form-input"
              value={optionC}
              onChange={(e) => setOptionC(e.target.value)}
              placeholder="Ej. ¡Sorpréndeme!"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mensaje de Reacción Inmediata</label>
            <input
              type="text"
              className="form-input"
              value={reactionText}
              onChange={(e) => setReactionText(e.target.value)}
              placeholder="Ej. ¡Sabía que dirías eso! Prepárate para lo que viene..."
            />
          </div>

          <div className="dialog-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? <Loader2 size={18} className="spinner" /> : <Check size={18} />}
              <span>{step ? 'Actualizar Pregunta' : 'Agregar Pregunta'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
