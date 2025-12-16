import { OrgRole } from '../types/organization'

export interface RolePermissions {
  canCreateVaults: boolean
  canDeleteVaults: boolean
  canInviteMembers: boolean
  canRemoveMembers: boolean
  canChangeRoles: boolean
  canSignProposals: boolean
  canViewAnalytics: boolean
  canExportData: boolean
  canModifyOrgSettings: boolean
  canViewVaults: boolean
}

export const ROLE_PERMISSIONS: Record<OrgRole, RolePermissions> = {
  ADMIN: {
    canCreateVaults: true,
    canDeleteVaults: true,
    canInviteMembers: true,
    canRemoveMembers: true,
    canChangeRoles: true,
    canSignProposals: true,
    canViewAnalytics: true,
    canExportData: true,
    canModifyOrgSettings: true,
    canViewVaults: true
  },
  SIGNER: {
    canCreateVaults: false,
    canDeleteVaults: false,
    canInviteMembers: false,
    canRemoveMembers: false,
    canChangeRoles: false,
    canSignProposals: true,
    canViewAnalytics: false,
    canExportData: false,
    canModifyOrgSettings: false,
    canViewVaults: true
  },
  AUDITOR: {
    canCreateVaults: false,
    canDeleteVaults: false,
    canInviteMembers: false,
    canRemoveMembers: false,
    canChangeRoles: false,
    canSignProposals: false,
    canViewAnalytics: true,
    canExportData: true,
    canModifyOrgSettings: false,
    canViewVaults: true
  }
}

export function hasPermission(role: OrgRole, permission: keyof RolePermissions): boolean {
  return ROLE_PERMISSIONS[role][permission]
}

export function getRoleColor(role: OrgRole): string {
  switch (role) {
    case 'ADMIN':
      return '#D1A954' // Gold
    case 'SIGNER':
      return '#3B82F6' // Blue
    case 'AUDITOR':
      return '#6B7280' // Gray
  }
}

export function getRoleLabel(role: OrgRole): string {
  return role.charAt(0) + role.slice(1).toLowerCase()
}

export function getRoleDescription(role: OrgRole): string {
  switch (role) {
    case 'ADMIN':
      return 'Full access to manage organization, vaults, and members'
    case 'SIGNER':
      return 'Can sign unlock proposals and view vaults'
    case 'AUDITOR':
      return 'Read-only access to analytics and vault history'
  }
}
