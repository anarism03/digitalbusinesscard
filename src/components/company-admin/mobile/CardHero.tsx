import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import {
  getHeroStyle,
  styles,
} from "../../../styles/company-admin/CardHero.styles";

interface Props {
  name: string;
  avatarSrc?: string;
  backgroundSrc?: string;
  onEditAvatar?: () => void;
  onEditBackground?: () => void;
  onRemoveAvatar?: () => void;
  onRemoveBackground?: () => void;
}

export default function CardHero({
  name,
  avatarSrc,
  backgroundSrc,
  onEditAvatar,
  onEditBackground,
  onRemoveAvatar,
  onRemoveBackground,
}: Props) {
  return (
    <div className="premium-card-hero-editor" style={styles.wrap}>
      <div className="card-hero-cover" style={getHeroStyle(backgroundSrc)}>
        {backgroundSrc && (
          <img
            src={backgroundSrc}
            alt=""
            aria-hidden="true"
            decoding="async"
            style={styles.backgroundMedia}
          />
        )}
        {onRemoveBackground && backgroundSrc && (
          <button
            type="button"
            className="card-hero-control card-hero-control--remove"
            aria-label="Arxa fonu sil"
            style={styles.bgRemoveButton}
            onClick={onRemoveBackground}
          >
            <CloseOutlined />
          </button>
        )}
        {onEditBackground && (
          <button
            type="button"
            className="card-hero-control card-hero-control--edit"
            aria-label="Arxa fonu redaktə et"
            style={styles.bgEditButton}
            onClick={onEditBackground}
          >
            <EditOutlined />
          </button>
        )}
      </div>

      <div className="premium-card-avatar-wrap" style={styles.avatarWrap}>
        <div className="premium-card-avatar" style={styles.avatarRing}>
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={name}
              loading="lazy"
              decoding="async"
              style={styles.avatarImg}
            />
          ) : (
            <span style={styles.avatarFallback}>
              {name?.[0]?.toUpperCase() ?? "?"}
            </span>
          )}
        </div>
        {onRemoveAvatar && avatarSrc && (
          <button
            type="button"
            className="card-hero-control card-avatar-control card-avatar-control--remove"
            aria-label="Foto sil"
            style={styles.avatarRemoveButton}
            onClick={onRemoveAvatar}
          >
            <CloseOutlined />
          </button>
        )}
        {onEditAvatar && (
          <button
            type="button"
            className="card-hero-control card-avatar-control card-avatar-control--edit"
            aria-label="Foto redaktə et"
            style={styles.avatarEditButton}
            onClick={onEditAvatar}
          >
            <EditOutlined />
          </button>
        )}
      </div>
    </div>
  );
}
