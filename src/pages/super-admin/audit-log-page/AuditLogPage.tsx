import { useMemo, useState } from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import { auditLogService } from "../../../services/auditLog.service";
import PageHeader from "../../../components/shared/PageHeader";
import ErrorState from "../../../components/shared/ErrorState";
import EmptyState from "../../../components/shared/EmptyState";
import InfiniteScrollTrigger from "../../../components/shared/InfiniteScrollTrigger";
import { strings } from "../../../constants/strings";
import { formatDateTime } from "../../../utils/date";
import { mapAuditPage } from "../../../utils/mappers";
import {
  dedupeEntries,
  resolveAction,
  resolveEntity,
  userLabel,
} from "../../../utils/audit";
import type { AuditChange, AuditLogEntry } from "../../../types";
import { styles } from "../../../styles/super-admin/AuditLogPage.styles";
import ChangeList from "./parts/ChangeList";
import AuditLogDetailsModal from "./modals/AuditLogDetailsModal";

const PAGE_SIZE = 10;
const s = strings.auditLogs;

function ActionTag({ value }: { value?: string }) {
  const { label, color } = resolveAction(value);
  return <Tag color={color}>{label}</Tag>;
}

export default function AuditLogPage() {
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const {
    items,
    totalCount: total,
    isLoading,
    isLoadingMore,
    isError,
    hasMore,
    sentinelRef,
    refetch,
  } = useInfiniteScroll<AuditLogEntry>(
    (page) => auditLogService.getList(page, PAGE_SIZE).then(mapAuditPage),
    [],
  );

  const entries = useMemo(() => dedupeEntries(items), [items]);

  const columns: ColumnsType<AuditLogEntry> = [
    {
      title: "Tarix və saat",
      dataIndex: "createdAt",
      width: 150,
      render: (value?: string) => (value ? formatDateTime(value) : "-"),
    },
    {
      title: "İstifadəçi",
      key: "user",
      width: 200,
      render: (_, row) => userLabel(row),
    },
    {
      title: "Əməliyyat",
      dataIndex: "action",
      width: 150,
      render: (value?: string) => <ActionTag value={value} />,
    },
    {
      title: "Obyekt",
      dataIndex: "entityType",
      width: 110,
      render: (value?: string) => resolveEntity(value),
    },
    {
      title: "Dəyişikliklər",
      dataIndex: "changes",
      width: 340,
      render: (value: AuditChange[], row) => (
        <ChangeList items={value} onOpen={() => setSelectedLog(row)} />
      ),
    },
  ];

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div>
      <PageHeader title={s.title} />

      <Table
        dataSource={entries}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        locale={{ emptyText: <EmptyState description={s.empty} /> }}
        scroll={{ x: 950 }}
        size="small"
        onRow={() => ({ style: styles.tableRow })}
        pagination={false}
        footer={
          total > 0 ? () => `${strings.common.total}: ${total}` : undefined
        }
      />

      <InfiniteScrollTrigger
        sentinelRef={sentinelRef}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
      />

      <AuditLogDetailsModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
