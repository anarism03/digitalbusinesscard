import { useEffect, useState } from "react";
import { Form, InputNumber, Modal } from "antd";
import type { Company } from "../../../types";
import { isAllowedNumberKey } from "../../../utils/text";
import { styles } from "../../../styles/super-admin/CompanyLimitModal.styles";

const LIMIT_MAX = 100;

interface CompanyLimitModalProps {
  open: boolean;
  company: Company | null;
  value: number;
  loading?: boolean;
  onChange: (value: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CompanyLimitModal({
  open,
  company,
  value,
  loading = false,
  onChange,
  onConfirm,
  onCancel,
}: CompanyLimitModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const isInvalid = value < 1 || value > LIMIT_MAX;

  useEffect(() => {
    if (open) setSubmitted(false);
  }, [open, value]);

  const handleConfirm = () => {
    setSubmitted(true);
    if (isInvalid) return;
    onConfirm();
  };

  return (
    <Modal
      open={open}
      title={`${company?.name} - İstifadəçi limiti`}
      onOk={handleConfirm}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Yadda saxla"
      cancelText="Ləğv et"
      centered
    >
      <Form layout="vertical" style={styles.form}>
        <Form.Item
          label="Yeni limit"
          validateStatus={submitted && isInvalid ? "error" : undefined}
        >
          <InputNumber
            value={value}
            onChange={(nextValue) => onChange(nextValue ?? 0)}
            min={1}
            precision={0}
            inputMode="numeric"
            onKeyDown={(event) => {
              if (!isAllowedNumberKey(event.key)) event.preventDefault();
            }}
            style={styles.input}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
