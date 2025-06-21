export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CONTROL_CENTER: '/dashboard/control-center',
  BRANCHES: '/dashboard/branches',
  FORGOT_PASSWORD: '/forgot-password',
} as const;

export type RouteKeys = keyof typeof ROUTES;
export type RouteValues = typeof ROUTES[RouteKeys];