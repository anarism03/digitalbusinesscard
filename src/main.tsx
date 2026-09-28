import ReactDOM from "react-dom/client";
import { App as AntApp, ConfigProvider } from "antd";
import azAZ from "antd/locale/az_AZ";
import { Provider } from "react-redux";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/az";
import App from "./App";
import ErrorBoundary from "./components/shared/ErrorBoundary";
import { APP_THEME } from "./constants/theme";
import { store } from "./store/store";
import "./index.css";

dayjs.extend(updateLocale);
dayjs.locale("az");
dayjs.updateLocale("az", {
  weekdaysMin: ["B", "B.e", "Ç.a", "Ç", "C.a", "C", "Ş"],
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ConfigProvider locale={azAZ} theme={APP_THEME}>
      <AntApp>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </AntApp>
    </ConfigProvider>
  </Provider>,
);
