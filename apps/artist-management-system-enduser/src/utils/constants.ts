import { USER_ROLE } from '@/types';

export const PUBLIC_ROUTES = {
  login: '/login',
  signUp: '/signup',
  forgotPassword: '/forgot-password',
  terms: '/terms-of-services',
  policy: '/privacy-policy',
};

export const PRIVATE_ROUTES = {
  home: '/home',
  users: '/users',
  artists: '/artists',
  bulkUpload: '/bulk-upload',
};

export const SELECT_ROLE_OPTIONS: Array<{ label: string; value: USER_ROLE }> = [
  {
    label: 'Artist',
    value: USER_ROLE.ARTIST,
  },
  {
    label: 'Artist Manager',
    value: USER_ROLE.ARTIST_MANAGER,
  },
  {
    label: 'Admin',
    value: USER_ROLE.SUPER_ADMIN,
  },
];
