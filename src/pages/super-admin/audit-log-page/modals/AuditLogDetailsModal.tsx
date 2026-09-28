import { Modal } from "antd";
import ChangeList from "../parts/ChangeList";
import { useFrameContainer } from "../../../../components/layout/FrameContainerContext";
import {
  resolveAction,
  resolveEntity,
  userLabel,
} from "../../../../utils/audit";
import { formatDateTime } from "../../../../utils/date";
import { styles } from "../../../../styles/super-admin/AuditLogDetailsModal.styles";
import type { AuditLogEntry } from "../../../../types";
import SwipeDownHandle from "../../../../components/shared/SwipeDownHandle";

interface AuditLogDetailsModalProps {
  log: AuditLogEntry | null;
  onClose: () => void;
}

function MetaItem({ label, value }: { label: string; value?: string }) {
  return (
    <div style={styles.metaItem}>
      <div style={styles.metaLabel}>{label}</div>
      <div style={styles.metaValue}>{value || "-"}</div>
    </div>
  );
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
      title={
        <SwipeDownHandle onClose={onClose} open={Boolean(log)}>
          Audit dəyişikliyi
        </SwipeDownHandle>
      }
      onCancel={onClose}
      maskClosable
      footer={null}
      width={900}
      centered
      getContainer={getContainer}
    >
      {log && (
        <div className="audit-detail-modal-body">
          <div className="audit-detail-meta-row" style={styles.metaRow}>
            <MetaItem label="Tarix" value={formatDateTime(log.createdAt)} />
            <MetaItem label="İstifadəçi" value={userLabel(log)} />
            <MetaItem
              label="Əməliyyat"
              value={resolveAction(log.action).label}
            />
            <MetaItem label="Obyekt" value={resolveEntity(log.entityType)} />
          </div>
          <ChangeList items={log.changes} expanded />
        </div>
      )}
    </Modal>
  );
}
