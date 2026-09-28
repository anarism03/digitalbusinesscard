import { memo, useState } from "react";
import type { ReactNode } from "react";
import { Switch } from "antd";
import {
  EllipsisOutlined,
  EyeOutlined,
  EditOutlined,
  LockOutlined,
  ShareAltOutlined,
  IdcardOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import MobileBottomSheet from "../../../../components/shared/MobileBottomSheet";
import AssetAvatar from "../../../../components/shared/AssetAvatar";
import { strings } from "../../../../constants/strings";
import type { Employee } from "../../../../types";
import { styles } from "../../../../styles/company-admin/EmployeeListCard.styles";

const s = strings.employees;

function SheetAction({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="employee-action-item"
      style={styles.sheetAction}
      onClick={onClick}
    >
      <span style={styles.sheetActionIcon}>{icon}</span>
      <span style={styles.sheetActionLabel}>{label}</span>
    </button>
  );
}

interface Props {
  employee: Employee;
  isCurrentUser: boolean;
  onView: (row: Employee) => void;
  onEdit: (row: Employee) => void;
  onPreviewAvatar: (row: Employee) => void;
  onToggleActive: (row: Employee) => void;
  onResetPassword: (row: Employee) => void;
  onChangeOwnPassword: () => void;
  onShare: (row: Employee) => void;
  onShowIdentifiers: (row: Employee) => void;
  onDownloadVcf: (row: Employee) => void;
}

function EmployeeListCard({
  employee,
  isCurrentUser,
  onView,
  onEdit,
  onPreviewAvatar,
  onToggleActive,
  onResetPassword,
  onChangeOwnPassword,
  onShare,
  onShowIdentifiers,
  onDownloadVcf,
}: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const runAction = (fn: () => void) => {
    setSheetOpen(false);
    fn();
  };

  return (
    <div style={styles.card}>
      <button
        type="button"
        style={styles.avatarButton}
        aria-label={`${employee.fullName} foto`}
        onClick={() => onPreviewAvatar(employee)}
      >
        <AssetAvatar
          src={employee.photoUrl}
          name={employee.fullName}
          size={44}
          style={styles.avatar}
        />
      </button>

      <div style={styles.info} onClick={() => onView(employee)}>
        <div style={styles.nameRow}>
          <span style={styles.name}>{employee.fullName}</span>
          {isCurrentUser && <span style={styles.adminTag}>Admin</span>}
        </div>
        <div style={styles.jobTitle}>{employee.jobTitle}</div>
      </div>

      {!isCurrentUser && (
        <div
          style={styles.statusToggle}
          onClick={(event) => event.stopPropagation()}
        >
          <Switch
            checked={employee.isActive}
            aria-label={`${employee.fullName} statusu`}
            onChange={() => onToggleActive(employee)}
          />
        </div>
      )}

      <button
        type="button"
        style={styles.dotsButton}
        aria-label="Əməliyyatlar"
        onClick={() => setSheetOpen(true)}
      >
        <EllipsisOutlined />
      </button>

      <MobileBottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={employee.fullName}
      >
        <div className="employee-action-grid" style={styles.sheetActions}>
          <SheetAction
            icon={<EyeOutlined />}
            label={s.actions.viewCard}
            onClick={() => runAction(() => onView(employee))}
          />

          <SheetAction
            icon={<EditOutlined />}
            label={s.actions.edit}
            onClick={() => runAction(() => onEdit(employee))}
          />

          <SheetAction
            icon={<ShareAltOutlined />}
            label="Paylaşmaq"
            onClick={() => runAction(() => onShare(employee))}
          />

          <SheetAction
            icon={<IdcardOutlined />}
            label="Kontaktı yüklə"
            onClick={() => runAction(() => onDownloadVcf(employee))}
          />

          <SheetAction
            icon={<TagsOutlined />}
            label={s.identifiers}
            onClick={() => runAction(() => onShowIdentifiers(employee))}
          />

          {isCurrentUser ? (
            <SheetAction
              icon={<LockOutlined />}
              label="Şifrəni dəyiş"
              onClick={() => runAction(onChangeOwnPassword)}
            />
          ) : (
            <SheetAction
              icon={<LockOutlined />}
              label="Şifrəni sıfırla"
              onClick={() => runAction(() => onResetPassword(employee))}
            />
          )}
        </div>
      </MobileBottomSheet>
    </div>
  );
}

export default memo(EmployeeListCard);
