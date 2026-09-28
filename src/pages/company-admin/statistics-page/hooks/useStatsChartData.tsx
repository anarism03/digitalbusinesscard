import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { analyticsService } from "../../../../services/analytics.service";
import { mapScanLogs } from "../../../../utils/mappers";
import { formatDateShort } from "../../../../utils/date";
import type { PeriodPreset, ScanChartPoint } from "../../../../types";

const PERIOD_PRESETS: PeriodPreset[] = [
  "day",
  "week",
  "month",
  "year",
  "custom",
];

export function readPeriodPreset(value: string | null): PeriodPreset {
  return PERIOD_PRESETS.includes(value as PeriodPreset)
    ? (value as PeriodPreset)
    : "month";
}

export function getPresetRange(preset: PeriodPreset) {
  const end = dayjs();
  let start = end;

  if (preset === "day") start = end.startOf("day");
  if (preset === "week") start = end.subtract(7, "day");
  if (preset === "month" || preset === "custom")
    start = end.subtract(30, "day");
  if (preset === "year") start = end.subtract(1, "year");

  return { startDate: start.toISOString(), endDate: end.toISOString() };
}

function getHeaderRangeLabel(
  preset: PeriodPreset,
  startDate: string,
  endDate: string,
): string {
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (preset === "day") return end.format("D MMM");
  if (preset === "year") return end.format("YYYY");
  if (start.isSame(end, "day")) return end.format("D MMM");
  return `${start.format("DD")} – ${end.format("DD MMM")}`;
}

function aggregateByMonth(points: ScanChartPoint[]): ScanChartPoint[] {
  const monthMap = new Map<string, number>();
  points.forEach((point) => {
    const key = dayjs(point.date).format("YYYY-MM");
    monthMap.set(key, (monthMap.get(key) ?? 0) + point.count);
  });
  return Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, count]) => ({ date: key, count }));
}

const HOURLY_PAGE_SIZE = 500;
const HOURLY_MAX_PAGES = 50;

function useHourlyScanPoints(
  preset: PeriodPreset,
  companyId: string,
  startDate: string,
  endDate: string,
  employeeId: string | undefined,
) {
  const [points, setPoints] = useState<ScanChartPoint[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (preset !== "day") {
      setPoints(null);
      return;
    }
    let cancelled = false;
    setIsLoading(true);

    const buckets = Array.from({ length: 24 }, (_, hour) => ({
      date: `${String(hour).padStart(2, "0")}:00`,
      count: 0,
    }));

    const fetchAllPages = async () => {
      let page = 1;
      let total = Infinity;
      let fetched = 0;
      while (fetched < total && page <= HOURLY_MAX_PAGES) {
        const { items, totalCount: pageTotal } = await analyticsService
          .getScanLogs({
            companyId: companyId || undefined,
            startDate,
            endDate,
            employeeId,
            page,
            pageSize: HOURLY_PAGE_SIZE,
          })
          .then(mapScanLogs);
        if (cancelled) return;
        total = pageTotal;
        fetched += items.length;
        items.forEach((log) => {
          const hour = dayjs(log.scannedAt).hour();
          if (buckets[hour]) buckets[hour].count += 1;
        });
        if (items.length === 0) break;
        page += 1;
      }
      if (!cancelled) setPoints(buckets);
    };

    fetchAllPages()
      .catch(() => {
        if (!cancelled) setPoints([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [preset, companyId, startDate, endDate, employeeId]);

  return { points, isLoading };
}

interface UseStatsChartDataArgs {
  preset: PeriodPreset;
  companyId: string;
  startDate: string;
  endDate: string;
  employeeId?: string;
  chartData?: ScanChartPoint[];
  chartLoading: boolean;
}

export function useStatsChartData({
  preset,
  companyId,
  startDate,
  endDate,
  employeeId,
  chartData,
  chartLoading,
}: UseStatsChartDataArgs) {
  const hourly = useHourlyScanPoints(
    preset,
    companyId,
    startDate,
    endDate,
    employeeId,
  );

  const yearlyPoints = useMemo<ScanChartPoint[] | null>(() => {
    if (preset !== "year" || !chartData) return null;
    return aggregateByMonth(chartData);
  }, [preset, chartData]);

  const displayChartData =
    (preset === "day"
      ? hourly.points
      : preset === "year"
        ? yearlyPoints
        : chartData) ?? [];

  const displayChartLoading =
    preset === "day" ? hourly.isLoading : chartLoading;

  const tickFormatter = (date: string) => {
    if (preset === "day") return date;
    if (preset === "week") return dayjs(date).format("dd");
    if (preset === "year") return dayjs(date).format("MMM");
    return formatDateShort(date);
  };

  const headerLabel = getHeaderRangeLabel(preset, startDate, endDate);

  return { displayChartData, displayChartLoading, tickFormatter, headerLabel };
}
