import { BrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { App as AntApp } from "antd";
import PublicRoutes from "./routes/PublicRoutes";
import PageLoader from "./components/shared/PageLoader";
import { useAppSelector } from "./store/hooks";
import { bindMessageApi } from "./utils/feedback";

const PrivateRoutes = lazy(() => import("./routes/PrivateRoutes"));

function FeedbackBinder() {
  const { message } = AntApp.useApp();
  bindMessageApi(message);
  return null;
}

export default function App() {
  const { user, token } = useAppSelector((state) => state.auth);
  const hasSession = Boolean(user && token);

  return (
    <BrowserRouter>
      <FeedbackBinder />
      <Suspense fallback={<PageLoader />}>
        {hasSession ? <PrivateRoutes /> : <PublicRoutes />}
      </Suspense>
    </BrowserRouter>
  );
}
