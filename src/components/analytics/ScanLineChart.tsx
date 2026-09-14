import { Card, Skeleton, Empty, Spin } from "antd";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, } from "recharts";
import type { ScanChartPoint } from "../../types";
import { strings } from "../../constants/strings";
import { formatDate, formatDateShort } from "../../utils/date";
import { styles } from "../../styles/analytics/ScanLineChart.styles";

interface ScanLineChartProps {
  data?: ScanChartPoint[];
  loading?: boolean;
}

export default function ScanLineChart({ data, loading }: ScanLineChartProps) {
  const points = data ?? [];
  
  const isRefreshing = loading && points.length > 0;

  return (
    <Card
      title={strings.dashboard.scanDynamics}
      extra={isRefreshing ? <Spin size="small" /> : undefined}
      className="mb-6"
    >
      {loading && points.length === 0 ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : points.length === 0 ? (
        <Empty description="Bu dövrdə skan yoxdur" style={styles.empty} />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={points}
            margin={{ top: 26, right: 24, left: 4, bottom: 24 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#eef0f2"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateShort}
              interval="preserveStartEnd"
              minTickGap={24}
              tick={{ fontSize: 11, fill: "#667085" }}
              tickMargin={8}
              label={{
                value: "Tarix",
                position: "insideBottom",
                offset: -14,
                fontSize: 12,
                fill: "#98a2b3",
              }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#667085" }}
              label={{
                value: "Skan sayı",
                angle: -90,
                position: "insideLeft",
                fontSize: 12,
                fill: "#98a2b3",
              }}
            />
            <Tooltip
              labelFormatter={(l: string) => formatDate(l)}
              formatter={(value: number) => [value, "Skan sayı"]}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#1e63d6"
              strokeWidth={2.5}
              fill="#1e63d6"
              fillOpacity={0.1}
              dot={{ r: 4, fill: "#1e63d6", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                dataKey="count"
                position="top"
                offset={10}
                style={styles.label}
              />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
