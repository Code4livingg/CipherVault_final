import { useState, useCallback, useRef } from 'react'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  persistent?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    
    // Clear timer if exists
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const addToast = useCallback((
    message: string,
    type: Toast['type'] = 'info',
    options: {
      duration?: number
      persistent?: boolean
      action?: Toast['action']
    } = {}
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const duration = options.duration ?? 5000
    const persistent = options.persistent ?? false
    
    const toast: Toast = {
      id,
      message,
      type,
      duration,
      persistent,
      action: options.action
    }

    setToasts(prev => [...prev, toast])

    // Auto-dismiss if not persistent
    if (!persistent && duration > 0) {
      const timer = setTimeout(() => {
        removeToast(id)
      }, duration)
      
      timersRef.current.set(id, timer)
    }

    return id
  }, [removeToast])

  const success = useCallback((message: string, options?: Parameters<typeof addToast>[2]) => {
    return addToast(message, 'success', options)
  }, [addToast])

  const error = useCallback((message: string, options?: Parameters<typeof addToast>[2]) => {
    return addToast(message, 'error', options)
  }, [addToast])

  const info = useCallback((message: string, options?: Parameters<typeof addToast>[2]) => {
    return addToast(message, 'info', options)
  }, [addToast])

  const warning = useCallback((message: string, options?: Parameters<typeof addToast>[2]) => {
    return addToast(message, 'warning', options)
  }, [addToast])

  const clearAll = useCallback(() => {
    // Clear all timers
    timersRef.current.forEach(timer => clearTimeout(timer))
    timersRef.current.clear()
    
    // Clear all toasts
    setToasts([])
  }, [])

  const pauseToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const resumeToast = useCallback((id: string, remainingTime: number) => {
    const timer = setTimeout(() => {
      removeToast(id)
    }, remainingTime)
    
    timersRef.current.set(id, timer)
  }, [removeToast])

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
    clearAll,
    pauseToast,
    resumeToast
  }
}
