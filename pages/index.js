import Head from 'next/head'
import Link from 'next/link'
import HeroSection from '../src/components/HeroSection'
import Layout from '../src/components/Layout'
import SobreNosotros from '../src/components/SobreNosotros'
import { prefixPath } from '../src/utils/basePath'

export default function Home() {
  return (
    <>
      <Head>
        <title>Club de Programación Competitiva UGR | Algoritmos y Estructuras de Datos</title>
        <meta name="description" content="Comunidad universitaria dedicada a la programación competitiva en Granada. Aprende algoritmos, estructuras de datos y resuelve problemas de forma colaborativa." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="programación competitiva, algoritmos, estructuras de datos, Universidad de Granada, UGR, competitive programming, coding, ACM ICPC, Codeforces, LeetCode" />
        <link rel="icon" href={prefixPath('/favicon.ico')} />
        
        {/* Open Graph */}
        <meta property="og:title" content="Club de Programación Competitiva UGR" />
        <meta property="og:description" content="Comunidad universitaria dedicada a la programación competitiva en Granada" />
        <meta property="og:type" content="website" />
        
        {/* Schema.org markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Club de Programación Competitiva UGR",
            "url": "https://cpcugr.vercel.app",
            "logo": "https://cpcugr.vercel.app/favicon.svg",
            "description": "Comunidad universitaria dedicada a la programación competitiva en la Universidad de Granada",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Granada",
              "addressCountry": "ES"
            },
            "memberOf": {
              "@type": "EducationalOrganization",
              "name": "Universidad de Granada"
            }
          })}
        </script>
      </Head>
      {/* Top fold: hero + cards with better spacing */}
      <section className="relative z-10 min-h-[75vh] flex flex-col justify-center pb-8">
        {/* Hero (centered) */}
        <div className="flex-1 flex items-center justify-center">
          <HeroSection />
        </div>

        {/* Bloque promocional: Advent of Code ETSIIT 2025 (debajo del CTA) */}
        <div className="w-full mt-6">
          <Layout>
            <div className="max-w-4xl mx-auto">
              <Link href="/compite/aoc-2025" legacyBehavior passHref>
                <a aria-label="Reto Advent of Code ETSIIT 2025 — ver detalles e inscribirse" className="group block rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 bg-gradient-to-r from-yellow-50 via-white to-blue-50 dark:from-yellow-900/5 dark:via-transparent dark:to-blue-900/5 shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-orange/40">
                  <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-lg bg-yellow-100 dark:bg-yellow-800 text-2xl">🏆</div>

                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white">🏆 Reto Advent of Code ETSIIT 2025 🏆</h3>
                      <p className="mt-1 text-sm text-black/70 dark:text-white/70">¡Demuestra tus habilidades y compite por la gloria! Consulta las normas, los desafíos diarios y la clasificación en tiempo real.</p>
                    </div>

                    <div className="mt-3 sm:mt-0 sm:ml-4 flex items-center text-sm text-black/60 dark:text-white/60">
                      <span className="hidden sm:inline">Participa ahora</span>
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </Layout>
        </div>

        {/* Middle cards section - Closer to hero */}
        <div id="cards-section" className="mt-2">
          <Layout>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Aprende card */}
              <Link href="/aprende" legacyBehavior passHref>
                <a className="group rounded-2xl p-6 bg-white/70 dark:bg-white/5 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-white/5 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-base font-medium text-black dark:text-white">Aprende</div>
                    <span className="text-xs text-black/60 dark:text-white/60">↗</span>
                  </div>
                  <p className="text-sm text-black/70 dark:text-white/70">Domina las bases desde nuestra documentación.</p>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-black/50 dark:text-white/50">
                    <div className="rounded-lg px-3 py-2 bg-black/5 dark:bg-white/5">Intro</div>
                    <div className="rounded-lg px-3 py-2 bg-black/5 dark:bg-white/5">Estructuras</div>
                    <div className="rounded-lg px-3 py-2 bg-black/5 dark:bg-white/5">Algoritmos</div>
                  </div>
                </a>
              </Link>

              {/* Retos card */}
              <Link href="/compite" legacyBehavior passHref>
                <a className="group rounded-2xl p-6 bg-white/70 dark:bg-white/5 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-white/5 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-base font-medium text-black dark:text-white">Retos</div>
                    <span className="text-xs text-black/60 dark:text-white/60">↗</span>
                  </div>
                  <p className="text-sm text-black/70 dark:text-white/70">Ponte a prueba en retos sugeridos por nosotros.</p>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-black/50 dark:text-white/50">
                    <div className="rounded-lg px-3 py-2 bg-black/5 dark:bg-white/5">Greedy</div>
                    <div className="rounded-lg px-3 py-2 bg-black/5 dark:bg-white/5">DP</div>
                    <div className="rounded-lg px-3 py-2 bg-black/5 dark:bg-white/5">Grafos</div>
                  </div>
                </a>
              </Link>
            </div>
          </Layout>
        </div>
      </section>

      {/* Spacer section to push Sobre nosotros further down */}
      <div className="h-64"></div>

  {/* Sobre nosotros section - Centered in viewport */}
  <section id="sobre-nosotros" className="relative z-10 min-h-screen flex items-center scroll-mt-16">
        <Layout>
          <SobreNosotros />
        </Layout>
      </section>
    </>
  )
} 