import Head from 'next/head'
import Layout from '../src/components/Layout'
import Link from 'next/link'
import { prefixPath } from '../src/utils/basePath'
import { useEffect, useState, useRef } from 'react'

export default function Leaderboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [members, setMembers] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const mountedRef = useRef(true)
  const lastFetchRef = useRef(0)

  // Refresh interval (ms) - matches API cache (15 minutes)
  const REFRESH_INTERVAL_MS = 15 * 60 * 1000

  async function load(force = false) {
    const now = Date.now()
    
    // Respect minimum interval between requests unless forced
    if (!force && lastFetchRef.current && (now - lastFetchRef.current) < REFRESH_INTERVAL_MS) {
      return
    }

    if (!force) {
      setLoading(true)
    } else {
      setIsRefreshing(true)
    }
    
    setError(null)

    try {
      const res = await fetch('/api/leaderboard', {
        signal: AbortSignal.timeout(12000)
      })
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      
      const json = await res.json()
      const vals = Object.values(json.members || {})
      
      const normalized = vals.map(m => ({
        id: m.id,
        name: m.name && m.name.length > 0 ? m.name : `Anónimo ${m.id}`,
        local_score: Number(m.local_score) || 0,
        stars: Number(m.stars) || 0,
        last_star_ts: m.last_star_ts || 0
      }))

      // Sort by score, then by stars, then by last star timestamp
      normalized.sort((a, b) => {
        if (b.local_score !== a.local_score) return b.local_score - a.local_score
        if (b.stars !== a.stars) return b.stars - a.stars
        return a.last_star_ts - b.last_star_ts
      })

      if (mountedRef.current) {
        setMembers(normalized)
        lastFetchRef.current = now
        setLastUpdated(new Date(now).toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }))
      }
    } catch (e) {
      if (mountedRef.current) {
        if (e.name === 'AbortError' || e.name === 'TimeoutError') {
          setError('Tiempo de espera agotado')
        } else {
          setError(e.message || 'Error al cargar datos')
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
        setIsRefreshing(false)
      }
    }
  }

  useEffect(() => {
    load(true)
    const id = setInterval(() => load(false), REFRESH_INTERVAL_MS)
    return () => { 
      mountedRef.current = false
      clearInterval(id)
    }
  }, [])

  const getMedalEmoji = (position) => {
    switch(position) {
      case 0: return '🥇'
      case 1: return '🥈'
      case 2: return '🥉'
      default: return null
    }
  }

  const getMedalColor = (position) => {
    switch(position) {
      case 0: return 'text-yellow-500 dark:text-yellow-400'
      case 1: return 'text-gray-400 dark:text-gray-300'
      case 2: return 'text-orange-600 dark:text-orange-400'
      default: return 'text-black/60 dark:text-white/60'
    }
  }

  const getRowBg = (position) => {
    switch(position) {
      case 0: return 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800/30'
      case 1: return 'bg-gray-50 dark:bg-gray-800/10 border-gray-200 dark:border-gray-700/30'
      case 2: return 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800/30'
      default: return 'border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5'
    }
  }

  return (
    <>
      <Head>
        <title>Clasificación — Advent of Code ETSIIT 2025</title>
        <meta name="description" content="Clasificación en tiempo real del Advent of Code ETSIIT 2025" />
        <link rel="icon" href={prefixPath('/favicon.ico')} />
      </Head>

      <section className="min-h-screen py-12 px-4">
        <Layout>
          <div className="max-w-5xl mx-auto w-full">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
                <h1 className="text-3xl sm:text-4xl font-light text-black dark:text-white">
                  📊 Clasificación
                </h1>
                <Link href="/compite/aoc-2025" legacyBehavior>
                  <a className="text-sm text-warm-orange hover:text-warm-red dark:text-warm-pink dark:hover:text-warm-orange transition-colors inline-flex items-center gap-1">
                    ← Volver al reto
                  </a>
                </Link>
              </div>
              <p className="text-base text-black/70 dark:text-white/70 font-light">
                Advent of Code ETSIIT 2025 · Actualización automática cada 15 minutos
              </p>
            </div>

            {/* Stats Card */}
            {!loading && !error && members.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-black/5 dark:border-white/10">
                  <div className="text-sm text-black/60 dark:text-white/60 mb-1">Participantes</div>
                  <div className="text-2xl font-semibold text-black dark:text-white">{members.length}</div>
                </div>
                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-black/5 dark:border-white/10">
                  <div className="text-sm text-black/60 dark:text-white/60 mb-1">Estrellas Totales</div>
                  <div className="text-2xl font-semibold text-black dark:text-white">
                    {members.reduce((sum, m) => sum + m.stars, 0)} ⭐
                  </div>
                </div>
                <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-black/5 dark:border-white/10">
                  <div className="text-sm text-black/60 dark:text-white/60 mb-1">Puntuación Máxima</div>
                  <div className="text-2xl font-semibold text-black dark:text-white">
                    {members[0]?.local_score || 0}
                  </div>
                </div>
              </div>
            )}

            {/* Main Card */}
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-black/5 dark:border-white/10 shadow-lg overflow-hidden">
              {/* Toolbar */}
              <div className="p-4 border-b border-black/5 dark:border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-sm text-black/60 dark:text-white/60">
                  {lastUpdated ? `Actualizado: ${lastUpdated}` : 'Cargando...'}
                </div>
                <button 
                  onClick={() => load(true)}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-warm-orange hover:bg-warm-red text-white text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className={isRefreshing ? 'animate-spin' : ''}>
                    {isRefreshing ? '⟳' : '↻'}
                  </span>
                  {isRefreshing ? 'Actualizando...' : 'Refrescar'}
                </button>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                {loading && (
                  <div className="text-center py-12">
                    <div className="animate-spin text-4xl mb-4">⟳</div>
                    <div className="text-black/70 dark:text-white/70">Cargando clasificación...</div>
                  </div>
                )}

                {error && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">⚠️</div>
                    <div className="text-red-600 dark:text-red-400 mb-2">Error al cargar datos</div>
                    <div className="text-sm text-black/60 dark:text-white/60">{error}</div>
                  </div>
                )}

                {!loading && !error && members.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">👥</div>
                    <div className="text-black/70 dark:text-white/70">No hay participantes aún</div>
                  </div>
                )}

                {!loading && !error && members.length > 0 && (
                  <div className="space-y-2">
                    {members.map((member, idx) => {
                      const medal = getMedalEmoji(idx)
                      const medalColor = getMedalColor(idx)
                      const rowBg = getRowBg(idx)
                      
                      return (
                        <div 
                          key={member.id}
                          className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border ${rowBg} transition-all duration-200`}
                        >
                          {/* Position */}
                          <div className={`flex-shrink-0 w-8 sm:w-10 text-center font-semibold ${medalColor}`}>
                            {medal || `${idx + 1}`}
                          </div>

                          {/* Name */}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-black dark:text-white truncate">
                              {member.name}
                            </div>
                          </div>

                          {/* Stars */}
                          <div className="flex items-center gap-1 text-sm sm:text-base">
                            <span className="font-semibold text-black dark:text-white">{member.stars}</span>
                            <span className="text-yellow-500">⭐</span>
                          </div>

                          {/* Score */}
                          <div className="flex-shrink-0 text-right min-w-[60px] sm:min-w-[80px]">
                            <div className="text-base sm:text-lg font-bold text-black dark:text-white">
                              {member.local_score}
                            </div>
                            <div className="text-xs text-black/50 dark:text-white/50">puntos</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-6 text-center text-sm text-black/50 dark:text-white/50">
              Datos sincronizados con{' '}
              <a 
                href="https://adventofcode.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-warm-orange hover:text-warm-red dark:text-warm-pink dark:hover:text-warm-orange transition-colors"
              >
                adventofcode.com
              </a>
            </div>
          </div>
        </Layout>
      </section>
    </>
  )
}
