# Recorrido de Implementación: chismOSOS

Plataforma interactiva del **Día del Amor y la Amistad** (14 de Septiembre - Colombia) construida con una arquitectura **MVC ordenada en el backend (Python/FastAPI/SQLAlchemy)** y una experiencia de usuario en **React** con estética festiva y elegante (tonos vino tinto aterciopelado, rosas empolvados, acentos dorados champán y caída suave de pétalos).

---

## 1. Demostración en Video del Flujo Completo

A continuación se presenta la grabación completa de las pruebas de usuario interactuando con la carta, abriendo el sello de cera, respondiendo la pregunta interactiva, navegando el carrusel de recuerdos, registrándose y personalizando una nueva carta en el editor:

![Demostración interactiva de chismoSOS](file:///C:/Users/WORK/.gemini/antigravity-ide/brain/b87f6464-67c0-4f81-89e1-75d4de3fb832/chismosos_demo_1788392253102.webp)

---

## 2. Puntos Clave Implementados

### A. Experiencia del Destinatario (Visualizador Interactivo)
1. **Sobre Virtual con Sello de Cera**:
   - Estampilla conmemorativa del 14 de Septiembre en Colombia.
   - Información de entrega personalizada (*"Para: [Nombre]"*, *"De: [Remitente]"* y nota de cubierta).
   - Sello de cera interactivo con pulso que, al hacer clic, rompe el lacre y lanza confeti de amor.
2. **Cuadro de Selecciones Previas**:
   - Preguntas interactivas con opciones tiernas y divertidas para continuar con la experiencia.
   - Retroalimentación con mensaje de reacción antes de pasar al carrusel.
3. **Carrusel de Recuerdos (Fotos + Textos de hasta 250 palabras)**:
   - Presentación editorial con marco fotográfico, ampliación en pantalla completa (*lightbox*) y tipografía estilizada.
   - Navegación táctil y botones con controles anterior/siguiente.
   - Estado final de celebración con botón interactivo de *"Enviar un abrazo de vuelta ❤️"* y opción de revivir la carta.

### B. Apartado de Personalización y Usuario (Creator Studio)
1. **Autenticación con Usuario y Contraseña**:
   - Registro e inicio de sesión seguro con hash `bcrypt` y tokens JWT.
2. **Panel de Gestión (Dashboard)**:
   - Listado de cartas creadas por el usuario.
   - Botón para copiar enlace único compartible (`/?slug=...`) para enviar fácilmente por WhatsApp.
   - Acceso directo a edición y previsualización en vivo.
3. **Editor de Tarjetas y Carrusel**:
   - Carga de imágenes locales desde el dispositivo o mediante URL externa con previsualización inmediata.
   - **Contador de palabras en tiempo real** con validación estricta de **máximo 250 palabras por tarjeta**:
     - Estado Seguro (< 220 palabras): indicador verde.
     - Estado Advertencia (220-250 palabras): indicador ámbar.
     - Estado Peligro (> 250 palabras): alerta roja y bloqueo de guardado en frontend y backend.
   - La paleta visual y los colores oficiales se mantienen inalterados; solo se personalizan los datos y fotografías.

---

## 3. Arquitectura del Proyecto (Estructura MVC Limpia)

```
chismoSOS/
├── backend/
│   ├── app/
│   │   ├── config.py                 # Parámetros, secretos y límite de 250 palabras
│   │   ├── database/
│   │   │   └── connection.py         # SQLAlchemy engine y sesiones
│   │   ├── models/                   # [M] MODELOS
│   │   │   ├── user.py               # Modelo User (autenticación)
│   │   │   ├── experience.py         # Modelo Experience (carta)
│   │   │   ├── selection_step.py     # Modelo SelectionStep (cuadros de selección)
│   │   │   └── card.py               # Modelo Card (tarjetas del carrusel)
│   │   ├── views/                    # [V] VISTAS / SCHEMAS PYDANTIC
│   │   │   ├── user_view.py          # Serializadores de usuario y token
│   │   │   ├── experience_view.py    # Vistas de experiencia (pública y privada)
│   │   │   ├── card_view.py          # Esquema con validador estricto <= 250 palabras
│   │   │   └── selection_view.py     # Esquemas de preguntas interactivas
│   │   ├── services/                 # SERVICIOS DE NEGOCIO
│   │   │   ├── auth_service.py       # Bcrypt hash, JWT y middleware de seguridad
│   │   │   └── storage_service.py    # Validación y guardado seguro de fotos
│   │   ├── controllers/              # [C] CONTROLADORES
│   │   │   ├── auth_controller.py    # Endpoints de login, register y perfil
│   │   │   ├── experience_controller.py # CRUD de cartas y vista pública del destinatario
│   │   │   ├── card_controller.py    # Gestión de diapositivas y subida de archivos
│   │   │   └── selection_controller.py  # Pasos interactivos de decisión
│   │   └── main.py                   # Inicializador FastAPI, CORS y rutas
│   ├── uploads/                      # Carpeta de almacenamiento local de imágenes
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AmbientPetals.jsx     # Efecto de pétalos flotantes
│   │   │   ├── experience/
│   │   │   │   ├── EnvelopeIntro.jsx    # Sobre virtual con sello interactivo
│   │   │   │   ├── SelectionQuiz.jsx    # Cuadro de decisiones
│   │   │   │   ├── PhotoCarousel.jsx    # Carrusel con fotos y textos dedicados
│   │   │   │   └── ExperienceViewer.jsx # Orquestador de la carta
│   │   │   └── admin/
│   │   │       ├── AuthModal.jsx        # Login y Registro con usuario/contraseña
│   │   │       ├── CreatorDashboard.jsx # Panel principal del usuario
│   │   │       ├── ExperienceEditor.jsx # Editor de detalles y carrusel
│   │   │       ├── CardEditorModal.jsx  # Subida de imagen y validador de 250 palabras
│   │   │       └── StepEditorModal.jsx  # Editor de preguntas interactivas
│   │   │   ├── MobileNavbar.jsx      # Barra de navegación móvil con botón fijo en extrema izquierda
│   │   │   └── RetractableFooter.jsx # Pie de página retráctil con datos de autoría
│   │   ├── services/
│   │   │   └── api.js                # Cliente de conexión API
│   │   ├── index.css                 # Sistema de diseño y variables CSS
│   │   └── App.jsx                   # Ruteo dinámico por URL slug o panel
│   └── package.json
└── README.md
```

---

## 4. Mejoras Recientes: Navbar Móvil Plegable con Botón Fijado

- **Botón Fijado en la Extrema Izquierda**: Anclado en `left: 0; top: 18px` como una pestaña de lujo en cristal vino y ribete de oro champán, con pulso de corazón animado y texto *"Menú"*.
- **Despliegue y Recogida Fluida**: El menú se recoge hacia el extremo izquierdo (`transform: translateX(-105%)`) y se despliega suavemente mostrando todas las acciones clave (*"Ingresar / Registrarse"*, *"Ver Carta Demo"* o *"Mi Panel de Cartas"*), insignia conmemorativa y atajos.
- **Limpieza Visual en Móvil**: La cabecera superior móvil ahora es una insignia central elegante sin botones amontonados ni desbordamientos horizontales.

---

## 5. Cómo Ejecutar el Proyecto Localmente

### Backend (Python):
```powershell
cd c:\PRPDETO\chismoSOS\backend
.\venv\Scripts\activate
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Documentación interactiva disponible en:* `http://127.0.0.1:8000/docs`

### Frontend (React / Vite):
```powershell
cd c:\PRPDETO\chismoSOS\frontend
npm run dev
```
*Aplicación disponible en:* `http://localhost:5173`
*(Si se comparte un enlace a un destinatario, se accede automáticamente mediante `http://localhost:5173/?slug=[identificador]`)*

