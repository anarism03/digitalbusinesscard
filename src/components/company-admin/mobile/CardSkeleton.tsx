import { Skeleton } from "antd";
import type { CSSProperties } from "react";

const containerStyle = {
  width: "min(100%, 384px)",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: 0,
  background: "#fff",
  overflow: "hidden",
} satisfies CSSProperties;

export default function CardSkeleton() {
  return (
    <div className="premium-card-skeleton" style={containerStyle}>
      <div
        className="premium-card-skeleton-cover"
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: 0,
          background: "#eef0f3",
        }}
      />
      <div
        className="premium-card-skeleton-avatar"
        style={{
          marginTop: -44,
          width: 110,
          height: 110,
          borderRadius: "50%",
          background: "#e2e5ea",
          border: "4px solid #fff",
          boxShadow: "0 2px 10px rgba(16,24,40,0.1)",
        }}
      />
      <Skeleton.Input active size="small" style={{ marginTop: 10, width: 150, height: 18 }} />
      <Skeleton.Input active size="small" style={{ marginTop: 6, width: 100, height: 13 }} />

      <div style={{ width: "100%", marginTop: 14, padding: "0 16px 24px" }}>
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            className="premium-card-skeleton-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "#f3f4f6",
              borderRadius: 14,
              padding: "8px 12px",
              marginBottom: 8,
            }}
          >
            <Skeleton.Avatar active size={30} shape="square" style={{ borderRadius: 9 }} />
            <Skeleton.Input active size="small" style={{ flex: 1, height: 14 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
