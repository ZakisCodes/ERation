import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  // Send OTP to mobile number
  sendOTP: async (rationCardId: string, mobileNumber: string) => {
    const response = await api.post('/auth/send-otp', {
      rationCardId,
      mobileNumber,
    });
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (otp: string, rationCardId: string, mobileNumber: string) => {
    const response = await api.post('/auth/verify-otp', {
      otp,
      rationCardId,
      mobileNumber,
    });
    return response.data;
  },

  // Get family members
  getFamilyMembers: async (rationCardId: string) => {
    const response = await api.get(`/auth/family-members/${rationCardId}`);
    return response.data;
  },

  // Verify government ID
  verifyGovernmentID: async (memberId: string, idType: string, idNumber: string) => {
    const response = await api.post('/auth/verify-id', {
      memberId,
      governmentIdType: idType,
      governmentIdNumber: idNumber,
    });
    return response.data;
  },

  // Complete verification
  completeVerification: async (memberId: string) => {
    const response = await api.post('/auth/complete-verification', {
      memberId,
    });
    return response.data;
  },
};

// Ration API
export const rationAPI = {
  // Get available stocks
  getStocks: async () => {
    const response = await api.get('/ration/stocks');
    return response.data;
  },

  // Get user's quota
  getUserQuota: async (memberId: string) => {
    const response = await api.get(`/ration/quota/${memberId}`);
    return response.data;
  },

  // Get transaction history
  getTransactionHistory: async (memberId: string) => {
    const response = await api.get(`/ration/transactions/${memberId}`);
    return response.data;
  },

  // Initiate transaction
  initiateTransaction: async (memberId: string, qrCode: string) => {
    const response = await api.post('/ration/initiate-transaction', {
      memberId,
      qrCode,
    });
    return response.data;
  },
};

export default api;
