// audit-log/types/audit-log.types.ts
export const ActionType = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  VIEW: 'VIEW',
  EXPORT: 'EXPORT',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
} as const;

export const ModuleType = {
  INVESTASI: 'INVESTASI',
  PASAR: 'PASAR',
  LIKUIDITAS: 'LIKUIDITAS',
  OPERASIONAL: 'OPERASIONAL',
  HUKUM: 'HUKUM',
  STRATEJIK: 'STRATEJIK',
  KEPATUHAN: 'KEPATUHAN',
  REPUTASI: 'REPUTASI',
  USER_MANAGEMENT: 'USER_MANAGEMENT',
  SYSTEM: 'SYSTEM',
} as const;

export type ActionType = keyof typeof ActionType;
export type ModuleType = keyof typeof ModuleType;
