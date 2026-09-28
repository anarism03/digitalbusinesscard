import { useEffect, useState } from "react";
import { Modal, Input, Button, Skeleton, Space } from "antd";
import { CopyOutlined, IdcardOutlined } from "@ant-design/icons";
import { useFrameContainer } from "../../../../components/layout/FrameContainerContext";
import { useNfcLink } from "../../../../hooks/useEmployees";
import { strings } from "../../../../constants/strings";
import { copyToClipboard } from "../../../../utils/feedback";
import { styles } from "../../../../styles/company-admin/EmployeeIdentifiersModal.styles";
import type { Employee } from "../../../../types";
import SwipeDownHandle from "../../../../components/shared/SwipeDownHandle";

const s = strings.employees;

function IdentifierRow({
  label,
  value,
  loading,
}: {
  label: string;
  value: string;
  loading?: boolean;
}) {
  return (
    <div style={styles.row}>
      <div style={styles.label}>{label}</div>
      {loading ? (
        <Skeleton.Input active size="small" style={styles.skeleton} />
      ) : (
        <Space.Compact style={styles.inputGroup}>
          <Input value={value} readOnly aria-label={label} />
          <Button
            icon={<CopyOutlined />}
            onClick={() => copyToClipboard(value)}
            disabled={!value}
            aria-label={`${label} kopyala`}
          />
        </Space.Compact>
      )}
    </div>
  );
}

interface Props {
  employee: Employee | null;
  onClose: () => void;
}

export default function EmployeeIdentifiersModal({ employee, onClose }: Props) {
  const getContainer = useFrameContainer();
  const nfcLink = useNfcLink();
  const { mutateAsync: fetchNfcLink } = nfcLink;
  const [nfcUrl, setNfcUrl] = useState("");

  useEffect(() => {
    setNfcUrl("");
    if (!employee) return;

    let cancelled = false;
    fetchNfcLink(employee.id)
      .then((url) => {
        if (!cancelled) setNfcUrl(url);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [employee, fetchNfcLink]);

  return (
    <Modal
      open={Boolean(employee)}
      onCancel={onClose}
      maskClosable
      footer={null}
      centered
      destroyOnHidden
      getContainer={getContainer}
      title={
        <SwipeDownHandle
          onClose={onClose}
          open={Boolean(employee)}
          enabled={Boolean(getContainer)}
        >
          <span style={styles.title}>
            <IdcardOutlined style={styles.titleIcon} />
            {s.identifiers}
          </span>
        </SwipeDownHandle>
      }
    >
      {employee && (
        <>
          <IdentifierRow label={s.uidLabel} value={employee.id} />
          <IdentifierRow
            label={s.cardLinkLabel}
            value={`${window.location.origin}/v/${employee.id}`}
          />
          <IdentifierRow
            label={s.nfcLabel}
            value={nfcUrl}
            loading={!nfcUrl && nfcLink.isPending}
          />
        </>
      )}
    </Modal>
  );
}
