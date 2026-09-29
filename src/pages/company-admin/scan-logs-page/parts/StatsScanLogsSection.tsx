import {
  FieldTimeOutlined,
  FilterOutlined,
  ScanOutlined,
} from "@ant-design/icons";
import { Card, Select } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AssetAvatar from "../../../../components/shared/AssetAvatar";
import EmptyState from "../../../../components/shared/EmptyState";
import ErrorState from "../../../../components/shared/ErrorState";
import ImagePreviewModal from "../../../../components/shared/ImagePreviewModal";
import InfiniteScrollTrigger from "../../../../components/shared/InfiniteScrollTrigger";
import RangeCalendarPicker from "../../../../components/shared/RangeCalendarPicker";
import { useInfiniteScroll } from "../../../../hooks/useInfiniteScroll";
import { useEmployees } from "../../../../hooks/useEmployees";
import { useAppSelector } from "../../../../store/hooks";
import { analyticsService } from "../../../../services/analytics.service";
import { mapScanLogs } from "../../../../utils/mappers";
import type { ScanLog } from "../../../../types";
import { formatDateTime } from "../../../../utils/date";
import { shortId } from "../../../../utils/text";
import { updateSearchParams } from "../../../../utils/urlSearch";
import { styles } from "../../../../styles/company-admin/ScanLogsPage.styles";

const DEFAULT_PAGE_SIZE = 10;

interface Props {
  onSelectEmployee: (id: string) => void;
}

export default function StatsScanLogsSection({ onSelectEmployee }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [previewImage, setPreviewImage] = useState<{
    src?: string;
    title: string;
  } | null>(null);
  const user = useAppSelector((state) => state.auth.user);
  const companyId = user?.companyId ?? "";

  const employeeId = searchParams.get("logsEmployeeId") || undefined;
  const logsFrom = searchParams.get("logsFrom");
  const logsTo = searchParams.get("logsTo");
  const hasFilters = Boolean(employeeId || logsFrom || logsTo);
  const { data: employeesData } = useEmployees(companyId);
  const employees = useMemo(() => employeesData ?? [], [employeesData]);

  const setScanLogParams = (
    updates: Record<string, string | number | boolean | null | undefined>,
  ) => setSearchParams((current) => updateSearchParams(current, updates));

  const employeeById = useMemo(() => {
    const map = new Map<string, (typeof employees)[number]>();
    employees.forEach((employee) => map.set(employee.id, employee));
    return map;
  }, [employees]);

  const getEmployeeName = (row: ScanLog): string =>
    employeeById.get(row.employeeId || "")?.fullName ||
    row.employeeName ||
    (row.employeeId ? shortId(row.employeeId) : "-");

  const getEmployeePhoto = (row: ScanLog): string | undefined =>
    row.photoUrl || employeeById.get(row.employeeId || "")?.photoUrl;

  const dateRange =
    logsFrom && logsTo
      ? {
          startDate: dayjs(logsFrom).startOf("day").toISOString(),
          endDate: dayjs(logsTo).endOf("day").toISOString(),
        }
      : {};

  const filters = {
    companyId: companyId || undefined,
    employeeId,
    ...dateRange,
  };

  const {
    items: logs,
    totalCount: total,
    isLoading,
    isLoadingMore,
    isError,
    hasMore,
    sentinelRef,
    refetch,
  } = useInfiniteScroll<ScanLog>(
    (page) =>
      analyticsService
        .getScanLogs({ ...filters, page, pageSize: DEFAULT_PAGE_SIZE })
        .then(mapScanLogs),
    [filters],
  );

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div>
      <Card style={styles.toolbarCard} styles={{ body: styles.toolbarBody }}>
        <div style={styles.filterGroup}>
          <span style={styles.filterTitleRow}>
            <span style={styles.filterIconBadge}>
              <FilterOutlined />
            </span>
            <span style={styles.filterLabel}>Əməkdaş filtri</span>
          </span>
          <Select
            value={employeeId}
            onChange={(value) => setScanLogParams({ logsEmployeeId: value })}
            allowClear
            placeholder="Bütün əməkdaşlar"
            size="large"
            className="stats-filter-field"
            style={styles.filterField}
            options={employees.map((employee) => ({
              value: employee.id,
              label: employee.fullName,
            }))}
          />
        </div>
        <div style={styles.filterGroup}>
          <span style={styles.filterTitleRow}>
            <span style={styles.filterIconBadge}>
              <FieldTimeOutlined />
            </span>
            <span style={styles.filterLabel}>Tarix aralığı</span>
          </span>
          <RangeCalendarPicker
            from={logsFrom}
            to={logsTo}
            onChange={(from, to) =>
              setScanLogParams({ logsFrom: from, logsTo: to })
            }
            className="stats-filter-field"
            style={styles.filterField}
          />
        </div>
      </Card>

      <div style={styles.statCard}>
        <span style={styles.statIcon}>
          <ScanOutlined />
        </span>
        <span>
          <span style={styles.statLabel}>
            {hasFilters ? "Filtrə uyğun skan" : "Ümumi skan"}
          </span>
          <span style={styles.statValue}>{total}</span>
        </span>
      </div>

      <Card style={styles.tableCard} styles={{ body: styles.tableBody }}>
        {isLoading ? (
          <div>Yüklənir...</div>
        ) : logs.length === 0 ? (
          <EmptyState description="Skan tapılmadı" />
        ) : (
          logs.map((log, idx) => (
            <button
              key={log.id}
              type="button"
              style={{
                ...styles.logRow,
                ...(idx === logs.length - 1 ? styles.logRowLast : null),
              }}
              onClick={() => log.employeeId && onSelectEmployee(log.employeeId)}
            >
              <span style={styles.logEmployee}>
                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`${getEmployeeName(log)} foto`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewImage({
                      src: getEmployeePhoto(log),
                      title: getEmployeeName(log),
                    });
                  }}
                  style={styles.logAvatarButton}
                >
                  <AssetAvatar
                    size={32}
                    src={getEmployeePhoto(log)}
                    name={getEmployeeName(log)}
                    style={styles.logAvatar}
                  />
                </span>
                <span style={styles.logName}>{getEmployeeName(log)}</span>
              </span>
              <span style={styles.logDate}>
                {formatDateTime(log.scannedAt)}
              </span>
            </button>
          ))
        )}
      </Card>

      <InfiniteScrollTrigger
        sentinelRef={sentinelRef}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
      />

      <ImagePreviewModal
        open={Boolean(previewImage)}
        src={previewImage?.src}
        title={previewImage?.title}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
}
