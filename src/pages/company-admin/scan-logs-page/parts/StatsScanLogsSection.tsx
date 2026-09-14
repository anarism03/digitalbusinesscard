import { FieldTimeOutlined, FilterOutlined, ScanOutlined } from "@ant-design/icons";
import { Card, DatePicker, Pagination, Select } from "antd";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AssetAvatar from "../../../../components/shared/AssetAvatar";
import EmptyState from "../../../../components/shared/EmptyState";
import ErrorState from "../../../../components/shared/ErrorState";
import ImagePreviewModal from "../../../../components/shared/ImagePreviewModal";
import { useScanLogs } from "../../../../hooks/useAnalytics";
import { useEmployees } from "../../../../hooks/useEmployees";
import { useFrameContainer } from "../../../../components/layout/FrameContainerContext";
import { useAppSelector } from "../../../../store/hooks";
import type { ScanLog } from "../../../../types";
import { formatDateTime } from "../../../../utils/date";
import { shortId } from "../../../../utils/text";
import { readPositiveInt, updateSearchParams } from "../../../../utils/urlSearch";
import { styles } from "../../../../styles/company-admin/ScanLogsPage.styles";

const DEFAULT_PAGE_SIZE = 20;
const { RangePicker } = DatePicker;

interface Props {
  onSelectEmployee: (id: string) => void;
}

export default function StatsScanLogsSection({ onSelectEmployee }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const getPopupContainer = useFrameContainer();
  const [previewImage, setPreviewImage] = useState<{
    src?: string;
    title: string;
  } | null>(null);
  const user = useAppSelector((state) => state.auth.user);
  const companyId = user?.companyId ?? "";

  const page = readPositiveInt(searchParams.get("logsPage"), 1);
  const pageSize = readPositiveInt(
    searchParams.get("logsPageSize"),
    DEFAULT_PAGE_SIZE,
  );
  const employeeId = searchParams.get("logsEmployeeId") || undefined;
  const logsFrom = searchParams.get("logsFrom");
  const logsTo = searchParams.get("logsTo");
  const { data: employeesData } = useEmployees(companyId);
  const employees = useMemo(() => employeesData ?? [], [employeesData]);

  const setScanLogParams = useCallback(
    (updates: Record<string, string | number | boolean | null | undefined>) => {
      setSearchParams((current) => updateSearchParams(current, updates));
    },
    [setSearchParams],
  );

  const employeeById = useMemo(() => {
    const map = new Map<string, (typeof employees)[number]>();
    employees.forEach((employee) => map.set(employee.id, employee));
    return map;
  }, [employees]);

  const getEmployeeName = useCallback(
    (row: ScanLog): string =>
      employeeById.get(row.employeeId || "")?.fullName ||
      row.employeeName ||
      (row.employeeId ? shortId(row.employeeId) : "-"),
    [employeeById],
  );

  const getEmployeePhoto = useCallback(
    (row: ScanLog): string | undefined =>
      row.photoUrl || employeeById.get(row.employeeId || "")?.photoUrl,
    [employeeById],
  );

  const dateRange = useMemo(() => {
    if (!logsFrom || !logsTo) return {};
    return {
      startDate: dayjs(logsFrom).startOf("day").toISOString(),
      endDate: dayjs(logsTo).endOf("day").toISOString(),
    };
  }, [logsFrom, logsTo]);

  const params = useMemo(
    () => ({ companyId: companyId || undefined, employeeId, page, pageSize, ...dateRange }),
    [companyId, employeeId, page, pageSize, dateRange],
  );

  const { data, isLoading, isError, refetch } = useScanLogs(params);
  const logs = useMemo(() => data?.items ?? [], [data?.items]);
  const total = data?.total ?? 0;

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div>
      <Card style={styles.toolbarCard} styles={{ body: styles.toolbarBody }}>
        <div style={styles.filterBlock}>
          <span style={styles.filterLabel}>
            <FilterOutlined /> Əməkdaş filtri
          </span>
          <Select
            value={employeeId}
            onChange={(value) => setScanLogParams({ logsEmployeeId: value, logsPage: 1 })}
            allowClear
            placeholder="Bütün əməkdaşlar"
            options={employees.map((employee) => ({
              value: employee.id,
              label: employee.fullName,
            }))}
          />
        </div>
        <div style={styles.filterBlock}>
          <span style={styles.filterLabel}>
            <FieldTimeOutlined /> Tarix aralığı
          </span>
          <RangePicker
            value={logsFrom && logsTo ? [dayjs(logsFrom), dayjs(logsTo)] : null}
            onChange={(dates) => {
              if (!dates || !dates[0] || !dates[1]) {
                setScanLogParams({ logsFrom: null, logsTo: null, logsPage: 1 });
                return;
              }
              setScanLogParams({
                logsFrom: dates[0].format("YYYY-MM-DD"),
                logsTo: dates[1].format("YYYY-MM-DD"),
                logsPage: 1,
              });
            }}
            format="DD/MM/YYYY"
            allowClear
            style={{ width: "100%" }}
            getPopupContainer={getPopupContainer}
            classNames={{ popup: { root: "cadmin-range-popup" } }}
          />
        </div>
        <div style={styles.statTile}>
          <span style={styles.statIcon}>
            <ScanOutlined />
          </span>
          <span>
            <span style={styles.statLabel}>Ümumi skan</span>
            <span style={styles.statValue}>{total}</span>
          </span>
        </div>
      </Card>

      <Card style={styles.tableCard} styles={{ body: styles.tableBody }}>
        {isLoading ? (
          <div>Yüklənir...</div>
        ) : logs.length === 0 ? (
          <EmptyState description="Skan tapılmadı" />
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              style={{ ...styles.employeeCell, ...styles.clickableRow, paddingBlock: 10 }}
              onClick={() => log.employeeId && onSelectEmployee(log.employeeId)}
            >
              <span style={styles.employeeHint}>
                <FieldTimeOutlined /> {formatDateTime(log.scannedAt)}
              </span>
              <span style={styles.employeeText}>
                <button
                  type="button"
                  aria-label={`${getEmployeeName(log)} foto`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewImage({ src: getEmployeePhoto(log), title: getEmployeeName(log) });
                  }}
                  style={styles.employeeAvatarButton}
                >
                  <AssetAvatar size={36} src={getEmployeePhoto(log)} name={getEmployeeName(log)} />
                </button>
                <span style={styles.employeeName}>{getEmployeeName(log)}</span>
              </span>
            </div>
          ))
        )}
      </Card>

      {total > pageSize && (
        <div style={styles.paginationWrap}>
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            pageSizeOptions={["10", "20", "50", "100"]}
            simple
            size="small"
            onChange={(nextPage, nextPageSize) =>
              setScanLogParams({ logsPage: nextPage, logsPageSize: nextPageSize })
            }
          />
        </div>
      )}

      <ImagePreviewModal
        open={Boolean(previewImage)}
        src={previewImage?.src}
        title={previewImage?.title}
        onClose={() => setPreviewImage(null)}
      />
    </div>
  );
}
