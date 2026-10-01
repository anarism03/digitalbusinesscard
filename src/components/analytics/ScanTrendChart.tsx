import { useState } from "react";
import { Card, Skeleton, Empty } from "antd";
import dayjs from "dayjs";
import type { ScanChartPoint } from "../../types";
import { formatDateShort } from "../../utils/date";
import { styles } from "../../styles/analytics/ScanTrendChart.styles";

interface ScanTrendChartProps {
  data?: ScanChartPoint[];
  loading?: boolean;
  errorMessage?: string | null;
  tickFormatter?: (date: string) => string;
  headerLabel?: string;
}

const VIEW_W = 300;
const VIEW_H = 100;
const PAD_TOP = 14;
const PAD_BOTTOM = 10;
const GRID_LINES_Y = [25, 50, 75];

function tooltipTranslateX(x: number): string {
  const percent = (x / VIEW_W) * 100;
  if (percent < 12) return "0%";
  if (percent > 88) return "-100%";
  return "-50%";
}

function formatTooltipLabel(date: string): string {
  if (/^\d{2}:\d{2}$/.test(date)) return date;
  if (/^\d{4}-\d{2}$/.test(date))
    return dayjs(`${date}-01`).format("MMMM YYYY");
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format("D MMMM") : date;
}

export default function ScanTrendChart({
  data,
  loading,
  errorMessage,
  tickFormatter = formatDateShort,
  headerLabel,
}: ScanTrendChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const points = data ?? [];
  const max = Math.max(1, ...points.map((p) => p.count));
  const n = points.length;
  const lastIndex = n - 1;
  const usableHeight = VIEW_H - PAD_TOP - PAD_BOTTOM;

  const coords = points.map((point, index) => ({
    x: n > 1 ? (index / (n - 1)) * VIEW_W : VIEW_W / 2,
    y: PAD_TOP + (1 - point.count / max) * usableHeight,
  }));
  const pathD = coords
    .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
    .join(" ");

  const midIndex = Math.floor((n - 1) / 2);
  const active = activeIndex !== null ? coords[activeIndex] : null;

  return (
    <Card style={styles.card} styles={{ body: styles.body }}>
      <div style={styles.header}>
        <h2 style={styles.title}>Skan Dinamikası</h2>
        {headerLabel && <span style={styles.headerLabel}>{headerLabel}</span>}
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : errorMessage ? (
        <Empty description={errorMessage} style={styles.empty} />
      ) : n === 0 ? (
        <Empty description="Bu dövrdə skan yoxdur" style={styles.empty} />
      ) : (
        <>
          <div style={styles.chartWrap}>
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              preserveAspectRatio="none"
              style={styles.svg}
            >
              {GRID_LINES_Y.map((y) => (
                <line
                  key={y}
                  x1={0}
                  y1={y}
                  x2={VIEW_W}
                  y2={y}
                  stroke="#eef0f2"
                  strokeDasharray="3 3"
                />
              ))}
              <path
                d={pathD}
                fill="none"
                stroke="#1b4a75"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {coords.map((c, i) => (
                <circle
                  key={points[i].date}
                  cx={c.x}
                  cy={c.y}
                  r={i === lastIndex ? 5 : 3}
                  fill={i === lastIndex ? "#1b4a75" : "#fff"}
                  stroke="#1b4a75"
                  strokeWidth={i === lastIndex ? 2 : 1.5}
                />
              ))}
            </svg>

            <div style={styles.hitZones}>
              {points.map((point, index) => (
                <button
                  key={point.date}
                  type="button"
                  style={styles.hitZone}
                  aria-label={`${formatTooltipLabel(point.date)}: ${point.count}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() =>
                    setActiveIndex((v) => (v === index ? null : v))
                  }
                  onClick={() =>
                    setActiveIndex((v) => (v === index ? null : index))
                  }
                />
              ))}
            </div>

            {active && activeIndex !== null && (
              <div
                style={{
                  ...styles.tooltip,
                  left: `${(active.x / VIEW_W) * 100}%`,
                  top: `${(active.y / VIEW_H) * 100}%`,
                  opacity: 1,
                  transform: `translate(${tooltipTranslateX(active.x)}, calc(-100% - 10px))`,
                }}
              >
                {formatTooltipLabel(points[activeIndex].date)}:{" "}
                {points[activeIndex].count}
              </div>
            )}
          </div>

          <div style={styles.axisRow}>
            <span style={styles.axisLabel}>
              {tickFormatter(points[0].date)}
            </span>
            {n > 2 && (
              <span style={styles.axisLabel}>
                {tickFormatter(points[midIndex].date)}
              </span>
            )}
            {n > 1 && (
              <span style={styles.axisLabel}>
                {tickFormatter(points[lastIndex].date)}
              </span>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
