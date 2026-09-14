import { Avatar } from "antd";
import type { AvatarProps } from "antd";
import type { CSSProperties, ReactNode } from "react";
import { UserOutlined } from "@ant-design/icons";
import { useAssetSrc } from "../../hooks/useAssetSrc";
import { getAssetImageStyle } from "../../styles/shared/AssetAvatar.styles";

interface AssetAvatarProps
  extends Omit<AvatarProps, "src" | "icon" | "children"> {
  src?: string | null;
  name?: string;
  icon?: ReactNode;
  children?: ReactNode;
  imageStyle?: CSSProperties;
}
export default function AssetAvatar({
  src,
  name,
  icon,
  children,
  imageStyle,
  ...avatarProps
}: AssetAvatarProps) {
  const currentSrc = useAssetSrc(src);

  const fallbackIcon = icon ?? <UserOutlined />;
  const fallbackText = children ?? name?.trim()?.[0]?.toUpperCase();

  return (
    <Avatar
      {...avatarProps}
      src={
        currentSrc ? (
          <img
            src={currentSrc}
            alt={name || ""}
            loading="lazy"
            decoding="async"
            style={getAssetImageStyle(imageStyle)}
          />
        ) : undefined
      }
      icon={!currentSrc && !fallbackText ? fallbackIcon : undefined}
    >
      {!currentSrc ? fallbackText : undefined}
    </Avatar>
  );
}
