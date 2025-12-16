import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useToast } from '../../contexts/ToastContext'
import { useRoleGuard } from '../../security/useRoleGuard'
import MemberCard from '../../components/org/MemberCard'
import InviteMemberPanel from '../../components/org/InviteMemberPanel'
import { OrgMember } from '../../types/organization'

export default function MembersDirectory() {
  const { info, error } = useToast()
  const { can } = useRoleGuard('ADMIN')
  
  const [members, setMembers] = useState<OrgMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showInvitePanel, setShowInvitePanel] = useState(false)
  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all')

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      // TODO: API call
      // const data = await getOrgMembers(orgId)
      
      // Mock data
      const mockMembers: OrgMember[] = [
        {
          id: '1',
          userId: 'user-1',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          role: 'ADMIN',
          status: 'online',
          joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          lastActive: new Date().toISOString(),
          signingReliability: 98,
          avgSigningTime: 8,
          totalSigns: 45
        },
        {
          id: '2',
          userId: 'user-2',
          name: 'Bob Smith',
          email: 'bob@example.com',
          role: 'SIGNER',
          status: 'online',
          joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          signingReliability: 92,
          avgSigningTime: 15,
          totalSigns: 38
        },
        {
          id: '3',
          userId: 'user-3',
          name: 'Charlie Davis',
          email: 'charlie@example.com',
          role: 'AUDITOR',
          status: 'offline',
          joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          signingReliability: 0,
          avgSigningTime: 0,
          totalSigns: 0
        }
      ]
      
      setMembers(mockMembers)
      info('Members loaded')
    } catch (err) {
      error('Failed to load members')
    } finally {
      setLoading(false)
    }
  }

  const filteredMembers = members.filter(member => {
    if (filter === 'all') return true
    return member.status === filter
  })

  const stats = {
    total: members.length,
    online: members.filter(m => m.status === 'online').length,
    avgReliability: members.length > 0
      ? Math.round(members.reduce((sum, m) => sum + m.signingReliability, 0) / members.length)
      : 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E1A] via-[#11161C] to-[#0A0E1A] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Team Members
              </h1>
              <p className="text-gray-400">Manage your organization members</p>
            </div>
            
            {can('canInviteMembers') && (
              <motion.button
                onClick={() => setShowInvitePanel(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                + Invite Member
              </motion.button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
              className="bg-[rgba(17,22,28,0.6)] backdrop-blur-xl border border-blue-500/20 rounded-xl p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-3xl font-bold text-blue-400 mb-1">{stats.total}</div>
              <div className="text-sm text-gray-400">Total Members</div>
            </motion.div>

            <motion.div
              className="bg-[rgba(17,22,28,0.6)] backdrop-blur-xl border border-emerald-500/20 rounded-xl p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
            >
              <div className="text-3xl font-bold text-emerald-400 mb-1">{stats.online}</div>
              <div className="text-sm text-gray-400">Online Now</div>
            </motion.div>

            <motion.div
              className="bg-[rgba(17,22,28,0.6)] backdrop-blur-xl border border-gold-500/20 rounded-xl p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-3xl font-bold text-[#D1A954] mb-1">{stats.avgReliability}%</div>
              <div className="text-sm text-gray-400">Avg Reliability</div>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            {(['all', 'online', 'offline'] as const).map((f) => (
              <motion.button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                  filter === f
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Members Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-white">Loading members...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member, index) => (
              <MemberCard key={member.id} member={member} index={index} userRole="ADMIN" />
            ))}
          </div>
        )}
      </div>

      {/* Invite Panel */}
      {showInvitePanel && (
        <InviteMemberPanel
          orgId="org-1"
          onClose={() => setShowInvitePanel(false)}
          onInviteSent={fetchMembers}
        />
      )}
    </div>
  )
}
