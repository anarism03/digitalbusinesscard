import type { AuditChange } from "../../../../types";
import {
  getChangeItemStyle,
  getChangeListStyle,
  styles,
} from "../../../../styles/super-admin/ChangeList.styles";

const CHANGE_PREVIEW_LIMIT = 5;

interface Props {
  items: AuditChange[];
  expanded?: boolean;
  onOpen?: () => void;
}

export default function ChangeList({ items, expanded = false, onOpen }: Props) {
  if (!items.length) return <span style={styles.emptyChange}>-</span>;

  const visibleItems = expanded ? items : items.slice(0, CHANGE_PREVIEW_LIMIT);
  const hiddenCount = items.length - visibleItems.length;

  const content = (
    <div
      className={expanded ? "audit-change-list-expanded" : undefined}
      style={getChangeListStyle(expanded)}
    >
      {visibleItems.map((change, i) => (
        <div
          key={`${change.label}-${i}`}
          className={expanded ? "audit-change-list-item" : undefined}
          style={getChangeItemStyle(expanded)}
        >
          <b>{change.label}:</b>{" "}
          {change.from !== undefined && change.to !== undefined ? (
            <>
              <span style={styles.deletedValue}>{change.from}</span>
              {" -> "}
              <span style={styles.addedValue}>{change.to}</span>
            </>
          ) : (
            <span>{change.to ?? change.from}</span>
          )}
          {!expanded && hiddenCount > 0 && i === visibleItems.length - 1 && (
            <span className="audit-more-button" aria-hidden="true">
              {" "}
              ...
            </span>
          )}
        </div>
      ))}
    </div>
  );

  if (!onOpen) return content;

  return (
    <button
      type="button"
      className="audit-change-trigger"
      onClick={(event) => {
        event.stopPropagation();
        onOpen();
      }}
    >
      {content}
    </button>
  );
}
