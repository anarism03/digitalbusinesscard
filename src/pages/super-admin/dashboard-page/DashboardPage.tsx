import {
  BankOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
  StopOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic, Table, Tag } from "antd";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../../../components/shared/EmptyState";
import ErrorState from "../../../components/shared/ErrorState";
import LoadingSkeleton from "../../../components/shared/LoadingSkeleton";
import PageHeader from "../../../components/shared/PageHeader";
import AssetAvatar from "../../../components/shared/AssetAvatar";
import { strings } from "../../../constants/strings";
import {
  useCompanies,
  useSuperAdminDashboard,
} from "../../../hooks/useCompanies";
import type { Company } from "../../../types";
import { styles } from "../../../styles/super-admin/DashboardPage.styles";

const MEDAL_COLORS = ["#d4a017", "#9aa0a6", "#c07a3e"];

function MedalIcon({ rank }: { rank: number }) {
  return (
    <TrophyOutlined
      style={{ ...styles.medalIcon, color: MEDAL_COLORS[rank] }}
    />
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useSuperAdminDashboard();
  const { data: allCompanies } = useCompanies();

  const companyLogoById = useMemo(() => {
    const map = new Map<string, string | undefined>();
    (allCompanies ?? []).forEach((company) =>
      map.set(company.id, company.logoUrl),
    );
    return map;
  }, [allCompanies]);

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div>
      <PageHeader title={strings.navigation.dashboard} />

      <Row gutter={[16, 16]} style={styles.statsRow}>
        <Col xs={24} md={8}>
          <Card style={styles.card}>
            <Statistic
              title="Şirkət sayı"
              value={data.companiesCount}
              prefix={<BankOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={styles.card}>
            <Statistic
              title="Aktiv şirkət"
              value={data.activeCompaniesCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={styles.activeValue}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={styles.card}>
            <Statistic
              title="Deaktiv şirkət"
              value={data.inactiveCompaniesCount}
              prefix={<StopOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <span>
            <DatabaseOutlined style={styles.titleIcon} />
            Son şirkətlər
          </span>
        }
        style={styles.card}
      >
        <Table<Company>
          rowKey="id"
          dataSource={data.recentCompanies}
          locale={{ emptyText: <EmptyState description="Son şirkət yoxdur" /> }}
          size="small"
          pagination={false}
          onRow={(record) => ({
            onClick: () => navigate(`/super-admin/companies/${record.id}/edit`),
          })}
          columns={[
            {
              title: "Şirkət",
              key: "company",
              render: (_, row) => (
                <div style={styles.recentCompanyRow}>
                  <AssetAvatar
                    src={row.logoUrl}
                    name={row.name}
                    size={34}
                    shape="square"
                  />
                  <div>
                    <div style={styles.recentCompanyName}>{row.name}</div>
                    <div style={styles.recentCompanyMeta}>
                      {row.voen || "VÖEN yoxdur"}
                    </div>
                  </div>
                </div>
              ),
            },
            { title: "E-poçt", dataIndex: "email", responsive: ["md"] },
            { title: "Telefon", dataIndex: "phone", responsive: ["md"] },
            {
              title: "Limit",
              key: "limit",
              align: "right",
              render: (_, row) => (
                <Tag color="cyan">
                  {row.usedCount ?? 0} / {row.userLimit}
                </Tag>
              ),
            },
          ]}
        />
      </Card>

      <Card
        title={
          <span>
            <TrophyOutlined style={styles.titleIcon} />
            Populyar şirkətlər
          </span>
        }
        style={styles.card}
      >
        {data.topCompaniesByScans.length === 0 ? (
          <EmptyState description="Skan məlumatı yoxdur" />
        ) : (
          data.topCompaniesByScans.map((row, index) => (
            <div
              key={row.companyId}
              style={
                index === 0
                  ? { ...styles.topRow, ...styles.topRowFirst }
                  : styles.topRow
              }
              onClick={() =>
                navigate(`/super-admin/companies/${row.companyId}/edit`)
              }
            >
              {index < 3 ? (
                <MedalIcon rank={index} />
              ) : (
                <span style={styles.rankNumber}>{index + 1}</span>
              )}
              <AssetAvatar
                src={row.logoUrl ?? companyLogoById.get(row.companyId)}
                name={row.companyName}
                size={30}
                shape="square"
                style={styles.topAvatar}
              />
              <span
                style={
                  index === 0
                    ? { ...styles.topName, ...styles.topNameFirst }
                    : styles.topName
                }
              >
                {row.companyName}
              </span>
              {!row.isActive && (
                <span style={styles.topInactivePill}>Deaktiv</span>
              )}
              <span style={styles.topCount}>{row.scanCount}</span>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
