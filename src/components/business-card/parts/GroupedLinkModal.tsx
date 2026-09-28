import { CloseOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useIconSrc } from "../../../hooks/useAssetSrc";
import { publicLinkHref } from "../../../utils/url";
import { styles } from "../../../styles/business-card/GroupedLinkModal.styles";
import type { ViewLinkGroup, ViewLinkRow } from "../../../types";

interface Props {
  group: ViewLinkGroup | null;
  onClose: () => void;
}

function GroupIcon({ row }: { row: ViewLinkRow }) {
  const src = useIconSrc(row.iconSrc);

  if (src) {
    return <img src={src} alt="" style={styles.icon} />;
  }
  return (
    <span style={{ ...styles.iconFallback, color: row.tint }}>{row.icon}</span>
  );
}

export default function GroupedLinkModal({ group, onClose }: Props) {
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
        mask: styles.mask,
        content: styles.content,
        body: styles.body,
      }}
    >
      {group && (
        <div
          className="premium-group-modal-panel"
          aria-label={`${group.representative.label} seçimləri`}
        >
          <div style={styles.iconWrap}>
            <GroupIcon row={group.representative} />
          </div>

          <div style={styles.list}>
            {group.rows.map((row) => {
              const href = publicLinkHref(row.href);
              const isExternal = /^https?:\/\//i.test(href);
              return (
                <a
                  key={row.id}
                  className="premium-group-modal-row"
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  style={styles.row}
                  onClick={(event) => {
                    if (!row.href) event.preventDefault();
                  }}
                >
                  <span style={styles.headline}>{row.label}:</span>
                  <span style={styles.value}>{row.value}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </Modal>
  );
}
