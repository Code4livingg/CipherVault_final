import { motion } from 'framer-motion'
import { useToast } from '../contexts/ToastContext'

export default function ToastDemo() {
  const { success, error, info, warning, addToast } = useToast()

  const handleSuccess = () => {
    success('Vault funded successfully!')
  }

  const handleError = () => {
    error('Failed to connect to wallet')
  }

  const handleInfo = () => {
    info('Unlock proposal created')
  }

  const handleWarning = () => {
    warning('Vault expires in 24 hours')
  }

  const handlePersistent = () => {
    addToast(
      'This notification will stay until dismissed',
      'info',
      { persistent: true }
    )
  }

  const handleWithAction = () => {
    addToast(
      'Vault unlock requires your approval',
      'warning',
      {
        duration: 10000,
        action: {
          label: 'Approve',
          onClick: () => {
            success('Approval confirmed!')
          }
        }
      }
    )
  }

  const handleCustomDuration = () => {
    addToast(
      'This will disappear in 10 seconds',
      'success',
      { duration: 10000 }
    )
  }

  const handleMultiple = () => {
    success('First notification')
    setTimeout(() => info('Second notification'), 500)
    setTimeout(() => warning('Third notification'), 1000)
    setTimeout(() => error('Fourth notification'), 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E1A] via-[#11161C] to-[#0A0E1A] flex items-center justify-center p-6">
      <motion.div 
        className="max-w-2xl w-full bg-[rgba(17,22,28,0.95)] backdrop-blur-xl border border-blue-500/20 rounded-2xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8">
          <motion.h1
            className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Toast Notification Demo
          </motion.h1>
          
          <motion.p
            className="text-gray-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Test the hologram toast notification system
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Variants */}
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 rounded-lg text-emerald-400 font-medium hover:from-emerald-500/30 hover:to-emerald-600/30 transition-all"
              onClick={handleSuccess}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Success Toast
            </motion.button>

            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-lg text-red-400 font-medium hover:from-red-500/30 hover:to-red-600/30 transition-all"
              onClick={handleError}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Error Toast
            </motion.button>

            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 font-medium hover:from-blue-500/30 hover:to-blue-600/30 transition-all"
              onClick={handleInfo}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Info Toast
            </motion.button>

            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg text-yellow-400 font-medium hover:from-yellow-500/30 hover:to-yellow-600/30 transition-all"
              onClick={handleWarning}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Warning Toast
            </motion.button>

            {/* Advanced Features */}
            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg text-purple-400 font-medium hover:from-purple-500/30 hover:to-purple-600/30 transition-all"
              onClick={handlePersistent}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Persistent Toast
            </motion.button>

            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 border border-indigo-500/30 rounded-lg text-indigo-400 font-medium hover:from-indigo-500/30 hover:to-indigo-600/30 transition-all"
              onClick={handleWithAction}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Toast with Action
            </motion.button>

            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-pink-500/20 to-pink-600/20 border border-pink-500/30 rounded-lg text-pink-400 font-medium hover:from-pink-500/30 hover:to-pink-600/30 transition-all"
              onClick={handleCustomDuration}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Custom Duration (10s)
            </motion.button>

            <motion.button
              className="px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 rounded-lg text-cyan-400 font-medium hover:from-cyan-500/30 hover:to-cyan-600/30 transition-all"
              onClick={handleMultiple}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Multiple Toasts
            </motion.button>
          </div>

          <motion.div
            className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-sm font-semibold text-blue-400 mb-2">Features:</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Hover to pause auto-dismiss</li>
              <li>• Max 3 visible toasts (queue management)</li>
              <li>• Soft pulse glow animations</li>
              <li>• Executive matte styling</li>
              <li>• Progress bar countdown</li>
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
