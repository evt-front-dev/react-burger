import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../utils/api";
import { setCookie, getCookie, deleteCookie } from "../../utils/cookies";

const initialState = {
  user: null,
  isAuthChecked: false,
  accessToken: null,
  loading: false,
  error: null,
  loginAttempts: 0,
};

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = await api.getUser();
      if (data.success) {
        return data;
      }
      return rejectWithValue(data.message);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const validatePassword = (password) => {
  return password.length >= 6;
};

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await api.updateUser(userData);
      if (data.success) {
        return data;
      }
      return rejectWithValue(data.message);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const refreshToken = createAsyncThunk(
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
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      const data = await api.register(email, password, name);
      if (data.success) {
        setCookie("token", data.accessToken);
        setCookie("refreshToken", data.refreshToken);
        return data;
      }
      return rejectWithValue(data.message);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await api.login(email, password);
      if (data.success) {
        setCookie("token", data.accessToken);
        setCookie("refreshToken", data.refreshToken);
        return data;
      }
      return rejectWithValue(data.message);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = getCookie("refreshToken");
      const data = await api.logout(refreshToken);

      if (data.success) {
        deleteCookie("token");
        deleteCookie("refreshToken");
        return data;
      }
      return rejectWithValue(data.message);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAuthChecked: (state, action) => {
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
        state.error = action.payload;
        state.user = null;
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
        state.error = action.payload;
      });

    // Register
    builder
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
        state.error = action.error.message;
      });

    // Login
    builder
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
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Refresh Token
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
      });

    builder
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || "Произошла неизвестная ошибка";

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
