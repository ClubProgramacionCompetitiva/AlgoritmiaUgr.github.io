import { useState, useEffect } from 'react'

/**
 * Componente de Calendario de Advent of Code
 * 
 * Muestra un grid de 25 días que se desbloquean automáticamente
 * cuando llega cada día de diciembre.
 * 
 * Props:
 * - year: Año del evento (por defecto el año actual)
 */
export default function AdventCalendar({ year }) {
  const [currentDay, setCurrentDay] = useState(0)
  const [currentMonth, setCurrentMonth] = useState(0)
  const eventYear = year || new Date().getFullYear()

  useEffect(() => {
    const updateCurrentDate = () => {
      const now = new Date()
      setCurrentDay(now.getDate())
      setCurrentMonth(now.getMonth() + 1) // getMonth() es 0-indexed
    }

    updateCurrentDate()
    // Actualizar cada minuto para detectar cambios de día
    const interval = setInterval(updateCurrentDate, 60000)

    return () => clearInterval(interval)
  }, [])

  const isDayUnlocked = (day) => {
    // Desbloquear si:
    // 1. Ya pasó diciembre del año del evento
    // 2. Es diciembre del año del evento y el día ya llegó
    const now = new Date()
    const currentYear = now.getFullYear()
    
    if (currentYear > eventYear) {
      return true // Todos desbloqueados si ya pasó el año
    }
    
    if (currentYear === eventYear && currentMonth === 12) {
      return day <= currentDay
    }
    
    return false // Bloqueado si aún no es diciembre del año
  }

  const getDayClass = (day) => {
    const unlocked = isDayUnlocked(day)
    const baseClasses = "relative flex items-center justify-center aspect-square rounded-lg border-2 font-bold text-2xl transition-all duration-200"
    
    if (unlocked) {
      return `${baseClasses} bg-gradient-to-br from-green-700 to-green-900 border-yellow-500/50 hover:border-yellow-400 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20 cursor-pointer text-yellow-300 hover:text-yellow-200`
    } else {
      return `${baseClasses} bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 cursor-not-allowed text-gray-600 opacity-60`
    }
  }

  const handleDayClick = (day) => {
    if (isDayUnlocked(day)) {
      window.open(`https://adventofcode.com/${eventYear}/day/${day}`, '_blank')
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-light text-black dark:text-white mb-2">
          🎄 Calendario Advent of Code {eventYear} 🎄
        </h2>
        <p className="text-black/70 dark:text-white/70">
          {currentMonth === 12 && currentDay <= 25
            ? `Día ${currentDay} de 25 desbloqueado`
            : currentMonth === 12 && currentDay > 25
            ? 'Todos los días desbloqueados'
            : 'Esperando diciembre...'}
        </p>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-7 gap-3 sm:gap-4">
        {Array.from({ length: 25 }, (_, i) => {
          const day = i + 1
          const unlocked = isDayUnlocked(day)
          
          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              className={getDayClass(day)}
              title={unlocked ? `Día ${day} - Click para abrir` : `Día ${day} - Bloqueado`}
            >
              {/* Day number */}
              <span className="relative z-10">{day}</span>
              
              {/* Lock icon for locked days */}
              {!unlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg 
                    className="w-8 h-8 text-gray-700 absolute opacity-30" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
              )}
              
              {/* Star decoration for unlocked days */}
              {unlocked && (
                <div className="absolute top-1 right-1">
                  <span className="text-yellow-400 text-xs">⭐</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap gap-6 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-green-700 to-green-900 border-2 border-yellow-500/50"></div>
          <span className="text-black/70 dark:text-white/70">Desbloqueado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 opacity-60"></div>
          <span className="text-black/70 dark:text-white/70">Bloqueado</span>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800/30 text-center">
        <p className="text-sm text-black/70 dark:text-white/70">
          Los desafíos se desbloquean cada día de diciembre a las 00:00 EST (06:00 CET)
        </p>
      </div>
    </div>
  )
}
