import { Button, Result } from "antd";
import { strings } from "../../constants/strings";

interface Props {
  onRetry?: () => void;
  message?: string;
}

export default function ErrorState({ onRetry, message }: Props) {
  return (
    <Result
      status="error"
      title={strings.errors.generic}
      subTitle={message}
      extra={
        onRetry && (
          <Button type="primary" onClick={onRetry}>
            {strings.common.tryAgain}
          </Button>
        )
      }
    />
  );
}
