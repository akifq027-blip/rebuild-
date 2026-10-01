/**
 * BHARAT — Build the Civilization
 * Centralized Frontend API Service
 */

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface UserData {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponseData {
  token: string;
  user: UserData;
  civilizationName?: string;
  playerState?: any;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    // Load stored token
    this.token = localStorage.getItem('bharat_auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('bharat_auth_token', token);
    } else {
      localStorage.removeItem('bharat_auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return {
          success: false,
          error: data?.error || {
            code: `HTTP_${response.status}`,
            message: data?.message || `Request failed with status ${response.status}`,
          },
        };
      }

      return data as ApiResponse<T>;
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: err.message || 'Network connection failed. Operating in offline mode.',
        },
      };
    }
  }

  // 1. Health
  async checkHealth() {
    return this.request<{
      server: string;
      database: string;
      ai: string;
      version: string;
    }>('/api/health');
  }

  // 2. Auth: Register
  async register(name: string, email: string, password: string, civilizationName?: string) {
    const res = await this.request<AuthResponseData>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, civilizationName }),
    });

    if (res.success && res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  // 3. Auth: Login
  async login(email: string, password: string) {
    const res = await this.request<AuthResponseData>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (res.success && res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  // 4. Auth: Get Current User Profile
  async getMe() {
    return this.request<{ user: UserData; playerState: any }>('/api/auth/me');
  }

  // 5. Auth: Logout
  logout() {
    this.setToken(null);
  }

  // 6. Game State: Fetch from Server
  async getPlayerState() {
    return this.request('/api/player/state');
  }

  // 7. Game State: Save to Server
  async savePlayerState(state: any) {
    return this.request('/api/player/state', {
      method: 'POST',
      body: JSON.stringify(state),
    });
  }

  // 8. Game State: Synchronize Local Progress with Cloud
  async syncPlayerState(localState: any) {
    return this.request('/api/player/sync', {
      method: 'POST',
      body: JSON.stringify(localState),
    });
  }

  // 9. AI Acharya: Ask Question
  async askAcharya(message: string, context?: any) {
    return this.request<{ answer: string; guide: string }>('/api/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  }
}

export const api = new ApiService();
export default api;
