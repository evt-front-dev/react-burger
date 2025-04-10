import authReducer, {
  setUser,
  setAuthChecked,
  resetAuthState,
  clearError,
  login,
  register,
  getUser,
  logout,
  updateUser,
  refreshToken,
} from "../authSlice";

describe("auth reducer", () => {
  const initialState = {
    user: null,
    isAuthChecked: false,
    accessToken: null,
    loading: false,
    error: null,
    loginAttempts: 0,
  };

  it("should return the initial state", () => {
    expect(authReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it("should handle setUser", () => {
    const user = {
      email: "test@example.com",
      name: "Test User",
    };

    const newState = authReducer(initialState, setUser(user));

    expect(newState).toEqual({
      ...initialState,
      user,
    });
  });

  it("should handle setAuthChecked", () => {
    const newState = authReducer(initialState, setAuthChecked(true));

    expect(newState).toEqual({
      ...initialState,
      isAuthChecked: true,
      loading: false,
    });
  });

  it("should handle resetAuthState", () => {
    const state = {
      user: { email: "test@example.com", name: "Test User" },
      isAuthChecked: false,
      accessToken: "some-token",
      loading: true,
      error: "Some error",
      loginAttempts: 3,
    };

    const newState = authReducer(state, resetAuthState());

    expect(newState).toEqual({
      user: null,
      isAuthChecked: true,
      accessToken: null,
      loading: false,
      error: null,
      loginAttempts: 3,
    });
  });

  it("should handle clearError", () => {
    const stateWithError = {
      ...initialState,
      error: "Some error",
    };

    const newState = authReducer(stateWithError, clearError());

    expect(newState).toEqual({
      ...initialState,
      error: null,
    });
  });

  it("should handle login.pending", () => {
    const action = { type: login.pending.type };
    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null,
    });
  });

  it("should handle login.fulfilled", () => {
    const response = {
      success: true,
      user: { email: "test@example.com", name: "Test User" },
      accessToken: "access-token",
      refreshToken: "refresh-token",
    };

    const action = {
      type: login.fulfilled.type,
      payload: response,
    };

    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      user: response.user,
      accessToken: response.accessToken,
      loading: false,
      error: null,
      isAuthChecked: true,
    });
  });

  it("should handle login.rejected", () => {
    const error = "Authentication failed";

    const action = {
      type: login.rejected.type,
      payload: error,
    };

    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error,
      loginAttempts: 1,
    });
  });

  it("should handle register.pending", () => {
    const action = { type: register.pending.type };
    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null,
    });
  });

  it("should handle register.fulfilled", () => {
    const response = {
      success: true,
      user: { email: "test@example.com", name: "Test User" },
      accessToken: "access-token",
      refreshToken: "refresh-token",
    };

    const action = {
      type: register.fulfilled.type,
      payload: response,
    };

    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      user: response.user,
      accessToken: response.accessToken,
      loading: false,
      error: null,
      isAuthChecked: true,
    });
  });

  it("should handle register.rejected", () => {
    const error = "Registration failed";

    const action = {
      type: register.rejected.type,
      payload: error,
    };

    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error,
    });
  });

  it("should handle getUser.pending", () => {
    const action = { type: getUser.pending.type };
    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null,
    });
  });

  it("should handle getUser.fulfilled", () => {
    const response = {
      success: true,
      user: { email: "test@example.com", name: "Test User" },
      accessToken: "access-token",
      refreshToken: "refresh-token",
    };

    const action = {
      type: getUser.fulfilled.type,
      payload: response,
    };

    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      user: response.user,
      loading: false,
      error: null,
    });
  });

  it("should handle getUser.rejected", () => {
    const error = "Failed to get user data";

    const action = {
      type: getUser.rejected.type,
      payload: error,
    };

    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error,
    });
  });

  it("should handle logout.pending", () => {
    const action = { type: logout.pending.type };
    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null,
    });
  });

  it("should handle logout.fulfilled", () => {
    const stateWithUser = {
      ...initialState,
      user: { email: "test@example.com", name: "Test User" },
      accessToken: "access-token",
    };

    const action = {
      type: logout.fulfilled.type,
      payload: { success: true },
    };

    const state = authReducer(stateWithUser, action);

    expect(state).toEqual({
      ...initialState,
      user: null,
      accessToken: null,
      loading: false,
      error: null,
    });
  });

  it("should handle logout.rejected", () => {
    const error = "Failed to logout";

    const action = {
      type: logout.rejected.type,
      payload: error,
    };

    const state = authReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error,
    });
  });
});
