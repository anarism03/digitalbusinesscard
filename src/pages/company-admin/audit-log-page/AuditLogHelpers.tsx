/* eslint-disable react-refresh/only-export-components */
import { Tag } from "antd";
import { resolveAction } from "../../../utils/audit";
import { shortId } from "../../../utils/text";
import type { AuditChange, AuditLogEntry } from "../../../types";
import {
  getChangeItemStyle,
  getChangeListStyle,
  styles,
} from "../../../styles/company-admin/AuditLogPage.styles";

const CHANGE_PREVIEW_LIMIT = 5;

export function ActionTag({ value }: { value?: string }) {
  const { label, color } = resolveAction(value);
  return <Tag color={color}>{label}</Tag>;
}

export function userLabel(row: AuditLogEntry): string {
  return row.userName || row.userEmail || shortId(row.userId);
}

function changesSignature(items: AuditChange[]) {
  return items
    .map((change) => `${change.label}:${change.from ?? ""}->${change.to ?? ""}`)
    .join("|");
}

export function dedupeEntries(entries: AuditLogEntry[]) {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    const key = [
      String(entry.createdAt).slice(0, 16),
      entry.userId,
      entry.action,
      entry.entityType,
      entry.entityId,
      changesSignature(entry.changes),
    ].join("::");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function ChangeList({
  items,
  expanded = false,
  onOpen,
}: {
  items: AuditChange[];
  expanded?: boolean;
  onOpen?: () => void;
}) {
  if (!items.length) return <span style={styles.emptyChange}>-</span>;

  const visibleItems = expanded ? items : items.slice(0, CHANGE_PREVIEW_LIMIT);
  const hiddenCount = items.length - visibleItems.length;

  const content = (
    <div
      className={expanded ? "audit-change-list-expanded" : undefined}
      style={getChangeListStyle(expanded)}
    >
      {visibleItems.map((change, i) => {
        const showMoreInline =
          !expanded && hiddenCount > 0 && i === visibleItems.length - 1;

        return (
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
            {showMoreInline && (
              <span className="audit-more-button" aria-hidden="true">
                {" "}
                ...
              </span>
            )}
          </div>
        );
      })}
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

export function MetaItem({ label, value }: { label: string; value?: string }) {
  return (
    <div style={styles.metaItem}>
      <div style={styles.metaLabel}>{label}</div>
      <div style={styles.metaValue}>{value || "-"}</div>
    </div>
  );
}
