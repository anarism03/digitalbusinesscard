import { useState } from "react";
import { Input } from "antd";
import MobileBottomSheet from "../../../components/company-admin/mobile/MobileBottomSheet";
import type { LinkType } from "../../../types";
import {
  FEATURED_TYPES,
  LINK_CATEGORY_LABELS,
  LINK_CATEGORY_ORDER,
  LINK_TYPE_META,
} from "../../../constants/linkTypes";
import { tintFor } from "../../../utils/cardLinkRows";
import {
  styles,
  getGridIconBadgeStyle,
  gridIconImgStyle,
  LINK_GRID_HOVER_CSS,
} from "../../../styles/employee/LinkFlow.styles";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (type: LinkType) => void;
}

export default function LinkTypePicker({ open, onClose, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const entries = (Object.keys(LINK_TYPE_META) as LinkType[])
    .map((type) => ({ type, ...LINK_TYPE_META[type] }))
    .filter((entry) => entry.title.toLowerCase().includes(q));

  const featured = entries.filter((entry) => FEATURED_TYPES.includes(entry.type));

  const renderItem = (entry: (typeof entries)[number]) => (
    <button
      key={entry.type}
      type="button"
      className="card-link-grid-item"
      style={styles.gridItem}
      onClick={() => onSelect(entry.type)}
    >
      <span
        className="card-link-icon-badge"
        style={getGridIconBadgeStyle(Boolean(entry.iconSrc), tintFor(entry.type))}
      >
        {entry.iconSrc ? (
          <img src={entry.iconSrc} alt="" style={gridIconImgStyle} />
        ) : (
          entry.icon
        )}
      </span>
      {entry.title}
    </button>
  );

  return (
    <MobileBottomSheet
      open={open}
      onClose={onClose}
      title="Keçid növünü seçin"
      heightMode="large"
    >
      <style>{LINK_GRID_HOVER_CSS}</style>

      <Input
        placeholder="Axtarış..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        style={styles.search}
        allowClear
      />

      {featured.length > 0 && (
        <div>
          <div style={styles.sectionTitle}>Seçilmiş</div>
          <div style={styles.grid}>{featured.map(renderItem)}</div>
        </div>
      )}

      {LINK_CATEGORY_ORDER.map((category) => {
        const items = entries.filter(
          (entry) => entry.category === category && !FEATURED_TYPES.includes(entry.type),
        );
        if (items.length === 0) return null;
        return (
          <div key={category}>
            <div style={styles.sectionTitle}>
              {LINK_CATEGORY_LABELS[category]}
            </div>
            <div style={styles.grid}>{items.map(renderItem)}</div>
          </div>
        );
      })}
    </MobileBottomSheet>
  );
}
