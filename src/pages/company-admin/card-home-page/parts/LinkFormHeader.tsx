import type { ReactNode } from "react";
import { styles } from "../../../../styles/company-admin/LinkFormHeader.styles";

interface Props {
  title: string;
  iconSrc?: string;
  iconAlt?: string;
  fallbackIcon: ReactNode;
}

export default function LinkFormHeader({
  title,
  iconSrc,
  iconAlt = "",
  fallbackIcon,
}: Props) {
  return (
    <div style={styles.header}>
      <span style={styles.icon}>
        {iconSrc ? (
          <img src={iconSrc} alt={iconAlt} style={styles.iconImage} />
        ) : (
          fallbackIcon
        )}
      </span>
      <strong style={styles.title}>{title}</strong>
    </div>
  );
}
