import { Button } from "antd";
import ConfirmDeleteButton from "../../../../components/shared/ConfirmDeleteButton";
import { styles } from "../../../../styles/company-admin/SheetActions.styles";

interface Props {
  cancelText: string;
  onCancel: () => void;
  onDelete?: () => void;
  deleteResetKey: string;
  onSave: () => void;
  saveDisabled?: boolean;
  saveLoading?: boolean;
  divided?: boolean;
}

export default function SheetActions({
  cancelText,
  onCancel,
  onDelete,
  deleteResetKey,
  onSave,
  saveDisabled,
  saveLoading,
  divided = false,
}: Props) {
  return (
    <div
      style={
        divided ? { ...styles.actions, ...styles.divided } : styles.actions
      }
    >
      {onDelete ? (
        <ConfirmDeleteButton
          onConfirm={onDelete}
          resetKey={deleteResetKey}
          style={styles.secondaryButton}
        />
      ) : (
        <Button onClick={onCancel} style={styles.secondaryButton}>
          {cancelText}
        </Button>
      )}
      <Button
        type="primary"
        style={styles.primaryButton}
        disabled={saveDisabled}
        loading={saveLoading}
        onClick={onSave}
      >
        Yadda saxla
      </Button>
    </div>
  );
}
