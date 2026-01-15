/**
 * Application Constants
 * Centralized constants for the Blood Bank application
 */

export const APP_CONFIG = {
  NAME: 'Blood Bridge',
  TAGLINE: 'Save Lives, Donate Blood',
  COPYRIGHT_YEAR: new Date().getFullYear(),
  LOGO_PATH: '/title.png',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  DONOR: 'donar',
  ORGANISATION: 'organisation',
  HOSPITAL: 'hospital',
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
};

export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading',
};

