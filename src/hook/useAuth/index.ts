import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import type { LoginFormData, AuthResponse } from '../../types/auth';

const MOCK_USER = {
  id: '1',
  email: 'admin@ubl.com',
  name: 'Admin User'
};

const MOCK_CREDENTIALS = {
  email: 'admin@ubl.com',
  password: 'Ubl@1234'
};

const mockLoginApi = async (credentials: LoginFormData): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (
        credentials.email === MOCK_CREDENTIALS.email &&
        credentials.password === MOCK_CREDENTIALS.password
      ) {
        resolve({
          user: MOCK_USER,
          token: 'mock-jwt-token-' + Date.now()
        });
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 1000);
  });
};

export const useAuth = () => {
  const { user, isAuthenticated, setLoading, logout: storeLogout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormData) => {
      setLoading(true);
      try {
        const response = await mockLoginApi(credentials);
        
        localStorage.setItem('auth-token', response.token);
        
        useAuthStore.setState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
        });

        return response;
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
  });

  const logout = () => {
    localStorage.removeItem('auth-token');
    storeLogout();
  };

  return {
    user,
    isAuthenticated,
    isLoading: loginMutation.isPending,
    login: loginMutation.mutate,
    logout,
    loginError: loginMutation.error,
    isLoginPending: loginMutation.isPending,
  };
};