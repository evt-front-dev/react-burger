import { getCookie } from "./cookies";

class Api {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.timeout = 15000;
  }

  async _checkResponse(res) {
    const data = await res.json();
    if (res.ok) {
      return data;
    }
    throw new Error(data.message || "Произошла ошибка");
  }

  async fetchWithTimeout(url, options) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      if (error.name === "AbortError") {
        throw new Error("Превышено время ожидания запроса");
      }
      throw error;
    }
  }

  async request(endpoint, options) {
    const token = getCookie("token");
    if (token && !options.headers.authorization) {
      options.headers.authorization = token;
    }

    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, options);
      const data = await this._checkResponse(res);
      return data;
    } catch (err) {
      if (err.message === "jwt expired") {
        try {
          const refreshData = await this.refreshToken();
          options.headers.authorization = refreshData.accessToken;
          return await this.request(endpoint, options);
        } catch (refreshErr) {
          throw refreshErr;
        }
      }
      throw err;
    }
  }

  async refreshToken() {
    const refreshToken = getCookie("refreshToken");
    return this.request("/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: refreshToken }),
    });
  }

  async logout() {
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

  async getUser() {
    return this.request("/auth/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async updateUser({ name, email, password }) {
    const body = {};
    if (name) body.name = name;
    if (email) body.email = email;
    if (password) body.password = password;

    return this.request("/auth/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  async login(email, password) {
    return this.request("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email, password, name) {
    return this.request("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, name }),
    });
  }
}

export const api = new Api("https://norma.nomoreparties.space/api");
