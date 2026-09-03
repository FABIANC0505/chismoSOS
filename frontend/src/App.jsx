import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import AmbientPetals from './components/AmbientPetals';
import ExperienceViewer from './components/experience/ExperienceViewer';
import CreatorDashboard from './components/admin/CreatorDashboard';
import ExperienceEditor from './components/admin/ExperienceEditor';
import AuthModal from './components/admin/AuthModal';
import RetractableFooter from './components/RetractableFooter';
import { Heart, Sparkles, Send, Play, Lock, ShieldCheck, ChevronRight, Gift, LogOut } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(api.getCurrentUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeView, setActiveView] = useState('landing'); // 'landing' | 'dashboard' | 'editor' | 'preview'
  const [selectedExperienceId, setSelectedExperienceId] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [urlSlug, setUrlSlug] = useState(null);

  // Check if URL has ?slug=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    if (slug) {
      setUrlSlug(slug);
      setActiveView('public_viewer');
    } else if (currentUser) {
      setActiveView('dashboard');
    }
  }, [currentUser]);

  const handleLoginSuccess = () => {
    setCurrentUser(api.getCurrentUser());
    setIsAuthOpen(false);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setActiveView('landing');
  };

  // Demo experience for instant preview without even logging in!
  const demoExperience = {
    title: "Nuestra Historia de Amor y Amistad",
    recipient_name: "Valentina",
    sender_name: "Valentino",
    envelope_note: "Para la persona que ilumina mis días con su sonrisa...",
    selection_steps: [
      {
        id: 991,
        question: "Antes de ver este recuerdo... ¿prometes sonreír con cada detalle?",
        option_a: "¡Lo prometo con el corazón! ❤️",
        option_b: "¡De una! A ver qué chisme es... ✨",
        reaction_text: "¡Sabía que dirías que sí! Esta carta fue creada especialmente para ti..."
      }
    ],
    cards: [
      {
        id: 992,
        title: "Capítulo 1: Aquella Primera Tarde",
        image_url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
        text_content: "El 14 de septiembre en Colombia siempre nos recuerda que las mejores cosas de la vida se construyen con momentos sencillos pero inolvidables. Desde que compartimos nuestras primeras risas, supe que teníamos una conexión única que el tiempo solo haría más fuerte y especial.",
        word_count: 45
      },
      {
        id: 993,
        title: "Capítulo 2: Risas y Cómplices",
        image_url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
        text_content: "Gracias por estar presente en los días de celebración y también en los que simplemente necesitamos un café y una buena charla. El amor y la amistad sincera son el mayor regalo que podemos darnos, y hoy celebro tu presencia en mi vida con todo mi cariño.",
        word_count: 48
      },
      {
        id: 994,
        title: "Capítulo 3: Por Más Recuerdos Juntos",
        image_url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
        text_content: "Que este Día del Amor y la Amistad sea solo el pretexto para recordarte lo mucho que vales y lo afortunado que me siento de caminar a tu lado. ¡Feliz día hoy y siempre!",
        word_count: 32
      }
    ]
  };

  const handleStartDemo = () => {
    setPreviewData(demoExperience);
    setActiveView('preview');
  };

  return (
    <div className="app-root">
      {/* Background ambient floating petals */}
      <AmbientPetals count={20} />

      {/* 1. PUBLIC RECIPIENT MODE (URL ?slug=...) */}
      {activeView === 'public_viewer' && urlSlug && (
        <ExperienceViewer slug={urlSlug} />
      )}

      {/* 2. LIVE PREVIEW MODE (FROM CREATOR STUDIO OR DEMO) */}
      {activeView === 'preview' && previewData && (
        <ExperienceViewer
          experienceData={previewData}
          onBackToAdmin={() => {
            if (currentUser) {
              setActiveView(selectedExperienceId ? 'editor' : 'dashboard');
            } else {
              setActiveView('landing');
            }
          }}
        />
      )}

      {/* 3. CREATOR DASHBOARD */}
      {activeView === 'dashboard' && currentUser && (
        <CreatorDashboard
          user={currentUser}
          onLogout={handleLogout}
          onSelectExperience={(id) => {
            setSelectedExperienceId(id);
            setActiveView('editor');
          }}
          onLivePreview={(exp) => {
            setPreviewData(exp);
            setActiveView('preview');
          }}
        />
      )}

      {/* 4. EXPERIENCE EDITOR (CUSTOMIZATION PANEL) */}
      {activeView === 'editor' && currentUser && selectedExperienceId && (
        <ExperienceEditor
          experienceId={selectedExperienceId}
          onBack={() => {
            setSelectedExperienceId(null);
            setActiveView('dashboard');
          }}
          onLivePreview={(exp) => {
            setPreviewData(exp);
            setActiveView('preview');
          }}
        />
      )}

      {/* 5. LANDING SCREEN (WHEN NOT LOGGED IN) */}
      {activeView === 'landing' && (
        <div className="landing-layout animate-enter">
          {/* Top Bar */}
          <nav className="landing-nav glass-panel">
            <div className="nav-brand">
              <Heart size={26} fill="#ff4d6d" color="#ff4d6d" />
              <span className="brand-title font-serif">chismOSOS</span>
            </div>

            <div className="nav-actions">
              {currentUser ? (
                <>
                  <button
                    type="button"
                    className="btn-primary btn-sm"
                    onClick={() => setActiveView('dashboard')}
                    id="btn-go-dashboard"
                  >
                    <Gift size={14} />
                    <span>Ir a Mi Panel de Cartas</span>
                  </button>

                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={handleLogout}
                    id="btn-logout-landing"
                  >
                    <LogOut size={14} />
                    <span>Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={handleStartDemo}
                    id="btn-demo-experience"
                  >
                    <Play size={14} fill="#fff" />
                    <span>Ver Carta Demo</span>
                  </button>

                  <button
                    type="button"
                    className="btn-primary btn-sm"
                    onClick={() => setIsAuthOpen(true)}
                    id="btn-login-open"
                  >
                    <Lock size={14} />
                    <span>Ingresar / Registrarse</span>
                  </button>
                </>
              )}
            </div>
          </nav>

          {/* Hero Section */}
          <main className="landing-hero">
            <div className="hero-tag">
              <Sparkles size={16} className="text-gold" />
              <span>14 de Septiembre • Amor y Amistad en Colombia</span>
            </div>

            <h1 className="hero-heading font-serif">
              Un Detalle Inolvidable en Forma de <span className="text-gold-gradient">Carta Interactiva</span>
            </h1>

            <p className="hero-description">
              Sorprende a esa persona especial con una experiencia mágica: sobres virtuales con sello de cera, cuadros de preguntas interactivas y un carrusel de recuerdos con fotos y cartas dedicadas de hasta 250 palabras.
            </p>

            <div className="hero-cta-group">
              <button
                type="button"
                className="btn-primary cta-main"
                onClick={() => setIsAuthOpen(true)}
                id="btn-hero-cta"
              >
                <Gift size={20} />
                <span>Personalizar Mi Carta</span>
                <ChevronRight size={18} />
              </button>

              <button
                type="button"
                className="btn-secondary cta-secondary"
                onClick={handleStartDemo}
              >
                <Play size={18} fill="#fff" />
                <span>Experimentar Demostración</span>
              </button>
            </div>

            {/* Feature Highlights Grid */}
            <div className="features-grid">
              <div className="feature-card glass-card">
                <div className="feature-icon-wrap">
                  <Heart size={24} className="text-gold" />
                </div>
                <h3 className="feature-title font-serif">Sobre con Sello Interactivo</h3>
                <p className="feature-desc">
                  Una apertura elegante con animación de sobre y sello de cera personalizado con sus nombres.
                </p>
              </div>

              <div className="feature-card glass-card">
                <div className="feature-icon-wrap">
                  <Sparkles size={24} className="text-gold" />
                </div>
                <h3 className="feature-title font-serif">Cuadros de Decisión</h3>
                <p className="feature-desc">
                  Preguntas dinámicas con opciones tiernas y divertidas que revelan el camino al carrusel.
                </p>
              </div>

              <div className="feature-card glass-card">
                <div className="feature-icon-wrap">
                  <Send size={24} className="text-gold" />
                </div>
                <h3 className="feature-title font-serif">Carrusel de Recuerdos</h3>
                <p className="feature-desc">
                  Sube fotografías y textos emotivos de hasta 250 palabras por tarjeta con un contador en tiempo real.
                </p>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* Auth Modal */}
      {isAuthOpen && (
        <AuthModal
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setIsAuthOpen(false)}
        />
      )}

      {/* Retractable Footer Exclusivamente en Pantalla de Bienvenida */}
      {activeView === 'landing' && <RetractableFooter />}

      <style>{`
        .app-root {
          min-height: 100vh;
          position: relative;
        }

        .landing-layout {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem 1.25rem 4rem;
          position: relative;
          z-index: 1;
        }

        .landing-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.9rem 1.75rem;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%), rgba(35, 8, 14, 0.75);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1.5px solid var(--glass-border);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), inset 0 1.5px 1.5px rgba(255, 255, 255, 0.35);
          margin-bottom: 3.5rem;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .brand-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.01em;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .landing-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 860px;
          margin: 0 auto;
          gap: 1.75rem;
        }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(244, 209, 136, 0.12);
          border: 1.5px solid rgba(244, 209, 136, 0.4);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.3), 0 4px 15px rgba(0, 0, 0, 0.3);
          color: var(--gold-300);
          padding: 0.45rem 1.2rem;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .hero-heading {
          font-size: clamp(2.4rem, 5.5vw, 3.8rem);
          color: #fff;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .hero-description {
          font-size: 1.15rem;
          line-height: 1.7;
          color: var(--rose-100);
          max-width: 680px;
        }

        .hero-cta-group {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          margin-top: 0.5rem;
        }

        .cta-main {
          padding: 1rem 2rem;
          font-size: 1.05rem;
        }

        .cta-secondary {
          padding: 1rem 1.8rem;
          font-size: 1.05rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.75rem;
          margin-top: 4rem;
          width: 100%;
          text-align: left;
        }

        @media (max-width: 820px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
        }

        .feature-card {
          border-radius: var(--radius-lg);
          padding: 2.25rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%), rgba(43, 8, 17, 0.55);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1.5px solid var(--glass-border);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35), inset 0 1.5px 1.5px rgba(255, 255, 255, 0.28);
          transition: var(--transition-smooth);
        }

        .feature-card:hover {
          border-color: var(--glass-border-highlight);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45), 0 0 25px rgba(255, 77, 109, 0.3), inset 0 1.5px 2px rgba(255, 255, 255, 0.45);
          transform: translateY(-4px);
        }

        .feature-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          background: rgba(255, 77, 109, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 77, 109, 0.3);
        }

        .feature-title {
          font-size: 1.3rem;
          color: #fff;
        }

        .feature-desc {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .text-gold {
          color: var(--gold-300);
        }
      `}</style>
    </div>
  );
}
