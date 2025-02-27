export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
  PROFILE: '/profile',
} as const;

export type RouteKeys = keyof typeof ROUTES;

export const getRoute = (
  route: RouteKeys,
  params?: Record<string, string>
): string => {
  const path = ROUTES[route];
  if (typeof path === 'function') {
    return path(params?.id || '');
  }
  return path;
};

export const isRoute = (path: string, route: RouteKeys): boolean => {
  const routePath = ROUTES[route];
  if (typeof routePath === 'function') {
    return path.startsWith(routePath('').replace('/:id', ''));
  }
  return path === routePath;
};
