// This is a placeholder for the actual API service
// In a real app, this would contain Axios or Fetch configuration for API calls

const BASE_URL = 'https://api.example.com';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

/**
 * Generic API request function
 */
const request = async <T>(endpoint: string, options?: RequestOptions): Promise<T> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
  
  // For demo purposes, just return mock data
  // In a real app, this would make actual API calls
  return {} as T;
};

export default {
  // Auth endpoints
  auth: {
    login: (email: string, password: string) => 
      request('/auth/login', { 
        method: 'POST', 
        body: { email, password } 
      }),
    register: (name: string, email: string, password: string) => 
      request('/auth/register', { 
        method: 'POST', 
        body: { name, email, password } 
      }),
    verifyEmail: (email: string, code: string) => 
      request('/auth/verify', { 
        method: 'POST', 
        body: { email, code } 
      }),
  },
  
  // Challenge endpoints
  challenges: {
    getAll: () => request('/challenges'),
    getById: (id: string) => request(`/challenges/${id}`),
    create: (data: any) => request('/challenges', { method: 'POST', body: data }),
    join: (id: string) => request(`/challenges/${id}/join`, { method: 'POST' }),
  },
  
  // Progress endpoints
  progress: {
    record: (challengeId: string, data: any) => 
      request(`/challenges/${challengeId}/progress`, { 
        method: 'POST', 
        body: data 
      }),
    getByChallenge: (challengeId: string) => 
      request(`/challenges/${challengeId}/progress`),
  },
  
  // User endpoints
  user: {
    getProfile: () => request('/user/profile'),
    updateProfile: (data: any) => 
      request('/user/profile', { 
        method: 'PUT', 
        body: data 
      }),
  }
}; 