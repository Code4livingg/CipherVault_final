import { useCallback } from 'react'
import { OrgRole } from '../types/organization'
import { hasPermission, RolePermissions } from './roles'

interface UseRoleGuardReturn {
  can: (permission: keyof RolePermissions) => boolean
  canAny: (permissions: (keyof RolePermissions)[]) => boolean
  canAll: (permissions: (keyof RolePermissions)[]) => boolean
  isAdmin: boolean
  isSigner: boolean
  isAuditor: boolean
  role: OrgRole | null
}

export function useRoleGuard(userRole: OrgRole | null): UseRoleGuardReturn {
  const can = useCallback(
    (permission: keyof RolePermissions): boolean => {
      if (!userRole) return false
      return hasPermission(userRole, permission)
    },
    [userRole]
  )

  const canAny = useCallback(
    (permissions: (keyof RolePermissions)[]): boolean => {
      if (!userRole) return false
      return permissions.some(permission => hasPermission(userRole, permission))
    },
    [userRole]
  )

  const canAll = useCallback(
    (permissions: (keyof RolePermissions)[]): boolean => {
      if (!userRole) return false
      return permissions.every(permission => hasPermission(userRole, permission))
    },
    [userRole]
  )

  return {
    can,
    canAny,
    canAll,
    isAdmin: userRole === 'ADMIN',
    isSigner: userRole === 'SIGNER',
    isAuditor: userRole === 'AUDITOR',
    role: userRole
  }
}

// HOC for protecting components
export function withRoleGuard<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: keyof RolePermissions,
  userRole: OrgRole | null,
  fallback?: React.ReactNode
): React.FC<P> {
  return (props: P) => {
    if (!userRole || !hasPermission(userRole, requiredPermission)) {
      return <>{fallback || null}</>
    }
    return <Component {...props} />
  }
}
