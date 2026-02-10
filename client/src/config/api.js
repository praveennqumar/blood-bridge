// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4040';

export const API_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/api/v1/auth/register`,
  LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
  CURRENT_USER: `${API_BASE_URL}/api/v1/auth/current-user`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/v1/auth/forgot-password`,
  GENERATE_OTP: `${API_BASE_URL}/api/v1/auth/send-mail`,
  VERIFY_OTP: `${API_BASE_URL}/api/v1/auth/verify-otp`,
  
};

export default API_BASE_URL;

