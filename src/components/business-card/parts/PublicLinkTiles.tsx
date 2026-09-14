import { RightOutlined } from "@ant-design/icons";
import { useAssetSrc } from "../../../hooks/useAssetSrc";
import type { ViewLinkRow } from "../../../utils/cardLinkRows";
import {
  isExternalPublicLink,
  publicLinkHref,
} from "../../../utils/linkHelpers";
import { getIconTileStyle, styles } from "../../../styles/business-card/BusinessCardPublicView.styles";
import type { PublicLinkProps } from "../../../types";

function LinkIcon({ row }: { row: ViewLinkRow }) {
  const isBuiltIn = row.iconSrc?.startsWith("/imgs/");
  const resolvedIconSrc = useAssetSrc(isBuiltIn ? undefined : row.iconSrc);
  const src = isBuiltIn ? row.iconSrc : resolvedIconSrc;

  if (src) {
    return <img src={src} alt="" style={styles.linkIconImage} />;
  }
  return (
    <span style={{ ...styles.linkIconFallback, color: row.tint }}>
      {row.icon}
    </span>
  );
}

export function IconTile({ group, onOpen }: PublicLinkProps) {
  const row = group.representative;
  if (group.rows.length > 1) {
    return (
      <button
        type="button"
        aria-label={`${row.label} seçimlərini aç`}
        className="public-card-link"
        style={{ ...getIconTileStyle(row.tint), ...styles.groupTrigger }}
        onClick={() => onOpen(group)}
      >
        <LinkIcon row={row} />
      </button>
    );
  }

  return (
    <a
      href={publicLinkHref(row.href)}
      target={isExternalPublicLink(row.href) ? "_blank" : undefined}
      rel={isExternalPublicLink(row.href) ? "noreferrer" : undefined}
      aria-label={row.label}
      className="public-card-link"
      style={getIconTileStyle(row.tint)}
    >
      <LinkIcon row={row} />
    </a>
  );
}

export function LinkCard({ group, onOpen }: PublicLinkProps) {
  const row = group.representative;
  if (group.rows.length > 1) {
    return (
      <button
        type="button"
        className="public-card-link"
        style={{ ...styles.linkCard, ...styles.groupTrigger }}
        onClick={() => onOpen(group)}
      >
        <span className="public-card-link-icon" style={styles.linkCardIcon}>
          <LinkIcon row={row} />
        </span>
        <span style={styles.linkCardLabel}>{row.label}</span>
        <RightOutlined className="public-card-link-arrow" style={styles.linkCardArrow} />
      </button>
    );
  }

  return (
    <a
      href={publicLinkHref(row.href)}
      target={isExternalPublicLink(row.href) ? "_blank" : undefined}
      rel={isExternalPublicLink(row.href) ? "noreferrer" : undefined}
      className="public-card-link"
      style={styles.linkCard}
    >
      <span className="public-card-link-icon" style={styles.linkCardIcon}>
        <LinkIcon row={row} />
      </span>
      <span style={styles.linkCardLabel}>{row.label}</span>
      <RightOutlined className="public-card-link-arrow" style={styles.linkCardArrow} />
    </a>
  );
}

export function ContactTile({ group, onOpen }: PublicLinkProps) {
  const row = group.representative;
  if (group.rows.length > 1) {
    return (
      <button
        type="button"
        aria-label={`${row.label} seçimlərini aç`}
        className="public-card-link"
        style={{ ...styles.contactTile, ...styles.groupTrigger }}
        onClick={() => onOpen(group)}
      >
        <span className="public-card-link-icon" style={styles.contactTileIcon}>
          <LinkIcon row={row} />
        </span>
      </button>
    );
  }

  return (
    <a
      href={publicLinkHref(row.href)}
      target={isExternalPublicLink(row.href) ? "_blank" : undefined}
      rel={isExternalPublicLink(row.href) ? "noreferrer" : undefined}
      aria-label={row.label}
      className="public-card-link"
      style={styles.contactTile}
    >
      <span className="public-card-link-icon" style={styles.contactTileIcon}>
        <LinkIcon row={row} />
      </span>
    </a>
  );
}
