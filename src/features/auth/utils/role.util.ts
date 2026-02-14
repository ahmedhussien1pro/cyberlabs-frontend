export type UserRole = 'admin' | 'trainee' | 'content-creator';

type BackendRole = 'ADMIN' | 'STUDENT' | 'TRAINEE' | 'CONTENT_CREATOR';

const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 3,
  'content-creator': 2,
  trainee: 1,
};

export const roleUtils = {
  mapBackendRole(backendRole: string): UserRole {
    const roleMap: Record<string, UserRole> = {
      ADMIN: 'admin',
      STUDENT: 'trainee',
      TRAINEE: 'trainee',
      CONTENT_CREATOR: 'content-creator',
    };

    const normalized = backendRole.toUpperCase();
    return roleMap[normalized] || 'trainee';
  },
  hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
    const userLevel = ROLE_HIERARCHY[userRole] || 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;

    return userLevel >= requiredLevel;
  },
  isAdmin(role: UserRole): boolean {
    return role === 'admin';
  },
  isContentCreator(role: UserRole): boolean {
    return role === 'content-creator';
  },
  isTrainee(role: UserRole): boolean {
    return role === 'trainee';
  },
  getRoleDisplayName(role: UserRole): string {
    const displayNames: Record<UserRole, string> = {
      admin: 'Administrator',
      'content-creator': 'Content Creator',
      trainee: 'Trainee',
    };

    return displayNames[role] || 'User';
  },
  getAllRoles(): UserRole[] {
    return ['admin', 'content-creator', 'trainee'];
  },
};
