import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Grid, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useApiQuery } from "../../../hooks/useApi";
import { auditLogService } from "../../../services/auditLog.service";
import PageHeader from "../../../components/shared/PageHeader";
import ErrorState from "../../../components/shared/ErrorState";
import EmptyState from "../../../components/shared/EmptyState";
import { strings } from "../../../constants/strings";
import { formatDateTime } from "../../../utils/date";
import { mapAuditPage } from "../../../utils/mappers";
import { resolveEntity } from "../../../utils/audit";
import { readPositiveInt, updateSearchParams } from "../../../utils/urlSearch";
import type { AuditChange, AuditLogEntry } from "../../../types";
import { styles } from "../../../styles/company-admin/AuditLogPage.styles";
import {
  ActionTag,
  ChangeList,
  dedupeEntries,
  userLabel,
} from "./AuditLogHelpers";
import AuditLogDetailsModal from "./AuditLogDetailsModal";

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const s = strings.auditLogs;

export default function AuditLogPage() {
  const isMobile = !Grid.useBreakpoint().md;
  const [searchParams, setSearchParams] = useSearchParams();
  const page = readPositiveInt(searchParams.get("page"), 1);
  const pageSize = readPositiveInt(
    searchParams.get("pageSize"),
    DEFAULT_PAGE_SIZE,
  );
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const setAuditLogParams = useCallback(
    (updates: Record<string, string | number | boolean | null | undefined>) => {
      setSearchParams((current) => updateSearchParams(current, updates));
    },
    [setSearchParams],
  );

  const { data, isLoading, isError, refetch } = useApiQuery(
    `audit-log-${page}-${pageSize}`,
    () =>
      auditLogService
        .getList(page, pageSize)
        .then((raw) => mapAuditPage(raw, page, pageSize)),
    { deps: [page, pageSize] },
  );

  const entries = useMemo(() => dedupeEntries(data?.data ?? []), [data?.data]);
  const total = data?.totalCount ?? 0;

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
      <PageHeader
        title={s.title}
      />

      <Table
        dataSource={entries}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        locale={{ emptyText: <EmptyState description={s.empty} /> }}
        scroll={{ x: 950, y: isMobile ? "calc(100dvh - 280px)" : undefined }}
        size="small"
        onRow={() => ({ style: styles.tableRow })}
        pagination={{
          current: page,
          pageSize,
          total,
          size: "default",
          showLessItems: isMobile,
          showSizeChanger: true,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          showTotal: (value) => `${strings.common.total}: ${value}`,
          onChange: (nextPage, nextPageSize) => {
            setAuditLogParams({
              page: nextPageSize !== pageSize ? 1 : nextPage,
              pageSize: nextPageSize,
            });
          },
        }}
      />

      <AuditLogDetailsModal
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
