# 🚀 Club de Programación Competitiva - UGR

![](https://i.pinimg.com/originals/2c/92/4f/2c924f5738ab7e80986cc8ff0290714a.gif)

Plataforma web del Club de Programación Competitiva de la Universidad de Granada. Una aplicación educativa para aprender algoritmos, estructuras de datos y programación competitiva.

## ✨ Características

- 📚 **Sección Aprende**: Contenido educativo organizado por categorías
- 🏆 **Competiciones**: Información sobre retos y competiciones activas (Advent of Code, etc.)
- 🤝 **Comparte**: Reuniones y eventos del club
- 🌓 **Modo oscuro/claro**: Tema adaptable a preferencias del usuario
- 📱 **Responsive**: Diseño adaptado a móviles, tablets y escritorio

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15.4
- **UI**: React 19.1, Tailwind CSS
- **Base de datos**: Upstash Redis (Vercel KV)
- **Markdown**: React Markdown con soporte para KaTeX (fórmulas matemáticas)
- **Deployment**: Vercel

## 🚀 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📦 Deployment

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones detalladas de despliegue en Vercel.

## 📝 Estructura del Proyecto

```
pages/          # Páginas de Next.js
├── api/        # API Routes (solo lectura)
├── compite/    # Página de competiciones
├── reuniones/  # Páginas de reuniones
src/
├── components/ # Componentes React
├── context/    # Context providers (Theme)
├── utils/      # Utilidades
styles/         # Estilos globales
public/         # Recursos estáticos
```

## 🤝 Contribuir

Este es un proyecto educativo del Club de Programación Competitiva de la UGR. Para contribuir, contacta con los administradores del club.

## 📄 Licencia

Proyecto del Club de Programación Competitiva - Universidad de Granada
