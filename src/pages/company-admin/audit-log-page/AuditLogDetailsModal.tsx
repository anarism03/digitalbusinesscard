import { Modal } from "antd";
import { useFrameContainer } from "../../../components/layout/FrameContainerContext";
import { styles } from "../../../styles/company-admin/AuditLogPage.styles";
import type { AuditLogEntry } from "../../../types";
import { resolveAction, resolveEntity } from "../../../utils/audit";
import { formatDateTime } from "../../../utils/date";
import { ChangeList, MetaItem, userLabel } from "./AuditLogHelpers";

interface AuditLogDetailsModalProps {
  log: AuditLogEntry | null;
  onClose: () => void;
}

export default function AuditLogDetailsModal({
  log,
  onClose,
}: AuditLogDetailsModalProps) {
  const getContainer = useFrameContainer();

  return (
    <Modal
      rootClassName="cadmin-bottom-modal"
      open={Boolean(log)}
      title="Audit dəyişikliyi"
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      getContainer={getContainer}
    >
      {log && (
        <div className="audit-detail-modal-body">
          <div className="audit-detail-meta-row" style={styles.detailMetaRow}>
            <MetaItem label="Tarix" value={formatDateTime(log.createdAt)} />
            <MetaItem label="İstifadəçi" value={userLabel(log)} />
            <MetaItem label="Əməliyyat" value={resolveAction(log.action).label} />
            <MetaItem label="Obyekt" value={resolveEntity(log.entityType)} />
          </div>
          <ChangeList items={log.changes} expanded />
        </div>
      )}
    </Modal>
  );
}
