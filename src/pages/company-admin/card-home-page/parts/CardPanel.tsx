import { useState } from "react";
import { EyeOutlined } from "@ant-design/icons";
import BusinessCardPublicView from "../../../../components/business-card/BusinessCardPublicView";
import ChangePasswordModal from "../../../../components/auth/ChangePasswordModal";
import ErrorState from "../../../../components/shared/ErrorState";
import CardEditPanel from "./CardEditPanel";
import CardSkeleton from "./CardSkeleton";
import { useEmployee } from "../../../../hooks/useEmployees";
import { useAppSelector } from "../../../../store/hooks";
import { styles } from "../../../../styles/company-admin/CardPanel.styles";

interface Props {
  employeeId: string;
  isOwnCard: boolean;
  editMode: boolean;
  onEditModeChange: (editing: boolean) => void;
  onBack?: () => void;
  hideOwnPasswordButton: boolean;
}

export default function CardPanel({
  employeeId,
  isOwnCard,
  editMode,
  onEditModeChange,
  onBack,
  hideOwnPasswordButton,
}: Props) {
  const {
    data: employee,
    isLoading,
    isError,
    refetch,
  } = useEmployee(employeeId);
  const role = useAppSelector((state) => state.auth.user?.role);
  const [passwordOpen, setPasswordOpen] = useState(false);

  if (isLoading) return <CardSkeleton />;
  if (isError || !employee) return <ErrorState onRetry={() => refetch()} />;

  const canEdit = role !== "EMPLOYEE" || employee.canEdit === true;

  if (editMode && canEdit) {
    return (
      <div style={styles.editWrap}>
        <button
          type="button"
          className="premium-mode-toggle"
          style={styles.previewToggle}
          onClick={() => onEditModeChange(false)}
        >
          <EyeOutlined />
          Profilə bax
        </button>

        <CardEditPanel
          key={employee.id}
          employee={employee}
          isOwnCard={isOwnCard}
          onCancel={() => onEditModeChange(false)}
          onSaved={() => onEditModeChange(false)}
        />
      </div>
    );
  }

  const showPasswordButton = isOwnCard && !hideOwnPasswordButton;

  return (
    <div style={styles.wrap}>
      <BusinessCardPublicView
        employee={employee}
        onEdit={canEdit ? () => onEditModeChange(true) : undefined}
        onBack={onBack}
        onChangePassword={
          showPasswordButton ? () => setPasswordOpen(true) : undefined
        }
      />

      {showPasswordButton && (
        <ChangePasswordModal
          open={passwordOpen}
          onClose={() => setPasswordOpen(false)}
        />
      )}
    </div>
  );
}
