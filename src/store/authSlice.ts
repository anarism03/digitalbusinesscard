import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import {
  buildFullName,
  pickFirstLogin,
  pickPasswordExpiryDays,
  toBoolean,
} from "../utils/normalize";
import { pickPhotoUrl } from "../utils/mappers";
import { authService } from "../services/auth.service";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
}

const STORAGE_KEY = "dbc-auth";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value ? value : undefined;
}

function loadInitial(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = asRecord(JSON.parse(raw));
      return {
        user: (p.user as User | undefined) ?? null,
        token: optionalString(p.token) ?? null,
      };
    }
  } catch {}
  return {
    user: null,
    token: null,
  };
}

export const fetchAccountInfo = createAsyncThunk(
  "auth/fetchAccountInfo",
  async (_, { getState }) => {
    const { auth } = getState() as { auth: AuthState };
    if (!auth.token || !auth.user) return null;
    try {
      return await authService.getAccountInfo();
    } catch {
      return null;
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitial(),
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountInfo.fulfilled, (state, action) => {
        if (!action.payload || !state.user) return;
        const root = asRecord(action.payload);
        const raw = asRecord(root.data ?? root.user ?? root.account ?? root);
        const fullName = buildFullName(
          optionalString(raw.firstName),
          optionalString(raw.lastName),
          optionalString(raw.middleName),
          optionalString(raw.fullName) ?? "",
        );
        const rawCanEdit = raw.canEdit ?? raw.canEditProfile ?? raw.isEdit;
        state.user = {
          ...state.user,
          firstName: optionalString(raw.firstName) ?? state.user.firstName,
          lastName: optionalString(raw.lastName) ?? state.user.lastName,
          fullName: fullName || state.user.fullName,
          companyId: optionalString(raw.companyId) ?? state.user.companyId,
          photoUrl: pickPhotoUrl(raw) ?? state.user.photoUrl,
          canEdit:
            rawCanEdit != null
              ? toBoolean(rawCanEdit, false)
              : state.user.canEdit,
          isFirstLogin:
            state.user.isFirstLogin === false
              ? false
              : (pickFirstLogin(raw) ?? state.user.isFirstLogin),
          daysUntilPasswordExpiry:
            pickPasswordExpiryDays(raw) ?? state.user.daysUntilPasswordExpiry,
        };
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
