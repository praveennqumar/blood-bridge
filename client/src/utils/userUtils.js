/**
 * User Utility Functions
 * Helper functions for user-related operations
 */

/**
 * Get display name for user based on role
 * @param {Object} user - User object
 * @returns {string} Display name
 */
export const getUserDisplayName = (user) => {
  if (!user) return 'User';
  if (user.name) return user.name;
  if (user.organisationName) return user.organisationName;
  if (user.hospitalName) return user.hospitalName;
  return user.email || 'User';
};

/**
 * Get formatted user role
 * @param {Object} user - User object
 * @returns {string} Formatted role (capitalized)
 */
export const getUserRole = (user) => {
  if (!user || !user.role) return '';
  const role = user.role;
  return role.charAt(0).toUpperCase() + role.slice(1);
};

/**
 * Check if user has a specific role
 * @param {Object} user - User object
 * @param {string} role - Role to check
 * @returns {boolean} True if user has the role
 */
export const hasRole = (user, role) => {
  return user && user.role === role;
};

/**
 * Check if user is admin
 * @param {Object} user - User object
 * @returns {boolean} True if user is admin
 */
export const isAdmin = (user) => {
  return hasRole(user, 'admin');
};

