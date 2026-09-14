import { BrowserRouter } from "react-router-dom";
import { App as AntApp } from "antd";
import PrivateRoutes from "./routes/PrivateRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import { useAppSelector } from "./store/hooks";
import { bindMessageApi } from "./utils/feedback";

function FeedbackBinder() {
  const { message } = AntApp.useApp();
  bindMessageApi(message);
  return null;
}

export default function App() {
  const { user, token } = useAppSelector((state) => state.auth);
  const hasSession = Boolean(user && token);

  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <FeedbackBinder />
      {hasSession ? <PrivateRoutes /> : <PublicRoutes />}
    </BrowserRouter>
  );
}
