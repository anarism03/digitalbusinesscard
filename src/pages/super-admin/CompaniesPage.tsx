import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Card, Pagination, Skeleton } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  useCompaniesPage,
  useSetCompanyActive,
  useSetCompanyLimit,
} from "../../hooks/useCompanies";
import PageHeader from "../../components/shared/PageHeader";
import EmptyState from "../../components/shared/EmptyState";
import ErrorState from "../../components/shared/ErrorState";
import CompanyCard from "./parts/CompanyCard";
import CompanyLimitModal from "./parts/CompanyLimitModal";
import { strings } from "../../constants/strings";
import type { Company } from "../../types";
import { styles } from "../../styles/super-admin/CompaniesPage.styles";

const s = strings.companies;
const SKELETON_CARD_COUNT = 3;

export default function CompaniesPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const page = Math.max(Number(params.get("page") || 1), 1);
  const pageSize = Math.max(Number(params.get("pageSize") || 20), 1);

  const [limitModal, setLimitModal] = useState<{
    open: boolean;
    company: Company | null;
  }>({ open: false, company: null });
  const [newLimit, setNewLimit] = useState<number>(0);

  const { data, isLoading, isError, refetch } = useCompaniesPage(
    page,
    pageSize,
  );
  const companies = useMemo(() => data?.items ?? [], [data?.items]);
  const totalCount = data?.totalCount ?? companies.length;
  const setLimit = useSetCompanyLimit();
  const setActive = useSetCompanyActive();

  const sortedCompanies = useMemo(
    () =>
      [...companies].sort((a, b) =>
        a.name.localeCompare(b.name, "az", { sensitivity: "base" }),
      ),
    [companies],
  );

  const openLimitModal = (company: Company) => {
    setNewLimit(company.userLimit);
    setLimitModal({ open: true, company });
  };

  const handleSetLimit = () => {
    if (!limitModal.company) return;
    setLimit.mutate(
      { id: limitModal.company.id, limit: newLimit },
      { onSettled: () => setLimitModal({ open: false, company: null }) },
    );
  };

  const changePage = (nextPage: number, nextPageSize = pageSize) => {
    setParams({ page: String(nextPage), pageSize: String(nextPageSize) });
  };

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div>
      <PageHeader
        title={s.title}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/super-admin/companies/new")}
          >
            {s.createButton}
          </Button>
        }
      />

      {isLoading ? (
        <div style={styles.companyList}>
          {Array.from({ length: SKELETON_CARD_COUNT }, (_, i) => (
            <Card key={i} style={styles.skeletonCard}>
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </Card>
          ))}
        </div>
      ) : sortedCompanies.length === 0 ? (
        <EmptyState description={s.empty} />
      ) : (
        <>
          <div style={styles.companyList}>
            {sortedCompanies.map((c) => (
              <CompanyCard
                key={c.id}
                company={c}
                onEdit={(company) =>
                  navigate(`/super-admin/companies/${company.id}/edit`)
                }
                onToggleActive={(company) =>
                  setActive.mutate({
                    id: company.id,
                    isActive: !company.isActive,
                  })
                }
                onChangeLimit={openLimitModal}
                toggleActiveLoading={setActive.isPending}
              />
            ))}
          </div>

          <div style={styles.paginationWrap}>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={totalCount}
              showSizeChanger
              pageSizeOptions={["10", "20", "50"]}
              onChange={changePage}
            />
          </div>
        </>
      )}

      <CompanyLimitModal
        open={limitModal.open}
        company={limitModal.company}
        value={newLimit}
        loading={setLimit.isPending}
        onChange={setNewLimit}
        onConfirm={handleSetLimit}
        onCancel={() => setLimitModal({ open: false, company: null })}
      />
    </div>
  );
}
