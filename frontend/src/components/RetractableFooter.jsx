import React, { useState, useEffect } from 'react';
import { Heart, Mail, ChevronUp, ChevronDown, Code, ExternalLink } from 'lucide-react';

export default function RetractableFooter() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    let timer;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const fullHeight = document.documentElement.scrollHeight;

      // Show footer when user reaches near bottom (160px threshold)
      if (windowHeight + scrollY >= fullHeight - 160) {
        if (!isVisible) {
          setIsVisible(true);
          setIsCollapsed(false);
        }
        
        // Auto-retract after 4 seconds to obligate user back to reading content
        clearTimeout(timer);
        timer = setTimeout(() => {
          setIsCollapsed(true);
        }, 4000);
      } else {
        // Hide completely if scrolling far up
        if (scrollY < fullHeight - 500) {
          setIsVisible(false);
          setIsCollapsed(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <footer 
      id="app-retractable-footer" 
      className={`retractable-footer glass-panel ${isCollapsed ? 'collapsed' : 'expanded'}`}
    >
      {/* Handle to manually expand / retract */}
      <button 
        type="button" 
        className="footer-toggle-handle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Ver detalles de autor" : "Ocultar footer"}
      >
        <Heart size={14} fill="#ff4d6d" color="#ff4d6d" />
        <span>Desarrollado con amor</span>
        {isCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Footer Details Body */}
      <div className="footer-content">
        <p className="footer-lead font-serif">
          desarrollado con amor y con fines sin animo de lucro por:
        </p>

        <h4 className="author-name font-serif">Fabian Jose Carmona</h4>

        <div className="author-contacts">
          <a href="mailto:fcarmonav6@soy.sena.edu.co" className="footer-link-pill">
            <Mail size={14} className="text-gold" />
            <span>contacto: <strong>fcarmonav6@soy.sena.edu.co</strong></span>
          </a>

          <a 
            href="https://github.com/FABIANC0505" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-link-pill"
          >
            <Code size={14} className="text-gold" />
            <span>github: <strong>https://github.com/FABIANC0505</strong></span>
            <ExternalLink size={12} opacity={0.7} />
          </a>
        </div>
      </div>

      <style>{`
        .retractable-footer {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 92%;
          max-width: 720px;
          z-index: 99;
          border-top-left-radius: var(--radius-lg);
          border-top-right-radius: var(--radius-lg);
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          background: linear-gradient(135deg, rgba(35, 8, 14, 0.95) 0%, rgba(18, 2, 6, 0.98) 100%);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1.5px solid var(--gold-400);
          border-bottom: none;
          box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.8), var(--shadow-gold-glow);
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 1.5rem 1.25rem;
        }

        .retractable-footer.collapsed {
          transform: translate(-50%, calc(100% - 36px));
        }

        .retractable-footer.expanded {
          transform: translate(-50%, 0);
        }

        .footer-toggle-handle {
          background: rgba(255, 77, 109, 0.15);
          border: 1px solid rgba(244, 209, 136, 0.4);
          color: var(--gold-300);
          font-size: 0.78rem;
          font-weight: 600;
          padding: 0.3rem 1.1rem;
          border-bottom-left-radius: var(--radius-full);
          border-bottom-right-radius: var(--radius-full);
          border-top: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: var(--transition-smooth);
          margin-bottom: 0.75rem;
        }

        .footer-toggle-handle:hover {
          background: rgba(255, 77, 109, 0.3);
          border-color: var(--gold-400);
          color: #fff;
        }

        .footer-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          width: 100%;
        }

        .footer-lead {
          font-size: 0.88rem;
          color: var(--rose-100);
          margin: 0;
        }

        .author-name {
          font-size: 1.25rem;
          color: var(--gold-300);
          margin: 0;
          letter-spacing: 0.02em;
        }

        .author-contacts {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 0.4rem;
        }

        .footer-link-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          color: var(--text-muted);
          font-size: 0.8rem;
          text-decoration: none;
          transition: var(--transition-smooth);
        }

        .footer-link-pill:hover {
          background: rgba(244, 209, 136, 0.15);
          border-color: var(--gold-400);
          color: #fff;
          transform: translateY(-1px);
        }
      `}</style>
    </footer>
  );
}
