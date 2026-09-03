# Plan de Proyecto: chismoSOS - Detalle Interactivo de Amor y Amistad

Un detalle digital interactivo para celebrar el **Día del Amor y la Amistad** (14 de septiembre en Colombia), combinando la emoción de una carta romántica/afectiva con una experiencia digital inmersiva: sobres interactivos, preguntas/selecciones guiadas, carrusel de recuerdos (fotos + textos de hasta 250 palabras), y un panel de personalización protegido por usuario y contraseña.

---

## 1. Levantamiento de Requisitos

### A. Experiencia del Destinatario (Visualizador de la Carta)
1. **Apertura Inmersiva / Sello de Sobre**:
   - Entrada visual como un sobre elegante con sello de cera virtual o lacre que al hacer clic se abre con animación fluida.
   - Mensaje de bienvenida personalizado ("Para: [Nombre], de parte de: [Remitente]").
2. **Cuadro de Selecciones Interactivas**:
   - Preguntas o elecciones interactivas para continuar ("¿Aceptas abrir este recuerdo?", "¿Qué tan list@ estás para esto?", etc.).
   - Retroalimentación inmediata con micro-animaciones cariñosas o divertidas antes de pasar al carrusel.
3. **Carrusel de Recuerdos (Tarjetas / Slides)**:
   - Navegación táctil / botones elegantes (siguiente, anterior, miniaturas o puntos).
   - Cada tarjeta muestra:
     - Fotografía en alta resolución con marco estilizado.
     - Texto dedicado (máximo 250 palabras con tipografía editorial legible).
     - Fecha o subtítulo especial opcional.
   - Transiciones suaves (fade / deslizamiento suave estilo revista de recuerdos).
4. **Efectos Ambientales / Sensoriales**:
   - Partículas sutiles de fondo (pétalos de rosa, destellos dorados suaves).
   - Botón opcional de música de fondo (reproductor de audio delicado con control de play/mute).
5. **Cierre y Mensaje Final**:
   - Pantalla de despedida con botón para dejar una reacción rápida o mensaje de respuesta.

---

### B. Panel de Personalización y Creación (Creator Studio)
1. **Autenticación**:
   - Registro e inicio de sesión con usuario y contraseña (hash seguro con bcrypt).
   - Manejo de sesión (JWT o tokens de sesión).
2. **Gestor de Cartas / Experiencias**:
   - Crear una nueva experiencia interactiva.
   - Listar experiencias existentes y editarlas.
   - Enlace único compartible (URL con slug o identificador único para enviar por WhatsApp u otras redes).
3. **Editor de Tarjetas / Carrusel**:
   - Carga de imágenes (soporte para JPG, PNG, WEBP).
   - Campo de texto con **contador de palabras en tiempo real** (límite estricto de 250 palabras).
   - Reordenar tarjetas (subir / bajar o drag-and-drop).
   - Previsualización en vivo (vista previa exacta de cómo lo verá el destinatario).
   - Configuración de las preguntas/selecciones iniciales.
   - *Nota de diseño*: La interfaz conserva estrictamente la paleta y estilo oficial (rojos románticos, blush pink, marfil, dorados champán); el usuario solo personaliza los contenidos (imágenes y textos).

---

### C. Backend en Python (Arquitectura MVC Estricta)
1. **Estructura Propuesta**:
   - **Modelos (`models/`)**:
     - `User`: Id, username, password_hash, created_at.
     - `Experience` (Carta): Id, user_id, recipient_name, sender_name, slug/share_token, background_music_url, created_at.
     - `InteractiveStep` (Preguntas/Selección): Id, experience_id, question, options (JSON), step_order.
     - `Card` (Diapositivas del carrusel): Id, experience_id, image_url, text_content, order_index.
   - **Controladores (`controllers/`)**:
     - `auth_controller.py`: Registro, login, verificación de sesión.
     - `experience_controller.py`: CRUD de la carta y enlaces públicos.
     - `card_controller.py`: Subida de imágenes, validación de palabras (<= 250), reordenamiento.
   - **Vistas / Schemas (`views/` o `schemas/`)**:
     - Serializadores Pydantic/DTOs para respuestas limpias en JSON consumidas por React.
   - **Servicios / Utilidades (`services/`)**:
     - `auth_service.py` (hashing, JWT).
     - `storage_service.py` (procesamiento y almacenamiento seguro de imágenes).
2. **Framework Recomendado**:
   - **FastAPI** (Python 3.10+): Alto rendimiento, documentación OpenAPI automática, tipado estricto con Pydantic, muy limpio para estructurar en MVC.

---

### D. Frontend en React (Arquitectura por Componentes)
1. **Estructura**:
   - `src/components/experience/`: Envelope, InteractiveQuiz, CarouselCard, AmbientParticles, MusicPlayer.
   - `src/components/admin/`: AuthForm, ExperienceEditor, CardUploader, WordCounter, LivePreview.
   - `src/services/api.js`: Cliente Axios o Fetch con interceptores de autenticación.
   - `src/styles/`: Sistema de diseño con variables CSS puras (paleta cromática Amor y Amistad, tipografías elegantes vía Google Fonts).

---

## 2. Sugerencias de Valor Agregado

1. **Música de Fondo Opcional**:
   - Permitir al creador subir un archivo de audio o seleccionar una melodía romántica acústica predeterminada libre de derechos.
2. **Efecto Máquina de Escribir (Typewriter)**:
   - Al mostrar cada tarjeta, el texto puede revelarse suavemente o tener un botón para "leer a ritmo de carta".
3. **Código de Acceso Secreto (Opcional)**:
   - Posibilidad de añadir una pequeña clave o fecha especial para que el destinatario la ingrese antes de abrir el sobre (aumenta la expectativa y privacidad).
4. **Vista de Celular Optimizada (Mobile-First)**:
   - Dado que el 90% de estas experiencias se abren desde WhatsApp en smartphones, priorizar un diseño táctil fluido para móviles.

---

## 3. Plan de Fases de Implementación

- **Fase 1: Configuración de Base y Estructura MVC Backend**:
  - Inicializar entorno virtual Python, dependencias (FastAPI, Uvicorn, SQLAlchemy, Pydantic, Passlib/Bcrypt).
  - Configurar SQLite/Base de datos y estructura de directorios MVC.
  - Implementar autenticación y endpoints básicos.
- **Fase 2: Frontend Base (Vite + React) y Sistema de Diseño**:
  - Inicializar frontend con Vite + React.
  - Crear sistema de estilos con paleta de Amor y Amistad (variables CSS, Google Fonts: Playfair/Outfit).
- **Fase 3: Experiencia Interactiva del Destinatario**:
  - Animación del sobre y sello.
  - Cuadro de selecciones/preguntas.
  - Carrusel inmersivo con visualización de tarjeta y contador de lectura.
- **Fase 4: Panel de Personalización (Creator Studio)**:
  - Registro / Login.
  - Carga de imágenes con preview.
  - Editor con límite de 250 palabras y contador visual.
  - Generación de link compartible.
- **Fase 5: Pruebas y Pulido**:
  - Verificación de flujo completo, responsive design y rendimiento.

---

## 4. Preguntas para Validación
1. ¿Te parece bien utilizar **FastAPI** para el backend en Python por su velocidad y documentación interactiva, o prefieres **Flask**?
2. Para el almacenamiento de imágenes en esta etapa, ¿te parece adecuado guardarlas localmente en una carpeta `uploads/` servida por el backend o planeas un almacenamiento en la nube (ej. Cloudinary/S3)?
