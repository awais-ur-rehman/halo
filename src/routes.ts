// src/routes.ts
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CONTROL_CENTER: '/dashboard/control-center',
  
  BRANCHES: '/dashboard/branches',
  BRANCHES_OVERVIEW: '/dashboard/branches/overview',
  BRANCHES_LOCATIONS: '/dashboard/branches/locations',
  BRANCHES_PERFORMANCE: '/dashboard/branches/performance',
  
  COMPETITORS: '/dashboard/competitors',
  COMPETITORS_ANALYSIS: '/dashboard/competitors/analysis',
  COMPETITORS_TRACKING: '/dashboard/competitors/tracking',
  COMPETITORS_BENCHMARKS: '/dashboard/competitors/benchmarks',
  
  DEPARTMENTS: '/dashboard/departments',
  DEPARTMENTS_OVERVIEW: '/dashboard/departments/overview',
  DEPARTMENTS_STAFF: '/dashboard/departments/staff',
  DEPARTMENTS_PROJECTS: '/dashboard/departments/projects',
  DEPARTMENTS_SCHEDULES: '/dashboard/departments/schedules',
  
  REPORTS: '/dashboard/reports',
  REPORTS_DASHBOARD: '/dashboard/reports/dashboard',
  REPORTS_FINANCIAL: '/dashboard/reports/financial',
  REPORTS_ALERTS: '/dashboard/reports/alerts',
  REPORTS_SCHEDULED: '/dashboard/reports/scheduled',
  
  BRANCH_DETAIL: '/dashboard/branch',
  BRANCH_DASHBOARD: '/dashboard/branch/dashboard',
  BRANCH_STAFF: '/dashboard/branch/staff',
  BRANCH_OPERATIONS: '/dashboard/branch/operations',
  BRANCH_CUSTOMERS: '/dashboard/branch/customers',
  BRANCH_REPORTS: '/dashboard/branch/reports',
  
  FORGOT_PASSWORD: '/forgot-password',
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type RouteValues = typeof ROUTES[RouteKeys];