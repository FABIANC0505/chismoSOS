import React from 'react';
import { 
  Heart, 
  Menu, 
  X, 
  Play, 
  Lock, 
  Gift, 
  LogOut, 
  ChevronLeft, 
  Sparkles, 
  Send,
  User
} from 'lucide-react';

export default function MobileNavbar({
  isOpen,
  onToggle,
  onClose,
  currentUser,
  onStartDemo,
  onOpenAuth,
  onGoDashboard,
  onLogout
}) {
  return (
    <>
      {/* Botón de despliegue fijo en la parte extrema izquierda */}
      <button
        type="button"
        id="btn-toggle-mobile-nav"
        className={`mobile-nav-trigger-btn ${isOpen ? 'active-open' : ''}`}
        onClick={onToggle}
        aria-label={isOpen ? "Recoger barra de navegación" : "Desplegar barra de navegación"}
        title={isOpen ? "Recoger menú" : "Desplegar menú"}
      >
        <div className="trigger-icon-wrap">
          {isOpen ? (
            <X size={19} className="trigger-icon" />
          ) : (
            <Menu size={19} className="trigger-icon" />
          )}
        </div>
        <span className="trigger-text font-serif">{isOpen ? 'Cerrar' : 'Menú'}</span>
        <span className="trigger-heart-dot">
          <Heart size={10} fill="#ff4d6d" color="#ff4d6d" />
        </span>
      </button>

      {/* Telón de fondo (Backdrop) con desenfoque para cerrar al tocar fuera */}
      <div 
        className={`mobile-nav-backdrop ${isOpen ? 'visible' : ''}`} 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menú desplegable lateral recogido en la extrema izquierda */}
      <aside 
        id="mobile-collapsible-navbar"
        className={`mobile-nav-drawer glass-panel ${isOpen ? 'open' : 'closed'}`}
        aria-label="Menú de navegación móvil"
      >
        {/* Cabecera del menú */}
        <div className="drawer-header">
          <div className="drawer-brand">
            <div className="brand-icon-box">
              <Heart size={22} fill="#ff4d6d" color="#ff4d6d" className="pulse-heart" />
            </div>
            <div>
              <span className="brand-title font-serif">chismOSOS</span>
              <span className="brand-subtitle">Amor y Amistad 2026</span>
            </div>
          </div>

          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Recoger menú"
            title="Recoger menú"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Insignia festiva */}
        <div className="drawer-tag">
          <Sparkles size={13} className="text-gold" />
          <span>14 de Septiembre • Colombia</span>
        </div>

        {/* Perfil o Estado de Usuario */}
        {currentUser && (
          <div className="drawer-user-card">
            <div className="user-avatar-badge">
              <User size={16} />
            </div>
            <div className="user-details">
              <span className="user-role-label">Sesión iniciada</span>
              <strong className="user-name-label">{currentUser.username}</strong>
            </div>
          </div>
        )}

        {/* Acciones principales de navegación */}
        <div className="drawer-actions">
          {currentUser ? (
            <>
              <button
                type="button"
                className="btn-primary drawer-btn-main"
                onClick={() => {
                  onGoDashboard();
                  onClose();
                }}
                id="btn-drawer-dashboard"
              >
                <Gift size={17} />
                <span>Mi Panel de Cartas</span>
              </button>

              <button
                type="button"
                className="btn-secondary drawer-btn-secondary"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                id="btn-drawer-logout"
              >
                <LogOut size={16} />
                <span>Cerrar Sesión</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn-primary drawer-btn-main"
                onClick={() => {
                  onOpenAuth();
                  onClose();
                }}
                id="btn-drawer-login"
              >
                <Lock size={16} />
                <span>Ingresar / Registrarse</span>
              </button>

              <button
                type="button"
                className="btn-secondary drawer-btn-secondary"
                onClick={() => {
                  onStartDemo();
                  onClose();
                }}
                id="btn-drawer-demo"
              >
                <Play size={16} fill="#fff" />
                <span>Ver Carta Demo</span>
              </button>
            </>
          )}
        </div>

        {/* Atajos y características de la experiencia */}
        <div className="drawer-features-list">
          <span className="features-list-title font-serif">Detalles Especiales</span>

          <div className="feature-item-pill">
            <div className="pill-icon">💌</div>
            <div className="pill-info">
              <strong>Sobre con Sello de Cera</strong>
              <p>Animación y lacre interactivo</p>
            </div>
          </div>

          <div className="feature-item-pill">
            <div className="pill-icon">✨</div>
            <div className="pill-info">
              <strong>Cuadros de Decisión</strong>
              <p>Preguntas tiernas previas</p>
            </div>
          </div>

          <div className="feature-item-pill">
            <div className="pill-icon">📸</div>
            <div className="pill-info">
              <strong>Carrusel de Recuerdos</strong>
              <p>Fotos y textos de hasta 250 palabras</p>
            </div>
          </div>
        </div>

        {/* Pie del menú con botón explícito para recoger */}
        <div className="drawer-footer">
          <button
            type="button"
            className="drawer-retract-btn"
            onClick={onClose}
          >
            <ChevronLeft size={16} />
            <span>Recoger menú</span>
          </button>
          <span className="drawer-copyright">Celebrando el amor sincero ❤️</span>
        </div>
      </aside>

      <style>{`
        /* Botón de despliegue fijado en la extrema izquierda */
        .mobile-nav-trigger-btn {
          display: none;
          position: fixed;
          left: 0;
          top: 18px;
          z-index: 1100;
          align-items: center;
          gap: 0.45rem;
          padding: 0.5rem 0.9rem 0.5rem 0.75rem;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          border-top-right-radius: var(--radius-full);
          border-bottom-right-radius: var(--radius-full);
          background: linear-gradient(135deg, rgba(80, 15, 30, 0.96) 0%, rgba(30, 6, 12, 0.98) 100%);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1.5px solid var(--gold-400);
          border-left: none;
          box-shadow: 
            0 8px 25px rgba(0, 0, 0, 0.65), 
            0 0 16px rgba(255, 77, 109, 0.35),
            inset 0 1px 1.5px rgba(255, 255, 255, 0.35);
          color: #fff;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .mobile-nav-trigger-btn:hover {
          background: linear-gradient(135deg, rgba(128, 26, 51, 0.98) 0%, rgba(55, 12, 22, 0.98) 100%);
          transform: translateX(4px);
          box-shadow: 
            0 10px 30px rgba(0, 0, 0, 0.75), 
            0 0 22px rgba(244, 209, 136, 0.5),
            inset 0 1px 2px rgba(255, 255, 255, 0.5);
        }

        .mobile-nav-trigger-btn:active {
          transform: scale(0.96) translateX(2px);
        }

        .mobile-nav-trigger-btn.active-open {
          border-color: var(--ruby-400);
          background: rgba(43, 8, 17, 0.96);
        }

        .trigger-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold-300);
        }

        .trigger-text {
          font-size: 0.84rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          color: #fff;
        }

        .trigger-heart-dot {
          display: inline-flex;
          align-items: center;
          animation: pulseHeart 1.5s infinite;
        }

        /* Backdrop */
        .mobile-nav-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(10, 2, 4, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 1150;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s ease;
        }

        .mobile-nav-backdrop.visible {
          opacity: 1;
          pointer-events: auto;
        }

        /* Drawer desplegable */
        .mobile-nav-drawer {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: min(320px, 86vw);
          z-index: 1200;
          background: linear-gradient(180deg, rgba(43, 8, 17, 0.98) 0%, rgba(20, 3, 7, 0.99) 100%);
          backdrop-filter: blur(30px) saturate(200%);
          -webkit-backdrop-filter: blur(30px) saturate(200%);
          border-right: 1.5px solid rgba(244, 209, 136, 0.4);
          border-top: none;
          border-left: none;
          border-bottom: none;
          box-shadow: 
            15px 0 50px rgba(0, 0, 0, 0.85),
            0 0 35px rgba(255, 77, 109, 0.25),
            inset 0 1.5px 2px rgba(255, 255, 255, 0.2);
          padding: 1.5rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          overflow-y: auto;
          transform: translateX(-105%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .mobile-nav-drawer.open {
          transform: translateX(0);
        }

        /* Cabecera del Drawer */
        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 225, 235, 0.12);
        }

        .drawer-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .brand-icon-box {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: rgba(255, 77, 109, 0.18);
          border: 1px solid rgba(255, 77, 109, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: #fff;
          display: block;
          line-height: 1.1;
        }

        .brand-subtitle {
          font-size: 0.72rem;
          color: var(--gold-300);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .drawer-close-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: var(--rose-100);
          width: 36px;
          height: 36px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .drawer-close-btn:hover {
          background: rgba(255, 77, 109, 0.3);
          border-color: var(--ruby-400);
          color: #fff;
          transform: scale(1.05);
        }

        .drawer-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(244, 209, 136, 0.12);
          border: 1px solid rgba(244, 209, 136, 0.35);
          color: var(--gold-300);
          padding: 0.3rem 0.8rem;
          border-radius: var(--radius-full);
          font-size: 0.74rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          width: fit-content;
        }

        .drawer-user-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: var(--radius-md);
        }

        .user-avatar-badge {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--ruby-400), var(--ruby-500));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }

        .user-details {
          display: flex;
          flex-direction: column;
        }

        .user-role-label {
          font-size: 0.7rem;
          color: var(--rose-200);
        }

        .user-name-label {
          font-size: 0.95rem;
          color: #fff;
        }

        /* Botones de acción */
        .drawer-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .drawer-btn-main {
          width: 100%;
          padding: 0.85rem 1.25rem;
          font-size: 0.95rem;
          justify-content: center;
        }

        .drawer-btn-secondary {
          width: 100%;
          padding: 0.8rem 1.25rem;
          font-size: 0.92rem;
          justify-content: center;
        }

        /* Lista de características */
        .drawer-features-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-top: 0.5rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 225, 235, 0.1);
        }

        .features-list-title {
          font-size: 0.95rem;
          color: var(--gold-300);
          margin-bottom: 0.2rem;
        }

        .feature-item-pill {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.85rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-sm);
          transition: var(--transition-smooth);
        }

        .feature-item-pill:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(244, 209, 136, 0.3);
        }

        .pill-icon {
          font-size: 1.2rem;
        }

        .pill-info strong {
          display: block;
          font-size: 0.82rem;
          color: #fff;
          line-height: 1.2;
        }

        .pill-info p {
          font-size: 0.72rem;
          color: var(--rose-200);
          margin: 0;
        }

        /* Footer del drawer */
        .drawer-footer {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 225, 235, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .drawer-retract-btn {
          width: 100%;
          background: rgba(255, 77, 109, 0.12);
          border: 1px solid rgba(244, 209, 136, 0.35);
          color: var(--gold-300);
          padding: 0.55rem;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .drawer-retract-btn:hover {
          background: rgba(255, 77, 109, 0.25);
          color: #fff;
          border-color: var(--gold-400);
        }

        .drawer-copyright {
          font-size: 0.72rem;
          color: var(--rose-200);
          opacity: 0.8;
        }

        /* Responsividad: Mostrar el botón y habilitar en pantallas móviles y tablets */
        @media (max-width: 860px) {
          .mobile-nav-trigger-btn {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}
