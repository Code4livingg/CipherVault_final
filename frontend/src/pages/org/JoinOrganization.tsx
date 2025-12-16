import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../contexts/ToastContext'
import { OrgInvite } from '../../types/organization'
import { getRoleColor, getRoleLabel } from '../../security/roles'

export default function JoinOrganization() {
  const navigate = useNavigate()
  const { success, error } = useToast()
  
  const [invites, setInvites] = useState<OrgInvite[]>([])
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState<string | null>(null)

  useEffect(() => {
    fetchInvites()
  }, [])

  const fetchInvites = async () => {
    try {
      // TODO: API call to fetch pending invites
      // const data = await getMyInvites()
      
      // Mock data
      const mockInvites: OrgInvite[] = [
        {
          id: '1',
          orgId: 'org-1',
          orgName: 'Acme Corporation',
          invitedBy: 'user-1',
          invitedByName: 'John Doe',
          email: 'user@example.com',
          role: 'SIGNER',
          status: 'pending',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
      
      setInvites(mockInvites)
    } catch (err) {
      error('Failed to load invites')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (inviteId: string) => {
    setAccepting(inviteId)
    try {
      // TODO: API call to accept invite
      // await acceptInvite(inviteId)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      success('Invite accepted! Welcome to the organization')
      navigate('/org/dashboard')
    } catch (err) {
      error('Failed to accept invite')
    } finally {
      setAccepting(null)
    }
  }

  const handleReject = async (inviteId: string) => {
    try {
      // TODO: API call to reject invite
      // await rejectInvite(inviteId)
      
      setInvites(invites.filter(inv => inv.id !== inviteId))
      success('Invite rejected')
    } catch (err) {
      error('Failed to reject invite')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0E1A] via-[#11161C] to-[#0A0E1A] flex items-center justify-center">
        <div className="text-white">Loading invites...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E1A] via-[#11161C] to-[#0A0E1A] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Organization Invites
          </h1>
          <p className="text-gray-400">
            {invites.length} pending invite{invites.length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Invites */}
        {invites.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">📬</div>
            <h3 className="text-xl font-semibold text-white mb-2">No pending invites</h3>
            <p className="text-gray-400 mb-6">You don't have any organization invites at the moment</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Go to Dashboard
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {invites.map((invite, index) => (
              <motion.div
                key={invite.id}
                className="bg-[rgba(17,22,28,0.95)] backdrop-blur-xl border border-blue-500/20 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{invite.orgName}</h3>
                    <p className="text-sm text-gray-400">
                      Invited by {invite.invitedByName}
                    </p>
                  </div>
                  <div
                    className="px-3 py-1 rounded-lg text-sm font-semibold"
                    style={{
                      backgroundColor: `${getRoleColor(invite.role)}20`,
                      color: getRoleColor(invite.role),
                      border: `1px solid ${getRoleColor(invite.role)}40`
                    }}
                  >
                    {getRoleLabel(invite.role)}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                  <span>📅 Expires {new Date(invite.expiresAt).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={() => handleAccept(invite.id)}
                    disabled={accepting === invite.id}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50"
                    whileHover={{ scale: accepting === invite.id ? 1 : 1.02 }}
                    whileTap={{ scale: accepting === invite.id ? 1 : 0.98 }}
                  >
                    {accepting === invite.id ? 'Accepting...' : 'Accept Invite'}
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleReject(invite.id)}
                    disabled={accepting === invite.id}
                    className="px-6 py-3 bg-[rgba(255,255,255,0.05)] border border-gray-700 rounded-lg text-gray-300 font-semibold hover:bg-[rgba(255,255,255,0.1)] transition disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Reject
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
