# 🚀 Guía Definitiva de Despliegue: chismOSOS
### Frontend (Vercel) + Backend (Render) + Fotos (Cloudflare R2)

Esta guía te explica paso a paso cómo poner tu aplicación **chismOSOS** en producción con dominio público, certificado SSL (HTTPS) y almacenamiento de imágenes global sin costo inicial.

---

## 📋 Arquitectura del Despliegue
- **Frontend**: [Vercel](https://vercel.com) (Alojamiento ultrarrápido para Vite/React con CDN global).
- **Backend**: [Render](https://render.com) (Web Service gratuito para FastAPI / Python).
- **Fotos y Recuerdos**: [Cloudflare R2](https://www.cloudflare.com/products/r2/) (Almacenamiento de objetos compatible con S3, **0 dólares en cargos por tráfico de salida**).

---

## PASO 1: Configurar Cloudflare R2 (Almacenamiento de Fotos)

Cloudflare R2 almacenará las fotos que los usuarios suban a sus cartas sin saturar el servidor y con carga instantánea.

1. **Crear o entrar a tu cuenta**:
   - Entra a [dash.cloudflare.com](https://dash.cloudflare.com/) e inicia sesión (o regístrate gratis).
2. **Crear el Bucket de R2**:
   - En el menú lateral izquierdo, haz clic en **R2 Object Storage**.
   - Haz clic en **Create bucket**.
   - Asigna un nombre a tu bucket, por ejemplo: `chismosos-fotos`.
   - Ubicación: Déjalo en **Automatic** y haz clic en **Create bucket**.
3. **Habilitar Acceso Público al Bucket**:
   - Dentro del bucket creado, ve a la pestaña **Settings**.
   - Busca la sección **Public Access** (Acceso público).
   - En **R2.dev Subdomain**, haz clic en **Allow Access** (Permitir acceso) y confirma escribiendo `allow`.
   - Copia la URL pública generada (ejemplo: `https://pub-a1b2c3d4e5f6.r2.dev`).
4. **Generar el Token de API (Credenciales S3)**:
   - Regresa a la página principal de **R2 Object Storage**.
   - En la columna derecha, haz clic en **Manage R2 API Tokens**.
   - Haz clic en **Create API token**.
   - Configuración del Token:
     - Nombre: `chismosos-backend-token`
     - Permisos: Selecciona **Object Read & Write**.
     - Buckets: Selecciona **Apply to specific buckets only** y elige `chismosos-fotos`.
     - Haz clic en **Create API Token**.
   - Guarda en un bloc de notas los datos que te muestra la pantalla:
     - **Account ID** (aparece a la derecha en la página de R2).
     - **Access Key ID**.
     - **Secret Access Key**.

---

## PASO 2: Desplegar el Backend en Render

1. **Crear cuenta en Render**:
   - Ve a [render.com](https://render.com/) e inicia sesión con tu cuenta de **GitHub**.
2. **Crear un nuevo Web Service**:
   - Haz clic en **New +** y selecciona **Web Service**.
   - Selecciona tu repositorio: `FABIANC0505/chismoSOS`.
   - Configura los datos del servicio:
     - **Name**: `chismosos-backend`
     - **Root Directory**: `backend`  *(⚠️ Muy importante escribir `backend`)*
     - **Runtime**: `Python 3`
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
     - **Instance Type**: **Free**
3. **Configurar las Variables de Entorno en Render**:
   - En la misma página, despliega la sección **Advanced** o **Environment Variables**, y agrega:

     | Clave (Key) | Valor (Value) | Descripción |
     |---|---|---|
     | `PYTHON_VERSION` | `3.11.9` | Versión estable de Python |
     | `SECRET_KEY` | `chismosos_super_secret_jwt_2026_colombia` | Cadena secreta para tokens |
     | `R2_ACCOUNT_ID` | Tu Account ID de Cloudflare | De Paso 1 |
     | `R2_ACCESS_KEY_ID` | Tu Access Key ID de Cloudflare | De Paso 1 |
     | `R2_SECRET_ACCESS_KEY` | Tu Secret Access Key de Cloudflare | De Paso 1 |
     | `R2_BUCKET_NAME` | `chismosos-fotos` | Nombre del bucket |
     | `R2_PUBLIC_DOMAIN` | `https://pub-xxxx.r2.dev` | URL pública de tu bucket |
     | `DATABASE_URL` | *(Opcional)* | Si deseas conectar un PostgreSQL gratuito en Render o Neon; si se deja en blanco usará SQLite |
     | `FRONTEND_URL` | *(Lo agregaremos en el Paso 4)* | URL de Vercel |

4. **Desplegar**:
   - Haz clic en **Create Web Service**.
   - Espera unos 2-3 minutos mientras instala dependencias e inicia.
   - Cuando diga **`Your service is live 🎉`**, copia la URL pública de tu backend:
     - Ejemplo: `https://chismosos-backend.onrender.com`

---

## PASO 3: Desplegar el Frontend en Vercel

1. **Crear cuenta en Vercel**:
   - Ve a [vercel.com](https://vercel.com/) e inicia sesión con **GitHub**.
2. **Importar el Proyecto**:
   - Haz clic en **Add New...** -> **Project**.
   - Busca tu repositorio `FABIANC0505/chismoSOS` y haz clic en **Import**.
3. **Configurar el Directorio Raíz del Frontend**:
   - En **Root Directory**, haz clic en **Edit**.
   - Selecciona la carpeta **`frontend`** y haz clic en **Continue**.
   - Vercel detectará automáticamente **Vite** como framework.
4. **Agregar la Variable de Entorno**:
   - Despliega la sección **Environment Variables**.
   - Agrega la siguiente variable:
     - **Key**: `VITE_API_URL`
     - **Value**: La URL de tu backend en Render obtenida en el Paso 2 (sin barra diagonal al final).
       - Ejemplo: `https://chismosos-backend.onrender.com`
5. **Desplegar**:
   - Haz clic en **Deploy**.
   - En ~40 segundos Vercel compilará tu aplicación y te felicitará con confeti virtual.
   - Copia la URL pública generada (ejemplo: `https://chismosos.vercel.app`).

---

## PASO 4: Enlazar CORS en Render

Para que tu backend acepte las peticiones que provienen de tu dominio de Vercel de forma segura:

1. Vuelve a tu panel de **Render** -> entra a tu Web Service `chismosos-backend`.
2. Ve a la pestaña **Environment**.
3. Agrega o actualiza la variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: Tu URL de Vercel (ejemplo: `https://chismosos.vercel.app`)
4. Haz clic en **Save Changes**. Render aplicará el cambio en segundos.

---

## PASO 5: ¡Verificación en Vivo!

1. Abre tu URL de Vercel (`https://tu-proyecto.vercel.app`) en tu navegador o celular.
2. Haz clic en **Ingresar / Registrarse** y crea una cuenta nueva.
3. En el panel de **Mis Cartas**, crea una carta y agrega una o varias fotos con sus dedicatorias.
4. Observa que las fotos se suben directamente a Cloudflare R2 y se muestran en alta calidad.
5. Copia el enlace generado con el botón **Compartir** y ábrelo en una ventana de incógnito o envíatelo por WhatsApp:
   - Verás el sobre con sello de cera.
   - Al abrirlo, el cuadro de selecciones con el botón interactivo **"NO 💔"** que se escapa.
   - Y el carrusel de fotos con caída suave de pétalos románticos.

---

## 💡 Consejos de Mantenimiento

- **Tiempo de inicio en Render (Free Tier)**:
  Los servicios gratuitos de Render entran en reposo si pasan 15 minutos sin visitas. La primera petición puede tardar unos 25-30 segundos en despertar el servidor. Para una ocasión especial (como el 14 de septiembre), puedes visitar la página unos minutos antes para que esté 100% activa.
- **Despliegues Automáticos con Git**:
  Cada vez que hagas un `git push origin main`, tanto Vercel como Render actualizarán tu aplicación automáticamente sin que tengas que hacer nada manual.
