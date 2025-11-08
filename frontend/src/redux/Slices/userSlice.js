import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  tokenExpiry: null,
  role: null,
  profile: null,
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      try {
        console.log(
          "[userSlice] fetchUserProfile started, token present:",
          !!token
        );
      } catch (e) {}
      if (!token) return rejectWithValue({ message: "No token" });
  const res = await fetch(`${process.env.REACT_APP_API_URL}/user/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => null);
        try {
          console.log(
            "[userSlice] fetchUserProfile response not ok",
            res.status,
            text || res.statusText
          );
        } catch (e) {}
        return rejectWithValue({
          status: res.status,
          message: text || res.statusText,
        });
      }
      const data = await res.json();
      return { data, token };
    } catch (err) {
      return rejectWithValue({ message: err.message || "Network error" });
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      const payload = action.payload || {};
      if (payload.token !== undefined) state.token = payload.token;
      if (payload.tokenExpiry !== undefined)
        state.tokenExpiry = payload.tokenExpiry;
      if (payload.role !== undefined) state.role = payload.role;
      if (payload.profile !== undefined) state.profile = payload.profile;
      state.loading = false;
      state.error = null;
    },
    clearUser(state) {
      state.token = null;
      state.tokenExpiry = null;
      state.role = null;
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
    setLoading(state, action) {
      state.loading = !!action.payload;
    },
    setError(state, action) {
      state.error = action.payload || null;
      state.loading = false;
    },
    updateProfile(state, action) {
      state.profile = { ...(state.profile || {}), ...(action.payload || {}) };
      if (state.profile && state.profile.role) state.role = state.profile.role;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        try {
          console.log("[userSlice] fetchUserProfile.pending");
        } catch (e) {}
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        const payload = action.payload || {};
        state.loading = false;
        state.error = null;
        state.token = payload.token || state.token;
        state.profile = payload.data || state.profile;
        if (payload.data && payload.data.role) state.role = payload.data.role;
         try {
         
        } catch (e) {}
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error || { message: "Failed" };
        try {
          console.log(
            "[userSlice] fetchUserProfile.rejected",
            action.payload || action.error
          );
        } catch (e) {}
        // clear token/profile on auth failures
        if (
          action.payload &&
          (action.payload.status === 401 || action.payload.status === 403)
        ) {
          state.token = null;
          state.profile = null;
          state.role = null;
          try {
            localStorage.removeItem("token");
            localStorage.removeItem("tokenExpiry");
            localStorage.removeItem("user");
          } catch (e) {}
        }
      });
  },
});

export const { setUser, clearUser, setLoading, setError, updateProfile } =
  userSlice.actions;
export default userSlice.reducer;
