import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import uiReducer from "./uiSlice";
import { injectStore } from "../services/axios/storeAccessor";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
});

injectStore(store);

function persistAuthState() {
  const { user, token } = store.getState().auth;
  localStorage.setItem("dbc-auth", JSON.stringify({ user, token }));
}

persistAuthState();
store.subscribe(persistAuthState);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
