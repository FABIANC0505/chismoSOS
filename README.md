# chismOSOS — Carta Interactiva de Amor y Amistad (14 de Septiembre)

Proyecto enfocado para detalles únicos de **Amor y Amistad** (celebrado el 14 de septiembre en Colombia) y fechas especiales como aniversarios y cumpleaños. Combina un sobre interactivo con sello de cera virtual, cuadros de preguntas con opciones cariñosas, un carrusel de recuerdos fotográficos y dedicatorias de hasta 250 palabras, con un panel de personalización protegido por usuario y contraseña.

---

## Estructura del Proyecto

El proyecto está diseñado bajo una arquitectura limpia y desacoplada:

- **Backend (Python / FastAPI / SQLAlchemy)**: Estructura MVC organizada en `models/`, `views/` (esquemas Pydantic), `controllers/` y `services/`.
- **Frontend (React / Vite)**: Sistema de diseño en Vanilla CSS con tipografías Google Fonts (`Playfair Display` y `Outfit`), paleta romántica (vino tinto aterciopelado, rosas empolvados, acentos dorados champán) y partículas sutiles de pétalos flotantes.

---

## Cómo Ejecutar el Proyecto

### 1. Iniciar el Backend (Python)
Desde la terminal en Windows:
```powershell
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Health Check: `http://127.0.0.1:8000/`
- Documentación Interactiva Swagger: `http://127.0.0.1:8000/docs`

### 2. Iniciar el Frontend (React)
En otra terminal:
```powershell
cd frontend
npm run dev
```
- Aplicación Web: `http://localhost:5173/`

---

## Características Principales

1. **Sobre con Sello de Cera**: Animación de apertura y estampilla conmemorativa del 14 de Septiembre.
2. **Cuadro de Selecciones Interactivo**: Preguntas guiadas con opciones divertidas/tiernas y retroalimentación inmediata.
3. **Carrusel de Fotos y Textos**:
   - Cada diapositiva cuenta con fotografía enmarcada, título y dedicatoria.
   - **Límite estricto de 250 palabras por tarjeta** con contador visual en tiempo real.
   - Botón final de celebración: *"Enviar un abrazo de vuelta ❤️"*.
4. **Panel de Usuario (Creator Studio)**:
   - Registro e inicio de sesión seguro con usuario y contraseña (hash `bcrypt`).
   - Carga de imágenes locales desde el dispositivo o URLs externas.
   - Generación de enlace único compartible (`/?slug=...`) para enviar directamente por WhatsApp.
