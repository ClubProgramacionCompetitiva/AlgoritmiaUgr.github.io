import '../styles/globals.css'
import 'katex/dist/katex.min.css'
import { ThemeProvider } from '../src/context/ThemeContext'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { getBasePath } from '../src/utils/basePath'
import Header from '../src/components/Header'
import { Analytics } from '@vercel/analytics/next'

// Cargar efectos de fondo en cliente para evitar problemas de SSR
const BackgroundEffects = dynamic(() => import('../src/components/BackgroundEffects'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-pure-white dark:bg-pure-black" />,
})

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ff6b35" />
        <meta name="description" content="Plataforma educativa para aprender programación competitiva - Universidad de Granada" />
        
        {/* Favicon y iconos */}
        <link rel="icon" type="image/svg+xml" href={`${getBasePath()}/favicon.svg`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`${getBasePath()}/favicon-32x32.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`${getBasePath()}/favicon-16x16.png`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`${getBasePath()}/apple-touch-icon.png`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Club de Programación Competitiva - UGR" />
        <meta property="og:description" content="Plataforma educativa para aprender programación competitiva - Universidad de Granada" />
        <meta property="og:image" content={`${getBasePath()}/imagenes/logo_claro.svg`} />
        <meta property="og:url" content="https://cpcugr.vercel.app" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Club de Programación Competitiva - UGR" />
        <meta name="twitter:description" content="Plataforma educativa para aprender programación competitiva - Universidad de Granada" />
        <meta name="twitter:image" content={`${getBasePath()}/imagenes/logo_claro.svg`} />
        
        <link rel="manifest" href={`${getBasePath()}/manifest.json`} />
        
        {/* Preconnect para fuentes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Prefetch para rutas comunes (respetando basePath) */}
  <link rel="prefetch" href={`${getBasePath()}/aprende`} />
  <link rel="prefetch" href={`${getBasePath()}/aboutus`} />
      </Head>

      <ThemeProvider>
        <div className="min-h-screen w-full bg-pure-white dark:bg-pure-black text-black dark:text-white flex flex-col items-center">
          <BackgroundEffects />
          <Header />
          <main className="w-full relative z-10 pt-20">
            <Component {...pageProps} />
          </main>
        </div>
        <Analytics />
      </ThemeProvider>
    </>
  )
} 