import { useCallback, useMemo, useState, lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, DatePicker, Segmented, Select, Checkbox } from "antd";
import dayjs from "dayjs";
import { ScanOutlined, TrophyOutlined } from "@ant-design/icons";
import CountUp from "../../../../components/shared/CountUp";
import ErrorState from "../../../../components/shared/ErrorState";
import AssetAvatar from "../../../../components/shared/AssetAvatar";
import {
  useScansCount,
  useScansChart,
  useEmployeesRanking,
} from "../../../../hooks/useAnalytics";
import { useEmployees } from "../../../../hooks/useEmployees";
import { useFrameContainer } from "../../../../components/layout/FrameContainerContext";
import { useAppSelector } from "../../../../store/hooks";
import { updateSearchParams } from "../../../../utils/urlSearch";
import type { AnalyticsQueryParams } from "../../../../types";
import {
  getDashboardGridStyle,
  getEmployeeSelectStyle,
  styles,
} from "../../../../styles/company-admin/DashboardPage.styles";

const ScanLineChart = lazy(
  () => import("../../../../components/analytics/ScanLineChart"),
);

const { RangePicker } = DatePicker;

type PeriodPreset = "day" | "week" | "month" | "year";
const PERIOD_PRESETS: PeriodPreset[] = ["day", "week", "month", "year"];

function readPeriodPreset(value: string | null): PeriodPreset {
  return PERIOD_PRESETS.includes(value as PeriodPreset)
    ? (value as PeriodPreset)
    : "month";
}

function getPresetRange(preset: PeriodPreset) {
  const end = dayjs();
  let start = end;

  if (preset === "day") start = end.startOf("day");
  if (preset === "week") start = end.subtract(7, "day");
  if (preset === "month") start = end.subtract(30, "day");
  if (preset === "year") start = end.subtract(1, "year");

  return { startDate: start.toISOString(), endDate: end.toISOString() };
}

interface Props {
  onSelectEmployee: (id: string) => void;
}

export default function StatsOverviewSection({ onSelectEmployee }: Props) {
  const user = useAppSelector((s) => s.auth.user);
  const getPopupContainer = useFrameContainer();
  const [searchParams, setSearchParams] = useSearchParams();

  const preset = readPeriodPreset(searchParams.get("period"));
  const employeeId = searchParams.get("statsEmployeeId") || undefined;
  const [onlyActive, setOnlyActive] = useState(false);
  const customFrom = searchParams.get("from");
  const customTo = searchParams.get("to");

  const companyId = user?.companyId ?? "";
  const { data: employees = [] } = useEmployees(companyId);

  const setDashboardParams = useCallback(
    (updates: Record<string, string | number | boolean | null | undefined>) => {
      setSearchParams((current) => updateSearchParams(current, updates));
    },
    [setSearchParams],
  );

  const { startDate, endDate } = useMemo(() => {
    if (customFrom && customTo) {
      return {
        startDate: dayjs(customFrom).startOf("day").toISOString(),
        endDate: dayjs(customTo).endOf("day").toISOString(),
      };
    }
    return getPresetRange(preset);
  }, [preset, customFrom, customTo]);

  const params: AnalyticsQueryParams = useMemo(
    () => ({ companyId: companyId || undefined, startDate, endDate, employeeId }),
    [companyId, startDate, endDate, employeeId],
  );
  const rankingParams: AnalyticsQueryParams = useMemo(
    () => ({ companyId: companyId || undefined, startDate, endDate }),
    [companyId, startDate, endDate],
  );

  const {
    data: totalScans,
    isLoading: countLoading,
    isError: countError,
    refetch,
  } = useScansCount(params);
  const { data: chartData, isLoading: chartLoading } = useScansChart(params);
  const { data: ranking, isLoading: rankingLoading } = useEmployeesRanking(rankingParams);

  const filteredRanking = useMemo(() => {
    const employeeMap = new Map(employees.map((e) => [e.id, e]));
    const list = (ranking ?? []).map((r) => {
      const emp = employeeMap.get(r.employeeId);
      return {
        ...r,
        photoUrl: r.photoUrl || emp?.photoUrl,
        jobTitle: r.jobTitle || emp?.jobTitle,
        fullName: r.fullName || emp?.fullName || r.fullName,
      };
    });
    if (!onlyActive) return list;
    const activeIds = new Set(employees.filter((e) => e.isActive).map((e) => e.id));
    return list.filter((r) => activeIds.has(r.employeeId));
  }, [ranking, onlyActive, employees]);

  if (countError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div>
      <Card style={styles.filterCard} styles={{ body: styles.filterBody }}>
        <div style={styles.filterRow}>
          <Segmented
            value={preset}
            onChange={(v) =>
              setDashboardParams({ period: v as PeriodPreset, from: null, to: null })
            }
            size="small"
            options={[
              { value: "day", label: "Gün" },
              { value: "week", label: "Həftə" },
              { value: "month", label: "Ay" },
              { value: "year", label: "İl" },
            ]}
          />
          <RangePicker
            value={customFrom && customTo ? [dayjs(customFrom), dayjs(customTo)] : null}
            onChange={(dates) => {
              if (!dates || !dates[0] || !dates[1]) {
                setDashboardParams({ from: null, to: null });
                return;
              }
              setDashboardParams({
                from: dates[0].format("YYYY-MM-DD"),
                to: dates[1].format("YYYY-MM-DD"),
              });
            }}
            format="DD/MM/YYYY"
            size="small"
            allowClear
            getPopupContainer={getPopupContainer}
            classNames={{ popup: { root: "cadmin-range-popup" } }}
          />
          <Select
            value={employeeId}
            onChange={(v) => setDashboardParams({ statsEmployeeId: v })}
            allowClear
            placeholder="Bütün əməkdaşlar"
            size="small"
            style={getEmployeeSelectStyle(false)}
            options={employees.map((e) => ({ value: e.id, label: e.fullName }))}
          />
          <Checkbox
            checked={onlyActive}
            onChange={(e) => setOnlyActive(e.target.checked)}
          >
            <span style={styles.activeOnlyLabel}>Yalnız aktivlər</span>
          </Checkbox>
        </div>
      </Card>

      <Card loading={countLoading} style={styles.totalCard} styles={{ body: styles.totalBody }}>
        <div style={styles.totalRow}>
          <ScanOutlined style={styles.scanIcon} />
          <div>
            <div style={styles.totalLabel}>Ümumi skan sayı</div>
            <div style={styles.totalValue}>
              <CountUp value={totalScans ?? 0} />
            </div>
          </div>
        </div>
      </Card>

      <div style={getDashboardGridStyle(true)}>
        <Suspense fallback={<Card loading />}>
          <ScanLineChart data={chartData} loading={chartLoading} />
        </Suspense>

        <Card
          title={
            <span style={styles.rankingTitle}>
              <TrophyOutlined style={styles.trophyIcon} />
              Əməkdaş reytinqi
            </span>
          }
          loading={rankingLoading}
        >
          {filteredRanking.length === 0 ? (
            <div>Hələlik məlumat yoxdur</div>
          ) : (
            filteredRanking.map((row, idx) => (
              <button
                key={row.employeeId}
                type="button"
                onClick={() => onSelectEmployee(row.employeeId)}
                style={styles.rankingButton}
              >
                <span>{idx + 1}</span>
                <AssetAvatar
                  src={row.photoUrl}
                  name={row.fullName}
                  size={28}
                  style={styles.rankingAvatar}
                />
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={styles.rankingName}>{row.fullName}</div>
                  {row.jobTitle && <div style={styles.rankingJob}>{row.jobTitle}</div>}
                </div>
                <span style={styles.scanCount}>{row.scanCount}</span>
              </button>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}
