import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../contexts/ToastContext'

export default function CreateOrganization() {
  const navigate = useNavigate()
  const { success, error } = useToast()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: ''
  })
  const [creating, setCreating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      error('Organization name is required')
      return
    }

    setCreating(true)
    try {
      // TODO: API call to create organization
      // const org = await createOrganization(formData)
      
      // Mock success
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      success('Organization created successfully!')
      navigate('/org/dashboard')
    } catch (err) {
      error('Failed to create organization')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E1A] via-[#11161C] to-[#0A0E1A] flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Create Organization
          </motion.h1>
          <motion.p
            className="text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Set up your enterprise vault organization
          </motion.p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-[rgba(17,22,28,0.95)] backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Organization Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Organization Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Acme Corporation"
              className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of your organization..."
              rows={4}
              className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition resize-none"
            />
          </div>

          {/* Logo URL */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Logo URL (optional)
            </label>
            <input
              type="url"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              placeholder="https://example.com/logo.png"
              className="w-full px-4 py-3 bg-[rgba(255,255,255,0.05)] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <motion.button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 bg-[rgba(255,255,255,0.05)] border border-gray-700 rounded-lg text-gray-300 font-semibold hover:bg-[rgba(255,255,255,0.1)] transition"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            
            <motion.button
              type="submit"
              disabled={creating}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: creating ? 1 : 1.02 }}
              whileTap={{ scale: creating ? 1 : 0.98 }}
            >
              {creating ? 'Creating...' : 'Create Organization'}
            </motion.button>
          </div>
        </motion.form>

        {/* Info */}
        <motion.div
          className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-semibold text-blue-400 mb-2">What's next?</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• You'll be assigned as the organization ADMIN</li>
            <li>• Invite team members with different roles</li>
            <li>• Create vaults for your organization</li>
            <li>• Monitor team analytics and signing activity</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  )
}
