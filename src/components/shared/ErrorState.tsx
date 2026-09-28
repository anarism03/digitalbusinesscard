import { Button, Result } from "antd";
import { strings } from "../../constants/strings";

interface Props {
  onRetry: () => void;
}

export default function ErrorState({ onRetry }: Props) {
  return (
    <Result
      status="error"
      title={strings.errors.generic}
      extra={
        <Button type="primary" onClick={onRetry}>
          {strings.common.tryAgain}
        </Button>
      }
    />
  );
}
