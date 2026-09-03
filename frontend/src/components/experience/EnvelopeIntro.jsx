import React, { useState } from 'react';
import { Heart, Sparkles, MailOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EnvelopeIntro({ experience, onOpen }) {
  const [isOpening, setIsOpening] = useState(false);

  const handleSealClick = () => {
    setIsOpening(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#ff4d6d', '#ff758f', '#f4d188', '#ffffff']
    });

    setTimeout(() => {
      onOpen();
    }, 900);
  };

  return (
    <div className="envelope-wrapper animate-enter" id="envelope-intro-screen">
      {/* Colombian Celebration Badge */}
      <div className="celebration-tag">
        <Sparkles size={16} className="text-gold" />
        <span>Especial Día del Amor y la Amistad • Colombia</span>
      </div>

      <div className={`vintage-envelope ${isOpening ? 'envelope-open' : ''}`}>
        <div className="envelope-flap" />
        
        <div className="envelope-front">
          <div className="envelope-letterhead">
            <span className="postage-stamp">
              <span className="stamp-inner">14·SEP</span>
            </span>
            <div className="delivery-info">
              <p className="delivery-label">Para:</p>
              <h2 className="delivery-name font-serif">{experience.recipient_name}</h2>
              <p className="delivery-from">De parte de: <strong>{experience.sender_name}</strong></p>
            </div>
          </div>

          <div className="envelope-note-preview">
            <p>"{experience.envelope_note || 'Tienes un detalle especial esperando por ti...'}"</p>
          </div>

          <div className="wax-seal-container" onClick={handleSealClick} role="button" tabIndex={0} id="btn-open-seal">
            <div className="wax-seal">
              <div className="wax-seal-inner">
                <Heart size={26} fill="#fff" color="#fff" className="seal-heart" />
                <span className="seal-text">Abrir Carta</span>
              </div>
            </div>
            <p className="seal-instruction">Haz clic en el sello para abrir</p>
          </div>
        </div>
      </div>

      <style>{`
        .envelope-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 85vh;
          padding: 2rem 1rem;
          position: relative;
          z-index: 1;
        }

        .celebration-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(244, 209, 136, 0.12);
          border: 1px solid rgba(244, 209, 136, 0.35);
          color: var(--gold-300);
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .text-gold {
          color: var(--gold-400);
        }

        .vintage-envelope {
          position: relative;
          width: 100%;
          max-width: 540px;
          min-height: 380px;
          background: linear-gradient(145deg, #3c0c17, #26050b);
          border: 2px solid rgba(244, 209, 136, 0.35);
          border-radius: 18px;
          box-shadow: 0 25px 60px -10px rgba(15, 2, 4, 0.85), 0 0 35px rgba(201, 24, 74, 0.25);
          padding: 2.5rem 2rem;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease;
          overflow: hidden;
        }

        .vintage-envelope.envelope-open {
          transform: scale(0.92) translateY(-20px);
          opacity: 0;
        }

        .vintage-envelope::before {
          content: '';
          position: absolute;
          inset: 8px;
          border: 1px dashed rgba(255, 204, 213, 0.2);
          border-radius: 12px;
          pointer-events: none;
        }

        .envelope-front {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.5rem;
        }

        .envelope-letterhead {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 1.25rem;
        }

        .postage-stamp {
          width: 58px;
          height: 68px;
          border: 2px dashed var(--gold-400);
          background: rgba(223, 177, 91, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }

        .stamp-inner {
          font-family: var(--font-serif);
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--gold-300);
          letter-spacing: 0.05em;
          border: 1px solid var(--gold-400);
          padding: 4px 6px;
        }

        .delivery-info {
          text-align: right;
        }

        .delivery-label {
          font-size: 0.8rem;
          color: var(--rose-200);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .delivery-name {
          font-size: 1.6rem;
          color: #fff;
          margin: 0.2rem 0;
        }

        .delivery-from {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .envelope-note-preview {
          background: rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 1.2rem 1.5rem;
          font-family: var(--font-serif);
          font-style: italic;
          font-size: 1.1rem;
          color: var(--rose-100);
          max-width: 440px;
          line-height: 1.5;
        }

        .wax-seal-container {
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.5rem;
          transition: transform 0.3s ease;
        }

        .wax-seal-container:hover {
          transform: scale(1.06);
        }

        .wax-seal {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #ff4d6d, #9e102e);
          box-shadow: 0 8px 25px rgba(201, 24, 74, 0.6), inset 0 2px 5px rgba(255, 255, 255, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #f4d188;
          position: relative;
        }

        .wax-seal-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .seal-heart {
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
          animation: heartBeat 2s infinite ease-in-out;
        }

        .seal-text {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #fff;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        }

        .seal-instruction {
          font-size: 0.85rem;
          color: var(--gold-300);
          letter-spacing: 0.02em;
        }

        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
