import Head from 'next/head'
import Layout from '../../src/components/Layout'
import Link from 'next/link'
import { prefixPath } from '../../src/utils/basePath'
import { useEffect, useState } from 'react'
import AdventCalendar from '../../src/components/AdventCalendar'

export default function AoC2025() {
  const [topMembers, setTopMembers] = useState([])
  const [loadingTop, setLoadingTop] = useState(true)

  useEffect(() => {
    // Fetch top 5 members for preview
    async function fetchTop() {
      try {
        const res = await fetch('/api/leaderboard')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        const members = Object.values(data.members || {})
          .map(m => ({
            name: m.name || `Anónimo ${m.id}`,
            stars: Number(m.stars) || 0,
            local_score: Number(m.local_score) || 0
          }))
          .sort((a, b) => {
            if (b.local_score !== a.local_score) return b.local_score - a.local_score
            return b.stars - a.stars
          })
          .slice(0, 5)
        setTopMembers(members)
      } catch (error) {
        console.error('Error loading leaderboard preview:', error)
      } finally {
        setLoadingTop(false)
      }
    }
    fetchTop()
  }, [])

  const getMedalEmoji = (position) => {
    switch(position) {
      case 0: return '🥇'
      case 1: return '🥈'
      case 2: return '🥉'
      default: return `${position + 1}.`
    }
  }

  return (
    <>
      <Head>
        <title>Advent of Code ETSIIT 2025 — CPC UGR</title>
        <meta name="description" content="Reto Advent of Code ETSIIT 2025: normas, desafíos diarios y clasificación." />
        <link rel="icon" href={prefixPath('/favicon.ico')} />
      </Head>

      <section className="min-h-screen py-12 px-4">
        <Layout>
          <div className="max-w-6xl mx-auto w-full">
            {/* Header */}
            <header className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-black dark:text-white mb-4">
                🏆 Advent of Code ETSIIT 2025 🏆
              </h1>
              <p className="text-lg text-black/70 dark:text-white/70 max-w-2xl mx-auto">
                Competición interna de programación basada en los desafíos diarios de Advent of Code
              </p>
            </header>

            {/* Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
              <Link href="/" legacyBehavior>
                <a className="group flex items-center gap-3 px-6 py-4 rounded-xl bg-white/80 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-warm-orange dark:hover:border-warm-pink transition-all duration-200 hover:shadow-lg">
                  <span className="text-2xl">⬅️</span>
                  <div className="flex-1">
                    <div className="font-medium text-black dark:text-white">Volver</div>
                    <div className="text-sm text-black/60 dark:text-white/60">Página principal</div>
                  </div>
                </a>
              </Link>
              <Link href="/leaderboard" legacyBehavior>
                <a className="group flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-warm-orange to-warm-red text-white hover:from-warm-red hover:to-warm-pink transition-all duration-200 hover:shadow-lg">
                  <span className="text-2xl">📊</span>
                  <div className="flex-1">
                    <div className="font-medium">Clasificación Completa</div>
                    <div className="text-sm text-white/80">Ver todos los participantes</div>
                  </div>
                  <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content - Left Column (2/3) */}
              <div className="lg:col-span-2 space-y-6">

                {/* Normas Section */}
                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-black/5 dark:border-white/10">
                  <h2 className="text-2xl font-light text-black dark:text-white mb-4">📋 Mecánica y Normas</h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-warm-orange/10 dark:bg-warm-orange/5 rounded-lg border border-warm-orange/20">
                      <div className="font-medium text-black dark:text-white mb-1">Código de clasificación privada</div>
                      <code className="text-warm-orange dark:text-warm-pink font-mono text-sm">5184163-4f9d2564</code>
                    </div>

                    <p className="text-black/80 dark:text-white/80 leading-relaxed">
                      La competición sigue el formato oficial de Advent of Code: cada día tiene dos partes. 
                      La puntuación se basa en el tiempo de envío y el número de estrellas obtenidas.
                    </p>

                    <div className="grid gap-3">
                      <div className="flex items-start gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                        <span className="text-xl flex-shrink-0">✅</span>
                        <div className="text-sm text-black/70 dark:text-white/70">
                          Resolver una parte otorga <strong>1 estrella</strong>. El tiempo de envío se usa para desempates.
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                        <span className="text-xl flex-shrink-0">🚫</span>
                        <div className="text-sm text-black/70 dark:text-white/70">
                          No compartir código con otros participantes durante la competición.
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                        <span className="text-xl flex-shrink-0">🤖</span>
                        <div className="text-sm text-black/70 dark:text-white/70">
                          No se permite el uso de <b>Inteligencia Artificial</b>, el ofjetivo de este reto es mejorar nuestras habilidades.
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                        <span className="text-xl flex-shrink-0">🏆</span>
                        <div className="text-sm text-black/70 dark:text-white/70">
                          Se dará un premio a quien tenga la mejor puntuación el día 19. Y se dará otro a la vuelta de vacaciones para quién quiera tomarselo con tranquilidad. Los trofeos estarán impresos en 3D.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calendar Section */}
                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-black/5 dark:border-white/10">
                  <AdventCalendar year={2025} />
                </div>

                {/* How to Participate */}
                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-black/5 dark:border-white/10">
                  <h2 className="text-2xl font-light text-black dark:text-white mb-4">💡 Cómo Participar</h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                      <span className="text-xl flex-shrink-0">1️⃣</span>
                      <div className="text-sm text-black/70 dark:text-white/70">
                        Únete a la clasificación privada con el código: <code className="px-2 py-1 bg-warm-orange/10 dark:bg-warm-orange/5 rounded text-warm-orange dark:text-warm-pink font-mono">5184163-4f9d2564</code>{' '}
                        <a 
                          href="https://adventofcode.com/2025/leaderboard/private" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 bg-warm-orange hover:bg-warm-red text-white text-xs font-medium rounded transition-colors"
                        >
                          aquí
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                      <span className="text-xl flex-shrink-0">2️⃣</span>
                      <div className="text-sm text-black/70 dark:text-white/70">
                        Click en cualquier día desbloqueado del calendario para acceder al desafío
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                      <span className="text-xl flex-shrink-0">3️⃣</span>
                      <div className="text-sm text-black/70 dark:text-white/70">
                        Resuelve el problema y envía tu solución en adventofcode.com
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                      <span className="text-xl flex-shrink-0">4️⃣</span>
                      <div className="text-sm text-black/70 dark:text-white/70">
                        Tu puntuación se actualizará automáticamente en nuestra clasificación
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar - Top 5 Preview */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-black/5 dark:border-white/10 sticky top-24">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-light text-black dark:text-white">🏅 Top 5</h2>
                    <Link href="/leaderboard" legacyBehavior>
                      <a className="text-xs text-warm-orange hover:text-warm-red dark:text-warm-pink dark:hover:text-warm-orange transition-colors">
                        Ver todos →
                      </a>
                    </Link>
                  </div>

                  {loadingTop ? (
                    <div className="text-center py-8">
                      <div className="animate-spin text-2xl mb-2">⟳</div>
                      <div className="text-sm text-black/60 dark:text-white/60">Cargando...</div>
                    </div>
                  ) : topMembers.length > 0 ? (
                    <div className="space-y-2">
                      {topMembers.map((member, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-lg bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        >
                          <div className="flex-shrink-0 w-6 text-center font-semibold">
                            {getMedalEmoji(idx)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-black dark:text-white truncate">
                              {member.name}
                            </div>
                            <div className="text-xs text-black/60 dark:text-white/60">
                              {member.stars} ⭐ · {member.local_score} pts
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-black/60 dark:text-white/60 text-sm">
                      No hay datos disponibles
                    </div>
                  )}

                  <Link href="/leaderboard" legacyBehavior>
                    <a className="mt-4 block text-center px-4 py-2 rounded-lg bg-warm-orange hover:bg-warm-red text-white text-sm font-medium transition-colors">
                      Ver Clasificación Completa
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      </section>
    </>
  )
}
