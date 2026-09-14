import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, Table, Switch, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import { useEmployeesPage, useSetEmployeeCanEdit } from "../../../hooks/useEmployees";
import { useAppSelector } from "../../../store/hooks";
import PageHeader from "../../../components/shared/PageHeader";
import EmptyState from "../../../components/shared/EmptyState";
import ErrorState from "../../../components/shared/ErrorState";
import AssetAvatar from "../../../components/shared/AssetAvatar";
import CompanySettingsCard from "./parts/CompanySettingsCard";
import { strings } from "../../../constants/strings";
import { SIZES } from "../../../constants/ui";
import { readPositiveInt, updateSearchParams } from "../../../utils/urlSearch";
import type { Employee } from "../../../types";
import { styles } from "../../../styles/company-admin/SettingsPage.styles";

export default function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = readPositiveInt(searchParams.get("page"), 1);
  const pageSize = readPositiveInt(
    searchParams.get("pageSize"),
    SIZES.tablePageSize,
  );
  const user = useAppSelector((s) => s.auth.user);
  const companyId = user?.companyId ?? "";

  const {
    data: pageData,
    isLoading,
    isError,
    refetch,
  } = useEmployeesPage(companyId, page, pageSize);
  const employees = pageData?.items ?? [];
  const totalCount = pageData?.totalCount ?? employees.length;
  const setCanEdit = useSetEmployeeCanEdit();
  const usedCount = isLoading ? null : totalCount;

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
        onSuccess: () => undefined,
        onError: () => clearOverride(id),
        onSettled: () => setPendingId(null),
      },
    );
  };

  const columns: ColumnsType<Employee> = [
    {
      title: "Əməkdaş",
      key: "name",
      render: (_, row) => (
        <div style={styles.employeeRow}>
          <AssetAvatar
            src={row.photoUrl}
            name={row.fullName}
            size={32}
          />
          <div>
            <div style={styles.employeeName}>{row.fullName}</div>
            <div style={styles.employeeEmail}>{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 90,
      responsive: ["md"],
      render: (_, row) =>
        row.isActive ? <Tag color="success">Aktiv</Tag> : <Tag>Deaktiv</Tag>,
    },
    {
      title: "Redaktə icazəsi",
      key: "canEdit",
      width: 140,
      align: "center",
      render: (_, row) =>
        row.id === user?.id ? (
          <Tag color="geekblue">Admin</Tag>
        ) : (
          <Switch
            checked={overrides[row.id] ?? row.canEdit ?? false}
            loading={pendingId === row.id}
            onChange={(checked) => handleToggle(row.id, checked)}
            checkedChildren="Var"
            unCheckedChildren="Yox"
          />
        ),
    },
  ];

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div>
      <PageHeader title={strings.settings.title} />

      <CompanySettingsCard usedCount={usedCount} />

      <Card
        title={
          <span style={styles.cardTitle}>
            <EditOutlined style={styles.cardTitleIcon} />
            Əməkdaş redaktə icazələri
          </span>
        }
      >
        <p style={styles.hint}>
          İcazəsi olan əməkdaş öz vizitkart məlumatlarını redaktə edə bilər.
        </p>
        <Table
          dataSource={employees}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          size="small"
          locale={{
            emptyText: <EmptyState description={strings.employees.empty} />,
          }}
          pagination={{
            current: page,
            pageSize,
            total: totalCount,
            size: "default",
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (t) => `${strings.common.total}: ${t}`,
            onChange: (nextPage, nextPageSize) =>
              setSearchParams((current) =>
                updateSearchParams(current, {
                  page: nextPage,
                  pageSize: nextPageSize,
                }),
              ),
          }}
        />
      </Card>
    </div>
  );
}
