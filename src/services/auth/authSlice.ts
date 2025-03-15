import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../utils/api";
import { setCookie, deleteCookie } from "../../utils/cookies";

interface User {
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthChecked: boolean;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  loginAttempts: number;
}

interface AuthResponse {
  success: boolean;
  user: User;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest extends LoginRequest {
  name: string;
}

interface UpdateUserRequest {
  email?: string;
  name?: string;
  password?: string;
}

const initialState: AuthState = {
  user: null,
  isAuthChecked: false,
  accessToken: null,
  loading: false,
  error: null,
  loginAttempts: 0,
};

export const getUser = createAsyncThunk<AuthResponse>(
  "auth/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.getUser();
      if (data.success) {
        return data;
      }
      return rejectWithValue(null);
    } catch (err: any) {
      if (
        err.message === "jwt expired" ||
        err.message === "jwt malformed" ||
        err.message === "jwt must be provided"
      ) {
        return rejectWithValue(null);
      }
      return rejectWithValue(err.message);
    }
  }
);

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const updateUser = createAsyncThunk<AuthResponse, UpdateUserRequest>(
  "auth/updateUser",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await api.updateUser(userData);
      if (data.success) {
        return data;
      }
      return rejectWithValue(data.message);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const refreshToken = createAsyncThunk<AuthResponse>(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.refreshToken();
      if (data.success) {
        setCookie("token", data.accessToken);
        setCookie("refreshToken", data.refreshToken);
        return data;
      }
      return rejectWithValue(data.message);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const register = createAsyncThunk<AuthResponse, RegisterRequest>(
  "auth/register",
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      const data = await api.register(email, password, name);
      if (data.success) {
        setCookie("token", data.accessToken);
        setCookie("refreshToken", data.refreshToken);
        return data;
      }
      return rejectWithValue("Ошибка при регистрации");
    } catch (err: any) {
      if (err.message === "User already exists") {
        return rejectWithValue("Пользователь с таким email уже существует");
      }
      return rejectWithValue(err.message || "Произошла ошибка при регистрации");
    }
  }
);

export const login = createAsyncThunk<AuthResponse, LoginRequest>(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await api.login(email, password);
      if (data.success) {
        setCookie("token", data.accessToken);
        setCookie("refreshToken", data.refreshToken);
        localStorage.setItem("accessToken", data.accessToken);
        return data;
      }
      return rejectWithValue("Неверный логин или пароль");
    } catch (err: any) {
      return rejectWithValue(
        err.message === "email or password are incorrect"
          ? "Неверный логин или пароль"
          : "Произошла ошибка при входе"
      );
    }
  }
);

export const logout = createAsyncThunk<{ success: boolean; message?: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.logout();
      if (data.success) {
        deleteCookie("token");
        deleteCookie("refreshToken");
        return data;
      }
      return rejectWithValue(data.message);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
      state.loading = false;
    },
    resetAuthState: (state) => {
      state.user = null;
      state.isAuthChecked = true;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    incrementLoginAttempts: (state) => {
      state.loginAttempts += 1;
    },
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = null;
        state.isAuthChecked = true;
      })

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
        state.isAuthChecked = true;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })

      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
      })

      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action: any) => {
          state.loading = false;
          if (action.type !== "auth/login/rejected") {
            state.error =
              action.error?.message || "Произошла неизвестная ошибка";
          }
          state.isAuthChecked = true;

          if (action.type === "auth/login/rejected") {
            state.loginAttempts += 1;
          }
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      );
  },
});

export const {
  setUser,
  setAuthChecked,
  resetAuthState,
  clearError,
  incrementLoginAttempts,
  resetLoginAttempts,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
