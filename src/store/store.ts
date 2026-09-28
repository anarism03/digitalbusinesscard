import { configureStore } from "@reduxjs/toolkit";
import authReducer, { AUTH_STORAGE_KEY } from "./authSlice";
import uiReducer from "./uiSlice";
import { injectStore } from "../services/axios/storeAccessor";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

injectStore(store);

let previousAuth = store.getState().auth;
store.subscribe(() => {
  const auth = store.getState().auth;
  if (auth === previousAuth) return;
  previousAuth = auth;
  try {
    if (auth.token)
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
    else localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {}
});
