import { memo } from "react";
import type { ReactNode } from "react";
import { MoreOutlined, RightOutlined } from "@ant-design/icons";
import { Switch } from "antd";
import { useAssetSrc } from "../../../hooks/useAssetSrc";
import { styles } from "../../../styles/company-admin/CardLinkRow.styles";

const DEFAULT_TINT = "#1e63d6";

interface ViewRowProps {
  mode: "view";
  icon: ReactNode;
  iconSrc?: string;
  label: string;
  href: string;
  tint?: string;
}

interface EditRowProps {
  mode: "edit";
  icon: ReactNode;
  iconSrc?: string;
  label: string;
  value?: string;
  onClick?: () => void;
  enabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  tint?: string;
}

type Props = ViewRowProps | EditRowProps;

function IconBadge({
  icon,
  iconSrc,
  tint,
}: {
  icon: ReactNode;
  iconSrc?: string;
  tint: string;
}) {
  const isBuiltIn = iconSrc?.startsWith("/imgs/");
  const resolvedIconSrc = useAssetSrc(isBuiltIn ? undefined : iconSrc);
  const src = isBuiltIn ? iconSrc : resolvedIconSrc;

  if (src) {
    return (
      <span className="card-link-row-icon-badge" style={styles.iconBadgeImage}>
        <img
          className="card-link-row-icon"
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          style={styles.iconBadgeImg}
        />
      </span>
    );
  }

  return (
    <span
      className="card-link-row-icon-badge"
      style={{
        ...styles.iconBadge,
        background: `${tint}1a`,
        color: tint,
      }}
    >
      {icon}
    </span>
  );
}

function CardLinkRow(props: Props) {
  const tint = props.tint ?? DEFAULT_TINT;

  if (props.mode === "view") {
    return (
      <a
        href={props.href}
        target={props.href.startsWith("http") ? "_blank" : undefined}
        rel={props.href.startsWith("http") ? "noreferrer" : undefined}
        className="card-link-row"
        style={styles.row}
      >
        <IconBadge icon={props.icon} iconSrc={props.iconSrc} tint={tint} />
        <span style={styles.body}>
          <span style={styles.label}>{props.label}</span>
        </span>
        <RightOutlined className="card-link-row-arrow" style={styles.arrow} />
      </a>
    );
  }

  return (
    <div
      className={`card-link-row-edit ${props.enabled === false ? "card-link-row-edit--disabled" : ""}`}
      style={styles.row}
    >
      <button
        type="button"
        aria-label="Redaktə et"
        className="card-link-row-handle"
        style={styles.handle}
        onClick={(event) => {
          event.stopPropagation();
          props.onClick?.();
        }}
      >
        <MoreOutlined />
      </button>

      <button
        type="button"
        className="card-link-row-edit-content"
        style={{
          ...styles.row,
          ...styles.editContent,
        }}
        onClick={props.onClick}
      >
        <IconBadge icon={props.icon} iconSrc={props.iconSrc} tint={tint} />
        <span className="card-link-row-body" style={styles.body}>
          <span className="card-link-row-label" style={styles.label}>
            {props.label}
          </span>
          {props.value && (
            <span className="card-link-row-value" style={styles.value}>
              {props.value}
            </span>
          )}
        </span>
      </button>

      {props.onEnabledChange && (
        <span
          className="card-link-row-toggle"
          style={styles.toggleWrap}
          onClick={(event) => event.stopPropagation()}
        >
          <Switch
            checked={props.enabled ?? true}
            onChange={props.onEnabledChange}
            aria-label={`${props.label} aktivliyi`}
            style={{
              background: props.enabled ? "#52c41a" : undefined,
            }}
          />
        </span>
      )}
    </div>
  );
}

export default memo(CardLinkRow);
