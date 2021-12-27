export const authLinks = [
  {
    id: 1,
    text: 'Create product',
    slug: '/products/create',
  },
  {
    id: 2,
    text: 'My Orders',
    slug: '/me/orders',
  },
  {
    id: 3,
    text: 'My products',
    slug: '/me/products',
  },
  {
    id: 4,
    text: 'Profile',
    slug: '/me/profile',
  },
] as const;

export const noAuthLinks = [
  {
    id: 1,
    text: 'Login',
    slug: '/auth/login',
  },
  {
    id: 2,
    text: 'Register',
    slug: '/auth/register',
  },
] as const;

export const adminLinks = [
  {
    id: 1,
    text: 'Users',
    slug: '/admin/users',
  },
  {
    id: 2,
    text: 'Orders',
    slug: '/admin/orders',
  },
  {
    id: 3,
    text: 'Products',
    slug: '/admin/products',
  },
] as const;
