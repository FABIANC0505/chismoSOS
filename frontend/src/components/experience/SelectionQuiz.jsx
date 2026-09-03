import React, { useState } from 'react';
import { Heart, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SelectionQuiz({ steps = [], onComplete }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showReaction, setShowReaction] = useState(false);

  // Fallback if no steps are configured
  const currentStep = steps[currentStepIndex] || {
    question: "¿Prometes guardar este detalle en tu corazón?",
    option_a: "¡Sí, lo prometo para siempre! ❤️",
    option_b: "¡Por supuesto que sí! ✨",
    reaction_text: "¡Sabía que dirías que sí! Ahora déjate llevar por nuestros recuerdos..."
  };

  const handleSelect = (optionKey) => {
    setSelectedOption(optionKey);
    setShowReaction(true);

    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.55 },
      colors: ['#ff4d6d', '#f4d188', '#ffffff']
    });
  };

  const handleContinue = () => {
    if (currentStepIndex + 1 < steps.length) {
      setCurrentStepIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowReaction(false);
    } else {
      onComplete();
    }
  };

  const options = [
    { key: 'a', text: currentStep.option_a },
    { key: 'b', text: currentStep.option_b },
    ...(currentStep.option_c ? [{ key: 'c', text: currentStep.option_c }] : [])
  ];

  return (
    <div className="quiz-container animate-enter" id="selection-quiz-screen">
      <div className="quiz-card glass-panel">
        <div className="quiz-header">
          <span className="quiz-step-badge">
            <Sparkles size={14} />
            {steps.length > 1 ? `Pregunta ${currentStepIndex + 1} de ${steps.length}` : 'Un momento antes de comenzar...'}
          </span>
          <h2 className="quiz-question font-serif">{currentStep.question}</h2>
          <p className="quiz-hint">Selecciona una respuesta para continuar</p>
        </div>

        <div className="options-grid">
          {options.map((opt) => {
            const isSelected = selectedOption === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                id={`quiz-option-${opt.key}`}
                className={`option-btn ${isSelected ? 'option-selected' : ''}`}
                onClick={() => handleSelect(opt.key)}
              >
                <div className="option-indicator">
                  {isSelected ? <CheckCircle2 size={20} className="check-icon" /> : <Heart size={18} className="heart-icon" />}
                </div>
                <span className="option-text">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {showReaction && (
          <div className="reaction-box animate-enter" id="quiz-reaction-container">
            <div className="reaction-content">
              <p className="reaction-msg font-serif">
                "{currentStep.reaction_text || '¡Sabía que elegirías esa opción! ❤️'}"
              </p>
            </div>
            <button
              type="button"
              id="btn-quiz-continue"
              className="btn-primary continue-btn"
              onClick={handleContinue}
            >
              <span>{currentStepIndex + 1 < steps.length ? 'Siguiente Pregunta' : 'Abrir Carrusel de Recuerdos'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        .quiz-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 85vh;
          padding: 2rem 1rem;
          position: relative;
          z-index: 1;
        }

        .quiz-card {
          width: 100%;
          max-width: 580px;
          border-radius: var(--radius-lg);
          padding: 3rem 2.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.02) 100%), var(--glass-bg);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 2px solid rgba(244, 209, 136, 0.38);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), inset 0 2px 2.5px rgba(255, 255, 255, 0.35);
        }

        .quiz-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .quiz-step-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 77, 109, 0.15);
          color: var(--rose-200);
          border: 1.5px solid rgba(255, 77, 109, 0.35);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.25);
          padding: 0.35rem 0.9rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .quiz-question {
          font-size: 1.85rem;
          color: #fff;
          line-height: 1.35;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
        }

        .quiz-hint {
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        .options-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .option-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%), rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1.5px solid var(--glass-border);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25), inset 0 1.2px 1.5px rgba(255, 255, 255, 0.22);
          border-radius: var(--radius-md);
          padding: 1.1rem 1.4rem;
          color: #fff;
          font-family: var(--font-sans);
          font-size: 1.05rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition-smooth);
          text-align: left;
        }

        .option-btn:hover {
          background: linear-gradient(135deg, rgba(255, 77, 109, 0.22) 0%, rgba(201, 24, 74, 0.15) 100%);
          border-color: var(--ruby-400);
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(255, 77, 109, 0.35), inset 0 1.5px 2px rgba(255, 255, 255, 0.4);
        }

        .option-btn.option-selected {
          background: linear-gradient(135deg, rgba(201, 24, 74, 0.35), rgba(244, 209, 136, 0.2));
          border-color: var(--gold-300);
          box-shadow: 0 0 30px rgba(244, 209, 136, 0.35), inset 0 1.5px 2px rgba(255, 255, 255, 0.5);
        }

        .option-indicator {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: var(--transition-smooth);
        }

        .option-btn:hover .option-indicator {
          background: var(--ruby-400);
          color: #fff;
        }

        .option-selected .option-indicator {
          background: var(--gold-400);
          color: var(--wine-950);
        }

        .option-text {
          flex: 1;
        }

        .reaction-box {
          margin-top: 1rem;
          padding-top: 1.5rem;
          border-top: 1px dashed rgba(255, 255, 255, 0.15);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
        }

        .reaction-content {
          background: linear-gradient(135deg, rgba(244, 209, 136, 0.14) 0%, rgba(244, 209, 136, 0.04) 100%);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1.5px solid rgba(244, 209, 136, 0.38);
          box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.3), 0 8px 20px rgba(0, 0, 0, 0.25);
          border-radius: var(--radius-md);
          padding: 1rem 1.4rem;
          width: 100%;
        }

        .reaction-msg {
          font-size: 1.15rem;
          color: var(--gold-300);
          font-style: italic;
          line-height: 1.4;
        }

        .continue-btn {
          width: 100%;
          max-width: 340px;
          padding: 0.9rem 1.8rem;
          font-size: 1.05rem;
        }
      `}</style>
    </div>
  );
}
