import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { Toast } from '../../hooks/useToasts'
import ToastPanel from './ToastPanel'

interface ToastManagerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
  maxVisible?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export default function ToastManager({
  toasts,
  onRemove,
  maxVisible = 3,
  position = 'top-right'
}: ToastManagerProps) {
  // Show only the most recent toasts up to maxVisible
  const visibleToasts = toasts.slice(-maxVisible)

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-6 right-6'
      case 'top-left':
        return 'top-6 left-6'
      case 'bottom-right':
        return 'bottom-6 right-6'
      case 'bottom-left':
        return 'bottom-6 left-6'
      default:
        return 'top-6 right-6'
    }
  }

  const container = (
    <div 
      className={`toast-manager fixed z-[9999] flex flex-col gap-3 max-w-[400px] w-full pointer-events-none ${getPositionClasses()}`}
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {visibleToasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ 
              opacity: 0, 
              scale: 0.8, 
              y: position.includes('top') ? -20 : 20 
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0 
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8, 
              x: position.includes('right') ? 100 : -100,
              transition: { duration: 0.2 }
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
            style={{
              zIndex: 9999 - index
            }}
          >
            <ToastPanel
              toast={toast}
              onRemove={onRemove}
              index={index}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )

  return createPortal(container, document.body)
}
