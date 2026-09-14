import { Component, type ReactNode } from "react";
import { Button, Result } from "antd";
import { styles } from "../../styles/shared/BasicShared.styles";

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Render xətası:", error);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.errorBoundary}>
          <Result
            status="error"
            title="Nəsə yanlış getdi"
            subTitle="Səhifəni yeniləyin. Problem davam edərsə, dəstəklə əlaqə saxlayın."
            extra={
              <Button type="primary" onClick={this.handleReload}>
                Yenidən yüklə
              </Button>
            }
          />
        </div>
      );
    }
    return this.props.children;
  }
}
