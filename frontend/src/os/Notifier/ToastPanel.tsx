import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Toast } from '../../hooks/useToasts'

interface ToastPanelProps {
  toast: Toast
  onRemove: (id: string) => void
  index?: number
}

export default function ToastPanel({ toast, onRemove }: ToastPanelProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(toast.duration || 5000)
  const startTimeRef = useRef<number>(Date.now())
  const pausedTimeRef = useRef<number>(0)

  useEffect(() => {
    if (toast.persistent || isHovered) return

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current - pausedTimeRef.current
      const remaining = (toast.duration || 5000) - elapsed
      
      if (remaining <= 0) {
        onRemove(toast.id)
      } else {
        setTimeRemaining(remaining)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [toast.id, toast.duration, toast.persistent, isHovered, onRemove])

  useEffect(() => {
    if (isHovered) {
      pausedTimeRef.current += Date.now() - startTimeRef.current
    } else {
      startTimeRef.current = Date.now()
    }
  }, [isHovered])

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return '✓'
      case 'error': return '✕'
      case 'warning': return '⚠'
      case 'info': return 'ℹ'
    }
  }

  const getColors = () => {
    switch (toast.type) {
      case 'success': 
        return { 
          border: '#10B981', 
          glow: 'rgba(16, 185, 129, 0.3)',
          icon: '#10B981',
          bg: 'rgba(16, 185, 129, 0.05)'
        }
      case 'error': 
        return { 
          border: '#DC2626', 
          glow: 'rgba(220, 38, 38, 0.3)',
          icon: '#DC2626',
          bg: 'rgba(220, 38, 38, 0.05)'
        }
      case 'warning': 
        return { 
          border: '#D1A954', 
          glow: 'rgba(209, 169, 84, 0.3)',
          icon: '#D1A954',
          bg: 'rgba(209, 169, 84, 0.05)'
        }
      case 'info': 
      default:
        return { 
          border: '#3B82F6', 
          glow: 'rgba(59, 130, 246, 0.3)',
          icon: '#3B82F6',
          bg: 'rgba(59, 130, 246, 0.05)'
        }
    }
  }

  const colors = getColors()
  const progressPercentage = toast.persistent ? 100 : (timeRemaining / (toast.duration || 5000)) * 100

  return (
    <motion.div
      className="relative flex flex-col bg-[rgba(17,22,28,0.95)] backdrop-blur-[16px] border rounded-xl overflow-hidden pointer-events-auto shadow-[0_10px_30px_rgba(0,0,0,0.4)] min-w-[320px] max-w-[400px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: `linear-gradient(135deg, ${colors.bg}, rgba(17, 22, 28, 0.95))`,
        borderColor: colors.border
      }}
      animate={{
        boxShadow: [
          `0 0 10px ${colors.glow}`,
          `0 0 20px ${colors.glow}`,
          `0 0 10px ${colors.glow}`
        ]
      }}
      transition={{
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }}
      role="alert"
      aria-live="assertive"
    >
      {/* Hologram Border Effect */}
      <motion.div
        className="absolute top-[-1px] left-[-1px] right-[-1px] h-[2px] opacity-60 z-[1]"
        style={{
          background: `linear-gradient(90deg, transparent, ${colors.border}, transparent)`,
          backgroundSize: '200% 100%'
        }}
        animate={{
          backgroundPosition: ['0% 0%', '200% 0%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Content */}
      <div className="relative flex items-start gap-4 p-4 px-5 z-[2]">
        {/* Icon */}
        <motion.div
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-lg font-semibold leading-none mt-0.5"
          style={{ color: colors.icon }}
          animate={{
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {getIcon()}
        </motion.div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <div className="text-sm leading-6 text-[rgba(255,255,255,0.95)] mb-2">
            {toast.message}
          </div>
          {toast.action && (
            <button
              className="text-xs font-semibold uppercase tracking-wider cursor-pointer transition-opacity hover:opacity-80"
              onClick={toast.action.onClick}
              style={{ color: colors.border }}
            >
              {toast.action.label}
            </button>
          )}
        </div>

        {/* Close Button */}
        <motion.button
          className="flex-shrink-0 w-6 h-6 rounded-md border border-[rgba(255,255,255,0.1)] bg-transparent text-[rgba(255,255,255,0.5)] cursor-pointer transition-all flex items-center justify-center text-xs mt-0.5 hover:bg-[rgba(255,255,255,0.1)] hover:text-[rgba(255,255,255,0.8)] hover:border-[rgba(255,255,255,0.3)]"
          onClick={() => onRemove(toast.id)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Close notification"
        >
          ✕
        </motion.button>
      </div>

      {/* Progress Bar */}
      {!toast.persistent && (
        <div className="relative h-[3px] bg-[rgba(255,255,255,0.1)] overflow-hidden">
          <motion.div
            className="h-full w-full origin-left shadow-[0_0_10px_currentColor]"
            style={{
              background: `linear-gradient(90deg, ${colors.border}, ${colors.glow})`
            }}
            animate={{
              width: `${progressPercentage}%`
            }}
            transition={{
              duration: 0.1,
              ease: 'linear'
            }}
          />
        </div>
      )}
    </motion.div>
  )
}
