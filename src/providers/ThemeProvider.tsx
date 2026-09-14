import { ConfigProvider } from "antd";
import azAZ from "antd/locale/az_AZ";
import { useAppTheme } from "./useAppTheme";
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppTheme();
  return (
    <ConfigProvider locale={azAZ} theme={theme}>
      {children}
    </ConfigProvider>
  );
}
