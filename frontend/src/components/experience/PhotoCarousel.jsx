import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Heart, Sparkles, RefreshCw, ZoomIn, X, Share2, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getAssetUrl } from '../../services/api';

export default function PhotoCarousel({ experience, onReplay }) {
  const cards = experience.cards || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasSentHeart, setHasSentHeart] = useState(false);
  const [heartCount, setHeartCount] = useState(1);
  const [zoomedImage, setZoomedImage] = useState(null);

  const currentCard = cards[currentIndex] || {
    title: "Nuestro Momento",
    image_url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
    text_content: "Este es un detalle especial de Amor y Amistad para recordarte lo valiosa que es tu compañía."
  };

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === cards.length - 1;

  const nextCard = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, cards.length]);

  const prevCard = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextCard();
      if (e.key === 'ArrowLeft') prevCard();
      if (e.key === 'Escape') setZoomedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextCard, prevCard]);

  const [imgErrorMap, setImgErrorMap] = useState({});

  const handleSendHeart = async () => {
    setHasSentHeart(true);
    setHeartCount(prev => prev + 1);
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#ff4d6d', '#ff758f', '#c9184a', '#f4d188', '#ffffff']
    });

    if (experience.slug) {
      try {
        const res = await api.sendHug(experience.slug);
        if (res && res.hug_count) {
          setHeartCount(res.hug_count);
        }
      } catch (err) {
        console.warn("No se pudo enviar la notificación de abrazo al servidor:", err);
      }
    }
  };

  return (
    <div className="carousel-wrapper animate-enter" id="photo-carousel-screen">
      {/* Experience Header */}
      <header className="carousel-header">
        <div className="header-meta">
          <span className="celebration-chip">
            <Heart size={14} fill="#ff4d6d" color="#ff4d6d" />
            14 de Septiembre • Amor y Amistad
          </span>
          <h1 className="experience-title font-serif">{experience.title}</h1>
          <p className="experience-dedication">
            Dedicado con amor para <strong className="text-gold">{experience.recipient_name}</strong> de parte de <strong>{experience.sender_name}</strong>
          </p>
        </div>

        {/* Progress bar and counter */}
        <div className="carousel-progress-box">
          <span className="progress-text">
            Recuerdo <strong>{currentIndex + 1}</strong> de <strong>{cards.length}</strong>
          </span>
          <div className="progress-dots">
            {cards.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`dot-btn ${i === currentIndex ? 'dot-active' : ''}`}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Ir a tarjeta ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Slide Card */}
      <main className="card-stage">
        <div className="carousel-card glass-panel">
          {/* Card Image Area */}
          <div className="card-media-wrap">
            {currentCard.image_url && !imgErrorMap[currentIndex] ? (
              <div className="image-frame" onClick={() => setZoomedImage(getAssetUrl(currentCard.image_url))} role="button" tabIndex={0}>
                <img
                  src={getAssetUrl(currentCard.image_url)}
                  alt={currentCard.title || "Fotografía de Amor y Amistad"}
                  className="card-image"
                  loading="lazy"
                  onError={() => setImgErrorMap(prev => ({ ...prev, [currentIndex]: true }))}
                />
                <div className="image-overlay-glow" />
                <button type="button" className="zoom-hint" title="Ver en pantalla completa">
                  <ZoomIn size={18} />
                </button>
              </div>
            ) : (
              <div className="image-placeholder">
                <Heart size={48} className="placeholder-heart" />
                <span>Un detalle grabado en el corazón</span>
              </div>
            )}
          </div>

          {/* Card Text & Content Area */}
          <div className="card-body">
            <div className="card-body-top">
              <span className="card-num-tag font-serif">Capítulo {currentIndex + 1}</span>
              <h2 className="card-title font-serif">{currentCard.title || "Un Momento Especial"}</h2>
            </div>

            <div className="card-text-container">
              <p className="card-text">{currentCard.text_content}</p>
            </div>

            <div className="card-footer">
              <span className="word-count-note">
                💌 Mensaje exclusivo de Amor y Amistad
              </span>
            </div>
          </div>
        </div>

        {/* Floating Navigation Controls */}
        <button
          type="button"
          id="btn-carousel-prev"
          className="nav-control nav-prev"
          onClick={prevCard}
          disabled={isFirst}
          aria-label="Tarjeta anterior"
        >
          <ChevronLeft size={28} />
        </button>

        <button
          type="button"
          id="btn-carousel-next"
          className="nav-control nav-next"
          onClick={nextCard}
          disabled={isLast}
          aria-label="Tarjeta siguiente"
        >
          <ChevronRight size={28} />
        </button>
      </main>

      {/* Celebration Footer / End State */}
      <footer className="carousel-footer-actions">
        {isLast ? (
          <div className="final-celebration-card glass-panel animate-enter">
            <Sparkles size={24} className="celebration-icon text-gold" />
            <h3 className="celebration-title font-serif">¡Feliz Día del Amor y la Amistad!</h3>
            <p className="celebration-desc">
              Gracias por formar parte de los momentos más bonitos y por ser alguien tan especial en este día.
            </p>
            {hasSentHeart && (
              <div className="hug-sent-notification animate-enter">
                <Check size={16} className="text-gold" />
                <span>
                  <strong>¡Notificación enviada!</strong> {experience.sender_name || 'El remitente'} ha sido notificado de que recibiste su detalle y le enviaste un abrazo de vuelta. ❤️
                </span>
              </div>
            )}
            <div className="celebration-buttons">
              <button
                type="button"
                id="btn-send-heart"
                className="btn-primary"
                onClick={handleSendHeart}
              >
                <Heart size={18} fill="#fff" />
                <span>{hasSentHeart ? `¡Amor recibido! (${heartCount}) ❤️` : 'Enviar un abrazo de vuelta ❤️'}</span>
              </button>
              <button
                type="button"
                id="btn-replay-experience"
                className="btn-secondary"
                onClick={onReplay}
              >
                <RefreshCw size={16} />
                <span>Revivir la carta</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="helper-hint">
            Usa las flechas o haz clic en Siguiente para continuar descubriendo los recuerdos
          </div>
        )}
      </footer>

      {/* Image Zoom Lightbox */}
      {zoomedImage && (
        <div className="lightbox-overlay" onClick={() => setZoomedImage(null)}>
          <button type="button" className="lightbox-close" onClick={() => setZoomedImage(null)}>
            <X size={24} />
          </button>
          <img src={zoomedImage} alt="Fotografía ampliada" className="lightbox-image" />
        </div>
      )}

      <style>{`
        .carousel-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1.25rem 4rem;
          position: relative;
          z-index: 1;
        }

        .carousel-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.25rem;
          margin-bottom: 2rem;
          width: 100%;
        }

        .celebration-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(201, 24, 74, 0.2);
          border: 1px solid rgba(255, 77, 109, 0.4);
          color: var(--rose-100);
          padding: 0.4rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .experience-title {
          font-size: clamp(2rem, 5vw, 2.75rem);
          color: #fff;
          line-height: 1.2;
          text-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }

        .text-gold {
          color: var(--gold-300);
        }

        .experience-dedication {
          font-size: 1.05rem;
          color: var(--text-muted);
        }

        .carousel-progress-box {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.02) 100%), rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          padding: 0.55rem 1.4rem;
          border-radius: var(--radius-full);
          border: 1.5px solid var(--glass-border);
          box-shadow: inset 0 1.2px 1.2px rgba(255, 255, 255, 0.3), 0 6px 18px rgba(0, 0, 0, 0.3);
        }

        .progress-text {
          font-size: 0.9rem;
          color: var(--rose-200);
        }

        .progress-dots {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .dot-btn {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          border: none;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .dot-btn.dot-active {
          background: var(--ruby-400);
          transform: scale(1.4);
          box-shadow: 0 0 10px var(--ruby-400);
        }

        /* Card Stage */
        .card-stage {
          position: relative;
          width: 100%;
        }

        .carousel-card {
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%), var(--glass-bg);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 2px solid rgba(244, 209, 136, 0.38);
          overflow: hidden;
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          min-height: 480px;
          box-shadow: 
            0 25px 65px -10px rgba(18, 2, 6, 0.9), 
            inset 0 2px 2.5px rgba(255, 255, 255, 0.35), 
            inset 0 -1.5px 2px rgba(0, 0, 0, 0.35);
          transition: transform 0.4s ease, opacity 0.4s ease;
        }

        @media (max-width: 768px) {
          .carousel-card {
            grid-template-columns: 1fr;
          }
        }

        .card-media-wrap {
          position: relative;
          background: rgba(15, 2, 4, 0.7);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 320px;
        }

        .image-frame {
          width: 100%;
          height: 100%;
          min-height: 380px;
          position: relative;
          cursor: zoom-in;
          overflow: hidden;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .image-frame:hover .card-image {
          transform: scale(1.04);
        }

        .image-overlay-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(35, 8, 14, 0.8) 0%, transparent 40%);
          pointer-events: none;
        }

        .zoom-hint {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: var(--transition-smooth);
        }

        .zoom-hint:hover {
          background: var(--ruby-400);
        }

        .image-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          color: var(--rose-200);
          padding: 3rem;
          text-align: center;
        }

        .placeholder-heart {
          color: var(--ruby-400);
          animation: heartBeat 2s infinite ease-in-out;
        }

        /* Card Body */
        .card-body {
          padding: 2.5rem 2.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 1.5rem;
          background: rgba(35, 8, 14, 0.4);
        }

        .card-body-top {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .card-num-tag {
          font-size: 0.95rem;
          color: var(--gold-400);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .card-title {
          font-size: 1.75rem;
          color: #fff;
          line-height: 1.3;
        }

        .card-text-container {
          flex: 1;
        }

        .card-text {
          font-size: 1.1rem;
          line-height: 1.75;
          color: var(--rose-50);
          white-space: pre-line;
          font-family: var(--font-sans);
          font-weight: 300;
        }

        .card-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 1rem;
        }

        .word-count-note {
          font-size: 0.8rem;
          color: var(--gold-300);
          font-style: italic;
        }

        /* Nav Controls */
        .nav-control {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%), rgba(43, 8, 17, 0.88);
          border: 1.5px solid var(--glass-border-strong);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition: var(--transition-smooth);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5), inset 0 1.2px 1.5px rgba(255, 255, 255, 0.35);
          z-index: 10;
        }

        .nav-control:hover:not(:disabled) {
          background: var(--ruby-500);
          border-color: var(--gold-300);
          transform: translateY(-50%) scale(1.1);
          box-shadow: var(--shadow-glow), inset 0 1.5px 2px rgba(255, 255, 255, 0.5);
        }

        .nav-control:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }

        .nav-prev {
          left: -26px;
        }

        .nav-next {
          right: -26px;
        }

        @media (max-width: 768px) {
          .nav-prev { left: 8px; }
          .nav-next { right: 8px; }
        }

        /* Footer actions / celebration */
        .carousel-footer-actions {
          margin-top: 2.5rem;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .final-celebration-card {
          width: 100%;
          max-width: 600px;
          border-radius: var(--radius-lg);
          padding: 2.25rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.02) 100%), var(--glass-bg);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 2px solid var(--gold-400);
          box-shadow: var(--shadow-gold-glow), 0 25px 50px rgba(0, 0, 0, 0.6), inset 0 2px 2.5px rgba(255, 255, 255, 0.38);
        }

        .celebration-title {
          font-size: 1.8rem;
          color: #fff;
        }

        .celebration-desc {
          color: var(--rose-100);
          font-size: 1rem;
          line-height: 1.5;
        }

        .hug-sent-notification {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: rgba(244, 209, 136, 0.14);
          border: 1.5px solid var(--gold-400);
          color: #fff;
          padding: 0.75rem 1.2rem;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          text-align: left;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .celebration-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-top: 0.5rem;
        }

        .helper-hint {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-style: italic;
        }

        /* Lightbox */
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 2, 4, 0.92);
          backdrop-filter: blur(16px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .lightbox-image {
          max-width: 90vw;
          max-height: 85vh;
          object-fit: contain;
          border-radius: 12px;
          border: 2px solid var(--gold-300);
          box-shadow: 0 0 50px rgba(244, 209, 136, 0.3);
        }

        .lightbox-close {
          position: absolute;
          top: 2rem;
          right: 2rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #fff;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
