import { Skeleton } from "antd";
import { styles } from "../../../../styles/company-admin/CardSkeleton.styles";

export default function CardSkeleton() {
  return (
    <div className="premium-card-skeleton" style={styles.container}>
      <div className="premium-card-skeleton-cover" style={styles.cover} />
      <div className="premium-card-skeleton-avatar" style={styles.avatar} />
      <Skeleton.Input active size="small" style={styles.name} />
      <Skeleton.Input active size="small" style={styles.subtitle} />

      <div style={styles.rows}>
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            className="premium-card-skeleton-row"
            style={styles.row}
          >
            <Skeleton.Avatar
              active
              size={30}
              shape="square"
              style={styles.rowIcon}
            />
            <Skeleton.Input active size="small" style={styles.rowText} />
          </div>
        ))}
      </div>
    </div>
  );
}
