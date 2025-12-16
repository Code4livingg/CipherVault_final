export type ComplianceStandard = 'SOC2' | 'GDPR' | 'HIPAA' | 'PCI-DSS'

export interface ComplianceSettings {
  enabled: boolean
  standards: ComplianceStandard[]
  requireKYC: boolean
  enforceAuditLog: boolean
  dataRetentionDays: number
  allowDataExport: boolean
  requireTwoFactor: boolean
  ipWhitelist: string[]
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  resource: string
  resourceId: string
  ipAddress: string
  userAgent: string
  result: 'success' | 'failure'
  details?: Record<string, any>
}

export const DEFAULT_COMPLIANCE_SETTINGS: ComplianceSettings = {
  enabled: false,
  standards: [],
  requireKYC: false,
  enforceAuditLog: true,
  dataRetentionDays: 365,
  allowDataExport: true,
  requireTwoFactor: false,
  ipWhitelist: []
}

export function validateComplianceAction(
  action: string,
  settings: ComplianceSettings,
  userKYCStatus?: boolean
): { allowed: boolean; reason?: string } {
  if (!settings.enabled) {
    return { allowed: true }
  }

  // KYC check
  if (settings.requireKYC && !userKYCStatus) {
    return {
      allowed: false,
      reason: 'KYC verification required for this action'
    }
  }

  // Sensitive actions require 2FA
  const sensitiveActions = ['vault.delete', 'vault.unlock', 'org.delete', 'member.remove']
  if (settings.requireTwoFactor && sensitiveActions.includes(action)) {
    // In real implementation, check 2FA status
    return { allowed: true }
  }

  return { allowed: true }
}

export function createAuditLogEntry(
  userId: string,
  userName: string,
  action: string,
  resource: string,
  resourceId: string,
  result: 'success' | 'failure',
  details?: Record<string, any>
): AuditLogEntry {
  return {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    userId,
    userName,
    action,
    resource,
    resourceId,
    ipAddress: '0.0.0.0', // Would be real IP in production
    userAgent: navigator.userAgent,
    result,
    details
  }
}

export function exportAuditLog(
  entries: AuditLogEntry[],
  format: 'csv' | 'json' | 'pdf'
): string | Blob {
  if (format === 'json') {
    return JSON.stringify(entries, null, 2)
  }

  if (format === 'csv') {
    const headers = ['Timestamp', 'User', 'Action', 'Resource', 'Result', 'IP Address']
    const rows = entries.map(e => [
      e.timestamp,
      e.userName,
      e.action,
      `${e.resource}:${e.resourceId}`,
      e.result,
      e.ipAddress
    ])
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')
    
    return csv
  }

  // PDF would require a library like jsPDF
  return 'PDF export not implemented'
}

export function getComplianceColor(standard: ComplianceStandard): string {
  switch (standard) {
    case 'SOC2': return '#3B82F6'
    case 'GDPR': return '#10B981'
    case 'HIPAA': return '#8B5CF6'
    case 'PCI-DSS': return '#D1A954'
  }
}

export function getComplianceLabel(standard: ComplianceStandard): string {
  return standard
}
