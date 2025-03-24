import { getCookie } from "./cookies";

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

interface AuthResponse extends ApiResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    name: string;
  };
}

interface RequestOptions extends Omit<RequestInit, "headers"> {
  headers?: Headers | { [key: string]: string };
}

interface ResetPasswordData {
  password: string;
  token: string;
}

class Api {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.timeout = 15000;
  }

  private checkResponse = async <T>(res: Response): Promise<T> => {
    if (res.ok) {
      return await res.json();
    }
    const error = await res.json();
    throw new Error(error.message);
  };

  private async fetchWithTimeout(
    url: string,
    options: RequestOptions
  ): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);

    const headers = new Headers(options.headers);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error: any) {
      clearTimeout(id);
      if (error.name === "AbortError") {
        throw new Error("Превышено время ожидания запроса");
      }
      throw error;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const token = getCookie("token");
    const headers = new Headers(options.headers);

    if (token) {
      headers.set("authorization", token);
    }

    try {
      const res = await this.fetchWithTimeout(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });
      return await this.checkResponse<T>(res);
    } catch (err: any) {
      if (err.message === "jwt expired") {
        try {
          const refreshData = await this.refreshToken();
          if (refreshData.success) {
            headers.set("authorization", refreshData.accessToken);
            return await this.request(endpoint, { ...options, headers });
          }
        } catch (refreshErr) {
          throw refreshErr;
        }
      }
      throw err;
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = getCookie("refreshToken");
    return this.request("/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: refreshToken }),
    });
  }

  async logout(): Promise<ApiResponse> {
    const refreshToken = getCookie("refreshToken");
    return this.request("/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: refreshToken,
      }),
    });
  }

  async getUser(): Promise<AuthResponse> {
    return this.request("/auth/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async updateUser(data: {
    name?: string;
    email?: string;
    password?: string;
  }): Promise<AuthResponse> {
    const body: { [key: string]: string } = {};
    if (data.name) body.name = data.name;
    if (data.email) body.email = data.email;
    if (data.password) body.password = data.password;

    return this.request("/auth/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  }

  public register = async (
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse> => {
    return await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name,
      }),
    });
  };
}

export const api = new Api("https://norma.nomoreparties.space/api");

export const resetPass = async (data: ResetPasswordData) => {
  const response = await fetch(
    "https://norma.nomoreparties.space/api/password-reset/reset",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Ошибка при сбросе пароля");
  }

  return response.json();
};
