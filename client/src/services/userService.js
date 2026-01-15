import { API_ENDPOINTS } from '../config/api';
import { STORAGE_KEYS } from '../constants/appConstants';

/**
 * User Service
 * Handles all user-related API calls and operations
 */

/**
 * Get current authenticated user
 * @returns {Promise<Object|null>} User object or null if not authenticated/error
 */

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      return null;
    }

    const response = await fetch(API_ENDPOINTS.CURRENT_USER, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    // Handle non-OK responses
    if (!response.ok) {
      if (response.status === 401) {
        // Token is invalid, clear it
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.user) {
      // Optionally store user data in localStorage
      // localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      return data.user;
    }

    return null;
  } catch (error) {
    console.error('Error fetching current user:', error);
    // Clear invalid token on error
    if (error.message.includes('401')) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
    return null;
  }
};

/**
 * Logout user - clears authentication data
 */
export const logout = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

/**
 * Get stored user data from localStorage
 * @returns {Object|null} User object or null
 */

export const getStoredUser = () => {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error reading stored user:', error);
    return null;
  }
};

