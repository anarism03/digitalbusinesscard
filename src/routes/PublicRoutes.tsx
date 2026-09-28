import { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PageLoader from "../components/shared/PageLoader";
import NfcCardRedirect from "./NfcCardRedirect";

const LoginPage = lazy(() => import("../pages/login/LoginPage"));
const CardPage = lazy(() => import("../pages/public/CardPage"));

const lazyEl = (element: ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/login" element={lazyEl(<LoginPage />)} />
      <Route path="/v/:id/nfc" element={<NfcCardRedirect />} />
      <Route path="/v/:id" element={lazyEl(<CardPage />)} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
