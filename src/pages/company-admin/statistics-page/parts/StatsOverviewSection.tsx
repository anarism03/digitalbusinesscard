import { useMemo, useState, lazy, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, Segmented, Select, Switch } from "antd";
import dayjs from "dayjs";
import { TrophyOutlined } from "@ant-design/icons";
import CountUp from "../../../../components/shared/CountUp";
import ErrorState from "../../../../components/shared/ErrorState";
import AssetAvatar from "../../../../components/shared/AssetAvatar";
import RangeCalendarPicker from "../../../../components/shared/RangeCalendarPicker";
import {
  useScansCount,
  useScansChart,
  useEmployeesRanking,
} from "../../../../hooks/useAnalytics";
import { useEmployees } from "../../../../hooks/useEmployees";
import {
  useStatsChartData,
  readPeriodPreset,
  getPresetRange,
} from "../hooks/useStatsChartData";
import { useAppSelector } from "../../../../store/hooks";
import { updateSearchParams } from "../../../../utils/urlSearch";
import type { AnalyticsQueryParams, PeriodPreset } from "../../../../types";
import { COLORS } from "../../../../constants/ui";
import { styles } from "../../../../styles/company-admin/StatisticsPage.styles";

const ScanTrendChart = lazy(
  () => import("../../../../components/analytics/ScanTrendChart"),
);

interface Props {
  onSelectEmployee: (id: string) => void;
}

function getPreviousRange(
  startDate: string,
  endDate: string,
  preset: PeriodPreset,
) {
  if (preset === "day") {
    return {
      startDate: dayjs(startDate).subtract(1, "day").toISOString(),
      endDate: dayjs(endDate).subtract(1, "day").toISOString(),
    };
  }

  const duration = dayjs(endDate).valueOf() - dayjs(startDate).valueOf();
  const previousEnd = dayjs(startDate).subtract(1, "millisecond");
  return {
    startDate: previousEnd.subtract(duration, "millisecond").toISOString(),
    endDate: previousEnd.toISOString(),
  };
}

export default function StatsOverviewSection({ onSelectEmployee }: Props) {
  const user = useAppSelector((s) => s.auth.user);
  const [searchParams, setSearchParams] = useSearchParams();

  const preset = readPeriodPreset(searchParams.get("period"));
  const employeeId = searchParams.get("statsEmployeeId") || undefined;
  const [onlyActive, setOnlyActive] = useState(false);
  const customFrom = searchParams.get("from");
  const customTo = searchParams.get("to");

  const companyId = user?.companyId ?? "";
  const { data: employees = [] } = useEmployees(companyId);

  const setDashboardParams = (
    updates: Record<string, string | number | boolean | null | undefined>,
  ) => setSearchParams((current) => updateSearchParams(current, updates));

  const { startDate, endDate } = useMemo(() => {
    if (customFrom && customTo) {
      return {
        startDate: dayjs(customFrom).startOf("day").toISOString(),
        endDate: dayjs(customTo).endOf("day").toISOString(),
      };
    }
    return getPresetRange(preset);
  }, [preset, customFrom, customTo]);

  const calendarFrom = customFrom ?? dayjs(startDate).format("YYYY-MM-DD");
  const calendarTo = customTo ?? dayjs(endDate).format("YYYY-MM-DD");
  const isCustomRangeActive = Boolean(customFrom && customTo);
  const effectivePreset: PeriodPreset = isCustomRangeActive ? "custom" : preset;
  const previousRange = useMemo(
    () => getPreviousRange(startDate, endDate, effectivePreset),
    [startDate, endDate, effectivePreset],
  );

  const params: AnalyticsQueryParams = {
    companyId: companyId || undefined,
    startDate,
    endDate,
    employeeId,
  };
  const previousParams: AnalyticsQueryParams = {
    companyId: companyId || undefined,
    ...previousRange,
    employeeId,
  };
  const rankingParams: AnalyticsQueryParams = {
    companyId: companyId || undefined,
    startDate,
    endDate,
  };

  const {
    data: totalScans,
    isLoading: countLoading,
    isError: countError,
    refetch,
  } = useScansCount(params);
  const {
    data: previousScans,
    isLoading: previousLoading,
    isError: previousError,
  } = useScansCount(previousParams);
  const {
    data: chartData,
    isLoading: chartLoading,
    isError: chartError,
  } = useScansChart(params, effectivePreset !== "day");
  const { data: ranking, isLoading: rankingLoading } =
    useEmployeesRanking(rankingParams);

  const activeEmployeeCount = useMemo(
    () => employees.filter((e) => e.isActive).length,
    [employees],
  );
  const averageDivisor = employeeId ? 1 : employees.length;
  const averageScanCount =
    averageDivisor > 0 ? Math.round((totalScans ?? 0) / averageDivisor) : 0;
  const scanDifference = (totalScans ?? 0) - (previousScans ?? 0);
  const changeColor =
    scanDifference > 0
      ? "#1b6fa8"
      : scanDifference < 0
        ? COLORS.danger
        : COLORS.text;
  let changeLabel = "—";
  if (previousScans !== undefined && totalScans !== undefined) {
    if (previousScans === 0) {
      changeLabel = totalScans === 0 ? "0%" : `+${totalScans} skan`;
    } else {
      const changePercent = (scanDifference / previousScans) * 100;
      changeLabel = `${scanDifference > 0 ? "+" : ""}${new Intl.NumberFormat(
        "az-AZ",
        {
          maximumFractionDigits: 1,
        },
      ).format(changePercent)}%`;
    }
  }

  const {
    displayChartData,
    displayChartLoading,
    displayChartError,
    tickFormatter: chartTickFormatter,
    headerLabel: headerRangeLabel,
  } = useStatsChartData({
    preset: effectivePreset,
    companyId,
    startDate,
    endDate,
    employeeId,
    chartData,
    chartLoading,
    chartError,
  });

  const filteredRanking = useMemo(() => {
    const employeeMap = new Map(employees.map((e) => [e.id, e]));
    const list = (ranking ?? []).map((r) => {
      const emp = employeeMap.get(r.employeeId);
      return {
        ...r,
        photoUrl: r.photoUrl || emp?.photoUrl,
        jobTitle: r.jobTitle || emp?.jobTitle,
        fullName: r.fullName || emp?.fullName || "",
      };
    });
    if (!onlyActive) return list;
    const activeIds = new Set(
      employees.filter((e) => e.isActive).map((e) => e.id),
    );
    return list.filter((r) => activeIds.has(r.employeeId));
  }, [ranking, onlyActive, employees]);
  const maxScanCount = Math.max(...filteredRanking.map((r) => r.scanCount), 1);

  if (countError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div>
      <Segmented
        value={preset}
        onChange={(v) =>
          setDashboardParams({
            period: v as PeriodPreset,
            from: null,
            to: null,
          })
        }
        block
        className="stats-period-segmented"
        style={styles.periodSegmented}
        options={[
          { value: "day", label: "Gün" },
          { value: "week", label: "Həftə" },
          { value: "month", label: "Ay" },
          { value: "year", label: "İl" },
        ]}
      />

      <RangeCalendarPicker
        from={calendarFrom}
        to={calendarTo}
        onChange={(from, to) => setDashboardParams({ from, to })}
        className="stats-filter-field"
        style={styles.filterField}
      />

      <Select
        value={employeeId}
        onChange={(v) => setDashboardParams({ statsEmployeeId: v })}
        allowClear
        placeholder="Bütün əməkdaşlar"
        size="large"
        className="stats-filter-field"
        style={styles.filterField}
        options={employees.map((e) => ({ value: e.id, label: e.fullName }))}
      />

      <Card style={styles.toggleCard} styles={{ body: styles.toggleBody }}>
        <span style={styles.activeOnlyLabel}>Reytinqdə yalnız aktivlər</span>
        <Switch checked={onlyActive} onChange={setOnlyActive} />
      </Card>

      <div style={styles.statGrid}>
        <Card
          loading={countLoading}
          style={styles.statCard}
          styles={{ body: styles.statCardBody }}
        >
          <p style={styles.statLabel}>Ümumi skan</p>
          <p style={styles.statValue}>
            <CountUp value={totalScans ?? 0} />
          </p>
          <p style={styles.statCaption}>{headerRangeLabel}</p>
        </Card>
        <Card style={styles.statCard} styles={{ body: styles.statCardBody }}>
          <p style={styles.statLabel}>Aktiv vizitkart</p>
          <p style={styles.statValue}>{activeEmployeeCount}</p>
          <p style={styles.statCaption}>{employees.length} əməkdaşdan</p>
        </Card>
        <Card
          loading={countLoading}
          style={styles.statCard}
          styles={{ body: styles.statCardBody }}
        >
          <p style={styles.statLabel}>Ortalama skan</p>
          <p style={styles.statValue}>{averageScanCount}</p>
          <p style={styles.statCaption}>
            {employeeId ? "seçilmiş əməkdaş üçün" : "hazırkı əməkdaş başına"}
          </p>
        </Card>
        <Card
          loading={countLoading || previousLoading}
          style={styles.statCard}
          styles={{ body: styles.statCardBody }}
        >
          <p style={styles.statLabel}>Ötən dövrlə müqayisə</p>
          <p
            style={{
              ...styles.statValue,
              ...styles.changeValue,
              color: changeColor,
            }}
          >
            {!previousError && scanDifference !== 0 && (
              <span style={styles.changeArrow} aria-hidden="true">
                {scanDifference > 0 ? "↑" : "↓"}
              </span>
            )}
            {previousError ? "—" : changeLabel}
          </p>
          <p style={styles.statCaption}>
            {previousError
              ? "Müqayisə yüklənmədi"
              : `Ötən dövr: ${previousScans ?? 0} skan`}
          </p>
        </Card>
      </div>

      <div style={styles.dashboardGrid}>
        <Suspense fallback={<Card loading />}>
          <ScanTrendChart
            data={displayChartData}
            loading={displayChartLoading}
            errorMessage={displayChartError}
            tickFormatter={chartTickFormatter}
            headerLabel={headerRangeLabel}
          />
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
                style={{
                  ...styles.rankingButton,
                  borderBottom:
                    idx === filteredRanking.length - 1
                      ? "none"
                      : styles.rankingButton.borderBottom,
                }}
              >
                <span style={styles.rankingIndex}>{idx + 1}</span>
                <AssetAvatar
                  src={row.photoUrl}
                  name={row.fullName}
                  size={40}
                  style={styles.rankingAvatar}
                />
                <div style={styles.rankingInfo}>
                  <div style={styles.rankingName}>{row.fullName}</div>
                  {row.jobTitle && (
                    <div style={styles.rankingJob}>{row.jobTitle}</div>
                  )}
                  <div style={styles.rankingBarTrack}>
                    <div
                      style={{
                        ...styles.rankingBarFill,
                        width: `${(row.scanCount / maxScanCount) * 100}%`,
                      }}
                    />
                  </div>
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
