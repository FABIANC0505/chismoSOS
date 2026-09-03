import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import EnvelopeIntro from './EnvelopeIntro';
import SelectionQuiz from './SelectionQuiz';
import PhotoCarousel from './PhotoCarousel';
import { Heart, Loader2, ArrowLeft } from 'lucide-react';

export default function ExperienceViewer({ slug, experienceData, onBackToAdmin }) {
  const [experience, setExperience] = useState(experienceData || null);
  const [loading, setLoading] = useState(!experienceData && Boolean(slug));
  const [error, setError] = useState(null);
  const [stage, setStage] = useState('envelope'); // 'envelope' | 'quiz' | 'carousel'

  useEffect(() => {
    if (experienceData) {
      setExperience(experienceData);
      setLoading(false);
      return;
    }

    if (slug) {
      setLoading(true);
      api.getPublicExperience(slug)
        .then(data => {
          setExperience(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message || "No pudimos cargar esta carta de Amor y Amistad.");
          setLoading(false);
        });
    }
  }, [slug, experienceData]);

  if (loading) {
    return (
      <div className="viewer-loading">
        <Loader2 className="spinner" size={40} />
        <p className="font-serif">Desplegando sobre de Amor y Amistad...</p>
        <style>{`
          .viewer-loading {
            min-height: 80vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            color: var(--rose-200);
          }
          .spinner {
            animation: spin 1s linear infinite;
            color: var(--ruby-400);
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="viewer-error glass-panel">
        <Heart size={44} className="error-heart" />
        <h2 className="font-serif">Carta no disponible</h2>
        <p>{error || 'Esta experiencia ya no se encuentra activa o el enlace es incorrecto.'}</p>
        {onBackToAdmin && (
          <button type="button" className="btn-secondary" onClick={onBackToAdmin}>
            <ArrowLeft size={16} />
            <span>Volver al panel</span>
          </button>
        )}
        <style>{`
          .viewer-error {
            max-width: 500px;
            margin: 4rem auto;
            padding: 2.5rem;
            border-radius: var(--radius-lg);
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.25rem;
          }
          .error-heart {
            color: var(--ruby-400);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="experience-viewer-container">
      {onBackToAdmin && (
        <div className="preview-top-banner">
          <span>Modo Previsualización en Vivo</span>
          <button type="button" className="btn-secondary btn-sm" onClick={onBackToAdmin}>
            <ArrowLeft size={14} />
            <span>Volver al Editor</span>
          </button>
        </div>
      )}

      {stage === 'envelope' && (
        <EnvelopeIntro
          experience={experience}
          onOpen={() => {
            if (experience.selection_steps && experience.selection_steps.length > 0) {
              setStage('quiz');
            } else {
              setStage('carousel');
            }
          }}
        />
      )}

      {stage === 'quiz' && (
        <SelectionQuiz
          steps={experience.selection_steps}
          onComplete={() => setStage('carousel')}
        />
      )}

      {stage === 'carousel' && (
        <PhotoCarousel
          experience={experience}
          onReplay={() => setStage('envelope')}
        />
      )}

      <style>{`
        .experience-viewer-container {
          position: relative;
          z-index: 1;
          min-height: 100vh;
        }

        .preview-top-banner {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(35, 8, 14, 0.92);
          border-bottom: 1px solid var(--gold-400);
          padding: 0.6rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 100;
          backdrop-filter: blur(8px);
          font-size: 0.85rem;
          color: var(--gold-300);
        }

        .btn-sm {
          padding: 0.35rem 0.8rem;
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
}
