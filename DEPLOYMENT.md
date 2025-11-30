# 🚀 Guía de Deployment en Vercel

## Variables de entorno requeridas

Antes de hacer deploy, configura estas variables de entorno en el dashboard de Vercel:

### Redis Database (Upstash)

```bash
KV_REST_API_URL=https://tu-proyecto.upstash.io
KV_REST_API_TOKEN=tu_token_de_upstash
```

**O alternativamente:**

```bash
UPSTASH_REDIS_REST_URL=https://tu-proyecto.upstash.io
UPSTASH_REDIS_REST_TOKEN=tu_token_de_upstash
```

## Pasos para deployment

1. **Conectar repositorio a Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio de GitHub
   - Selecciona el framework: Next.js

2. **Configurar variables de entorno**
   - En Settings → Environment Variables
   - Añade todas las variables listadas arriba
   - Aplica a: Production, Preview, Development

3. **Configurar Upstash Redis**
   - Opción A: Usar Vercel KV (integración automática)
   - Opción B: Crear cuenta en [Upstash](https://upstash.com) y copiar credenciales

4. **Deploy**
   - Vercel detectará automáticamente Next.js
   - El build se ejecutará automáticamente
   - Tu sitio estará en: `tu-proyecto.vercel.app`

## Post-deployment

### Verificaciones
- ✅ Las páginas públicas cargan correctamente
- ✅ El contenido se muestra desde Redis/KV
- ✅ Las imágenes y recursos estáticos cargan correctamente

## Límites de Vercel (Plan Hobby/Free)

- **Tamaño de función**: 50MB
- **Timeout de función**: 10s
- **Body size**: 4.5MB (PDFs grandes podrían fallar)
- **Bandwidth**: 100GB/mes

💡 **Tip**: Si subes PDFs muy grandes (>4MB), considera usar Vercel Blob Storage o reducir el tamaño.

## Troubleshooting

### Error: Cannot connect to Redis
```
Error obteniendo contenido
```
**Solución**: Verifica que las credenciales de Upstash/KV estén correctamente configuradas

## Seguridad

✅ **Configuración actual:**
- Aplicación de solo lectura para usuarios
- Credenciales en variables de entorno (no en código)
- `.env.local` en `.gitignore`
- No hay tokens hardcodeados

⚠️ **Mejoras recomendadas para producción:**
- Implementar rate limiting en APIs públicas
- Añadir logging y monitoring (Sentry, LogRocket)
- Configurar CORS apropiadamente

## Dominio custom (opcional)

1. En Vercel: Settings → Domains
2. Añade tu dominio: `algoritmia.ugr.es`
3. Configura DNS según instrucciones de Vercel
4. Certificado SSL se genera automáticamente

---

**¿Preguntas?** Revisa la [documentación de Vercel](https://vercel.com/docs)
