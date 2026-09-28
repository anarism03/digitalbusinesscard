import { Fragment, useMemo, useState } from "react";
import { Card, Switch } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { employeesService } from "../../../services/employees.service";
import { useSetEmployeeCanEdit } from "../../../hooks/useEmployees";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import { useAppSelector } from "../../../store/hooks";
import PageHeader from "../../../components/shared/PageHeader";
import EmptyState from "../../../components/shared/EmptyState";
import ErrorState from "../../../components/shared/ErrorState";
import AssetAvatar from "../../../components/shared/AssetAvatar";
import InfiniteScrollTrigger from "../../../components/shared/InfiniteScrollTrigger";
import CompanySettingsCard from "./parts/CompanySettingsCard";
import { strings } from "../../../constants/strings";
import { SIZES } from "../../../constants/ui";
import { mapEmployeePage } from "../../../utils/mappers";
import type { Employee } from "../../../types";
import { styles } from "../../../styles/company-admin/SettingsPage.styles";

export default function SettingsPage() {
  const user = useAppSelector((s) => s.auth.user);
  const companyId = user?.companyId ?? "";

  const {
    items: employees,
    totalCount,
    isLoading,
    isLoadingMore,
    isError,
    hasMore,
    sentinelRef,
    refetch,
  } = useInfiniteScroll<Employee>(
    (page) =>
      employeesService
        .getByCompany(companyId, page, SIZES.tablePageSize)
        .then(mapEmployeePage),
    [companyId],
  );
  const setCanEdit = useSetEmployeeCanEdit();
  const usedCount = isLoading ? null : totalCount;

  const sortedEmployees = useMemo(
    () =>
      [...employees].sort((a, b) => {
        if (a.id === user?.id) return -1;
        if (b.id === user?.id) return 1;
        return 0;
      }),
    [employees, user?.id],
  );

  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [pendingId, setPendingId] = useState<string | null>(null);

  const clearOverride = (id: string) =>
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

  const handleToggle = (id: string, checked: boolean) => {
    setPendingId(id);
    setOverrides((prev) => ({ ...prev, [id]: checked }));
    setCanEdit.mutate(
      { id, canEdit: checked },
      {
        onError: () => clearOverride(id),
        onSettled: () => setPendingId(null),
      },
    );
  };

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div>
      <PageHeader title={strings.settings.title} />

      <CompanySettingsCard usedCount={usedCount} />

      <Card
        style={styles.card}
        title={
          <span style={styles.cardTitle}>
            <span style={styles.cardTitleIconBadge}>
              <EditOutlined style={styles.cardTitleIcon} />
            </span>
            Əməkdaş redaktə icazələri
          </span>
        }
      >
        <p style={styles.hint}>
          İcazəsi olan əməkdaş öz vizitkart məlumatlarını redaktə edə bilər.
        </p>

        {sortedEmployees.length === 0 && !isLoading ? (
          <EmptyState description={strings.employees.empty} />
        ) : (
          <div style={styles.tableGrid}>
            <span
              style={{
                ...styles.tableHeaderCell,
                ...styles.tableHeaderCellFirst,
              }}
            >
              Əməkdaş
            </span>
            <span
              style={{
                ...styles.tableHeaderCell,
                ...styles.tableHeaderCenter,
                ...styles.tableHeaderCellLast,
              }}
            >
              İcazə
            </span>

            {sortedEmployees.map((row, idx) => {
              const isLastRow = idx === sortedEmployees.length - 1;
              const cellStyle = isLastRow
                ? { ...styles.tableCell, borderBottom: "none" }
                : styles.tableCell;
              return (
                <Fragment key={row.id}>
                  <div style={{ ...cellStyle, ...styles.tableCellFirst }}>
                    <div style={styles.employeeRow}>
                      <AssetAvatar
                        src={row.photoUrl}
                        name={row.fullName}
                        size={34}
                        style={styles.employeeAvatar}
                      />
                      <div style={styles.employeeTextCol}>
                        <div
                          className="settings-scroll-text"
                          style={styles.employeeName}
                        >
                          {row.fullName}
                        </div>
                        <div
                          className="settings-scroll-text"
                          style={styles.employeeEmail}
                        >
                          {row.email}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ ...cellStyle, ...styles.tableCellLast }}>
                    <div style={styles.tableCellCenter}>
                      {row.id === user?.id ? (
                        <span style={styles.adminPill}>Admin</span>
                      ) : (
                        <Switch
                          checked={overrides[row.id] ?? row.canEdit ?? false}
                          loading={pendingId === row.id}
                          onChange={(checked) => handleToggle(row.id, checked)}
                        />
                      )}
                    </div>
                  </div>
                </Fragment>
              );
            })}
          </div>
        )}
        {isLoading && employees.length === 0 && (
          <p style={styles.hint}>Yüklənir...</p>
        )}

        {totalCount > 0 && (
          <p style={styles.tableFooter}>
            {strings.common.total} {totalCount} əməkdaş
          </p>
        )}

        <InfiniteScrollTrigger
          sentinelRef={sentinelRef}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
        />
      </Card>
    </div>
  );
}
