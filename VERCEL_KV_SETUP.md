# Configuración de Base de Datos (Upstash Redis)

Este proyecto usa **Upstash Redis** (a través de Vercel KV) para almacenar el contenido de la aplicación.

## 🚀 Configuración en Producción (Vercel)

### Opción 1: Desde Vercel Marketplace (Recomendado)

1. **Conectar Upstash desde Vercel:**
   - Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
   - Navega a la pestaña **Storage**
   - Haz clic en **Create New** → **Marketplace Database Providers**
   - Selecciona **Upstash** (Serverless DB - Redis)
   - Sigue el wizard para crear/conectar tu base de datos
   - Vercel configurará automáticamente las variables de entorno

### Opción 2: Configuración Manual desde Upstash

1. **Crear cuenta en Upstash:**
   - Ve a [console.upstash.com](https://console.upstash.com)
   - Regístrate gratis (puedes usar GitHub)

2. **Crear Redis Database:**
   - Dashboard → **Create Database**
   - Nombre: el que prefieras (ej: `algoritmia-ugr`)
   - Region: Elige la más cercana (ej: EU-West-1 para Europa)
   - Type: **Regional** (plan gratuito)
   - Haz clic en **Create**

3. **Obtener credenciales:**
   - En tu database → pestaña **REST API**
   - Copia `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`

4. **Configurar en Vercel:**
   - Ve a tu proyecto en Vercel → **Settings** → **Environment Variables**
   - Añade estas dos variables:
     - `KV_REST_API_URL` = tu UPSTASH_REDIS_REST_URL
     - `KV_REST_API_TOKEN` = tu UPSTASH_REDIS_REST_TOKEN
   - Aplica a **Production**, **Preview** y **Development**

5. **Desplegar:**
   - Haz deploy con `git push` o redeploy desde Vercel Dashboard
   - ¡Listo! El contenido se guardará en Upstash Redis

## 💻 Configuración para Desarrollo Local

Para probar la base de datos en tu entorno local:

1. **Ya está configurado en `.env.local`** ✅
   - El archivo ya contiene `KV_REST_API_URL` y `KV_REST_API_TOKEN`

2. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. **Probar la aplicación:**
   - Ve a `http://localhost:3000`
   - Navega por las diferentes secciones
   - Verifica que el contenido se carga desde Redis correctamente

## 📦 Plan Gratuito de Upstash

El plan gratuito incluye:
- ✅ **10,000 comandos/día** (reinicios diarios)
- ✅ **256 MB** de almacenamiento
- ✅ Sin tarjeta de crédito requerida
- ✅ Perfecto para proyectos educativos y portfolios
- ✅ Latencia baja global

## 🔑 Estructura de Datos

El contenido se almacena con el prefijo `content:` seguido del ID:

```
content:1738572054955 → { id, section, title, content, createdAt, updatedAt }
content:1738572098234 → { id, section, title, content, createdAt, updatedAt }
```

## 📝 APIs Implementadas (Solo Lectura)

- `GET /api/content` - Listar todo el contenido
- `GET /api/sections` - Obtener secciones disponibles
- `GET /api/sections/descriptions` - Obtener descripciones de secciones
- `GET /api/meetings` - Listar reuniones

## ⚠️ Nota Importante

El archivo `.env.local` **NO** debe incluirse en git (ya está en `.gitignore`). Solo comparte el archivo `.env.local.example` como plantilla.
