import { lazy, Suspense, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import CompanyAdminLayout from "../components/layout/CompanyAdminLayout";
import PageLoader from "../components/shared/PageLoader";
import { fetchAccountInfo } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { routesByRole } from "./routes";
import NfcCardRedirect from "./NfcCardRedirect";
const CardPage = lazy(() => import("../pages/public/CardPage"));
const lazyEl = (element: ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

export default function PrivateRoutes() {
  const user = useAppSelector((s) => s.auth.user);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const syncedUserId = useRef<string | null>(null);
  const userId = user?.id;

  useEffect(() => {
    if (!userId || syncedUserId.current === userId) return;
    syncedUserId.current = userId;
    dispatch(fetchAccountInfo());
  }, [dispatch, userId]);

  if (!user) return null;

  const routes = routesByRole[user.role] ?? [];
  const home = routes[0]?.path ?? "/";
  const Layout =
    user.role === "COMPANY_ADMIN" || user.role === "EMPLOYEE"
      ? CompanyAdminLayout
      : AppLayout;
  const isFirstLoginLocked =
    user.role !== "SUPER_ADMIN" &&
    user.isFirstLogin === true &&
    location.pathname !== home &&
    !location.pathname.startsWith("/v/");
  const isPasswordExpiredLocked =
    user.role !== "SUPER_ADMIN" &&
    user.isFirstLogin !== true &&
    typeof user.daysUntilPasswordExpiry === "number" &&
    user.daysUntilPasswordExpiry <= 0 &&
    location.pathname !== home &&
    !location.pathname.startsWith("/v/");

  if (isFirstLoginLocked || isPasswordExpiredLocked) {
    return <Navigate to={home} replace />;
  }

  return (
    <Routes>
      <Route path="/v/:id/nfc" element={<NfcCardRedirect />} />
      <Route path="/v/:id" element={lazyEl(<CardPage />)} />
      {routes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<Layout>{lazyEl(element)}</Layout>}
        />
      ))}
      <Route path="*" element={<Navigate to={home} replace />} />
    </Routes>
  );
}
