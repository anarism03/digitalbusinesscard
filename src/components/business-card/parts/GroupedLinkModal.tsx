import { CloseOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useAssetSrc } from "../../../hooks/useAssetSrc";
import type { ViewLinkGroup, ViewLinkRow } from "../../../utils/cardLinkRows";
import { styles } from "../../../styles/business-card/BusinessCardPublicView.styles";
import {
  isExternalPublicLink,
  publicLinkHref,
} from "../../../utils/linkHelpers";

interface Props {
  group: ViewLinkGroup | null;
  onClose: () => void;
}

function isExternalLink(row: ViewLinkRow) {
  return isExternalPublicLink(row.href);
}

function GroupIcon({ row }: { row: ViewLinkRow }) {
  const isBuiltIn = row.iconSrc?.startsWith("/imgs/");
  const resolvedIconSrc = useAssetSrc(isBuiltIn ? undefined : row.iconSrc);
  const src = isBuiltIn ? row.iconSrc : resolvedIconSrc;

  if (src) {
    return <img src={src} alt="" style={styles.groupModalIcon} />;
  }
  return (
    <span style={{ ...styles.groupModalIconFallback, color: row.tint }}>
      {row.icon}
    </span>
  );
}

export function GroupedLinkModal({ group, onClose }: Props) {
  return (
    <Modal
      open={Boolean(group)}
      onCancel={onClose}
      footer={null}
      centered
      width={430}
      destroyOnHidden
      rootClassName="premium-group-modal"
      closeIcon={<CloseOutlined aria-label="Bağla" />}
      styles={{
        mask: styles.groupModalMask,
        content: styles.groupModalContent,
        body: styles.groupModalBody,
      }}
    >
      {group && (
        <div
          className="premium-group-modal-panel"
          aria-label={`${group.representative.label} seçimləri`}
        >
          <div style={styles.groupModalIconWrap}>
            <GroupIcon row={group.representative} />
          </div>

          <div style={styles.groupModalList}>
            {group.rows.map((row) => (
              <a
                key={row.id}
                className="premium-group-modal-row"
                href={publicLinkHref(row.href)}
                target={isExternalLink(row) ? "_blank" : undefined}
                rel={isExternalLink(row) ? "noreferrer" : undefined}
                style={styles.groupModalRow}
                onClick={(event) => {
                  if (!row.href) event.preventDefault();
                }}
              >
                <span style={styles.groupModalHeadline}>{row.label}:</span>
                <span style={styles.groupModalValue}>{row.value}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}
