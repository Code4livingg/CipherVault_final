import { createContext, useContext, ReactNode } from 'react'
import { useToasts } from '../hooks/useToasts'

interface ToastContextType {
  success: (message: string, options?: any) => string
  error: (message: string, options?: any) => string
  info: (message: string, options?: any) => string
  warning: (message: string, options?: any) => string
  addToast: (message: string, type: any, options?: any) => string
  removeToast: (id: string) => void
  clearAll: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const toastMethods = useToasts()

  return (
    <ToastContext.Provider value={toastMethods}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
