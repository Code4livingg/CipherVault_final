import { motion, AnimatePresence } from 'framer-motion'
import { Toast } from '../../hooks/useToast'

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success': return '✓'
      case 'error': return '✕'
      case 'warning': return '⚠'
      case 'info': return 'ℹ'
    }
  }

  const getColors = (type: Toast['type']) => {
    switch (type) {
      case 'success': return { bg: 'rgba(16, 185, 129, 0.1)', border: '#10B981', glow: 'rgba(16, 185, 129, 0.3)' }
      case 'error': return { bg: 'rgba(220, 38, 38, 0.1)', border: '#DC2626', glow: 'rgba(220, 38, 38, 0.3)' }
      case 'warning': return { bg: 'rgba(245, 158, 11, 0.1)', border: '#F59E0B', glow: 'rgba(245, 158, 11, 0.3)' }
      case 'info': return { bg: 'rgba(59, 130, 246, 0.1)', border: '#3B82F6', glow: 'rgba(59, 130, 246, 0.3)' }
    }
  }

  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map((toast) => {
          const colors = getColors(toast.type)
          return (
            <motion.div
              key={toast.id}
              className="toast-item"
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25 }}
              style={{
                background: colors.bg,
                borderColor: colors.border
              }}
            >
              <motion.div
                className="toast-glow"
                animate={{
                  boxShadow: [
                    `0 0 10px ${colors.glow}`,
                    `0 0 20px ${colors.glow}`,
                    `0 0 10px ${colors.glow}`
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <div className="toast-icon" style={{ color: colors.border }}>
                {getIcon(toast.type)}
              </div>
              
              <div className="toast-message">{toast.message}</div>
              
              <button
                className="toast-close"
                onClick={() => onRemove(toast.id)}
                aria-label="Close notification"
              >
                ✕
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
