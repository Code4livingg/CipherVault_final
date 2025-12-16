import { motion } from 'framer-motion'
import { OrgMember, OrgRole } from '../../types/organization'
import { getRoleColor, getRoleLabel } from '../../security/roles'

interface MemberCardProps {
  member: OrgMember
  index: number
  userRole: OrgRole | null
}

export default function MemberCard({ member, index }: MemberCardProps) {
  const statusColors = {
    online: { color: '#10B981', label: 'Online' },
    offline: { color: '#6B7280', label: 'Offline' },
    away: { color: '#D1A954', label: 'Away' }
  }

  const status = statusColors[member.status]

  return (
    <motion.div
      className="member-card"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="member-card__inner">
        {/* Header */}
        <div className="member-card__header">
          <div className="member-card__avatar">
            {member.avatar ? (
              <img src={member.avatar} alt={member.name} />
            ) : (
              <div className="member-card__avatar-placeholder">
                {member.name.charAt(0)}
              </div>
            )}
            
            {/* Status pulse */}
            <motion.div
              className="member-card__status-pulse"
              style={{ backgroundColor: status.color }}
              animate={{
                scale: member.status === 'online' ? [1, 1.3, 1] : 1,
                opacity: member.status === 'online' ? [0.8, 0.3, 0.8] : 0.5
              }}
              transition={{
                duration: 2,
                repeat: member.status === 'online' ? Infinity : 0
              }}
            />
          </div>

          <div className="member-card__role-badge" style={{ 
            backgroundColor: `${getRoleColor(member.role)}20`,
            color: getRoleColor(member.role),
            borderColor: `${getRoleColor(member.role)}40`
          }}>
            {getRoleLabel(member.role)}
          </div>
        </div>

        {/* Info */}
        <div className="member-card__info">
          <h3 className="member-card__name">{member.name}</h3>
          <p className="member-card__email">{member.email}</p>
          
          <div className="member-card__status" style={{ color: status.color }}>
            <span className="member-card__status-dot" style={{ backgroundColor: status.color }} />
            {status.label}
          </div>
        </div>

        {/* Reliability Score */}
        {member.role !== 'AUDITOR' && (
          <div className="member-card__reliability">
            <div className="member-card__reliability-label">
              <span>Signing Reliability</span>
              <span className="member-card__reliability-value">{member.signingReliability}%</span>
            </div>
            <div className="member-card__reliability-bar">
              <motion.div
                className="member-card__reliability-fill"
                style={{
                  backgroundColor: member.signingReliability >= 90 ? '#10B981' : 
                                 member.signingReliability >= 70 ? '#D1A954' : '#DC2626'
                }}
                initial={{ width: 0 }}
                animate={{ width: `${member.signingReliability}%` }}
                transition={{ duration: 1, delay: index * 0.05 + 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="member-card__stats">
          <div className="member-card__stat">
            <div className="member-card__stat-value">{member.totalSigns}</div>
            <div className="member-card__stat-label">Total Signs</div>
          </div>
          <div className="member-card__stat">
            <div className="member-card__stat-value">{member.avgSigningTime}m</div>
            <div className="member-card__stat-label">Avg Time</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
