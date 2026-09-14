import { useEffect, useState } from "react";
import { Modal, Input, Button, Skeleton, Space } from "antd";
import { CopyOutlined, IdcardOutlined } from "@ant-design/icons";
import { useFrameContainer } from "../../../../components/layout/FrameContainerContext";
import { useNfcLink } from "../../../../hooks/useEmployees";
import { strings } from "../../../../constants/strings";
import { copyToClipboard } from "../../../../utils/feedback";
import { styles } from "../../../../styles/company-admin/EmployeeForm.styles";
import type { Employee } from "../../../../types";

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
  if (loading) {
    return (
      <div style={styles.identifierRow}>
        <div style={styles.fieldLabel}>{label}</div>
        <Skeleton.Input active size="small" style={styles.fullWidth} />
      </div>
    );
  }

  return (
    <div style={styles.identifierRow}>
      <div style={styles.fieldLabel}>{label}</div>
      <Space.Compact style={styles.identifierInputGroup}>
        <Input value={value} readOnly aria-label={label} />
        <Button
          icon={<CopyOutlined />}
          onClick={() => copyToClipboard(value)}
          disabled={!value}
          aria-label={`${label} kopyala`}
        />
      </Space.Compact>
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
  const [nfcUrl, setNfcUrl] = useState<string>("");

  useEffect(() => {
    if (!employee) {
      setNfcUrl("");
      return;
    }
    let cancelled = false;
    setNfcUrl("");
    nfcLink
      .mutateAsync(employee.id)
      .then((url) => {
        if (!cancelled) setNfcUrl(url);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee]);

  const cardLink = employee
    ? `${window.location.origin}/v/${employee.id}`
    : "";

  return (
    <Modal
      open={Boolean(employee)}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnHidden
      getContainer={getContainer}
      title={
        <span style={styles.cardTitle}>
          <IdcardOutlined style={styles.resetIcon} />
          {s.identifiers}
        </span>
      }
    >
      {employee && (
        <>
          <IdentifierRow label={s.uidLabel} value={employee.id} />
          <IdentifierRow label={s.cardLinkLabel} value={cardLink} />
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
