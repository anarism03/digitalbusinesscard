import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Input, Skeleton } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  useCompanies,
  useSetCompanyActive,
  useSetCompanyLimit,
} from "../../../hooks/useCompanies";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import PageHeader from "../../../components/shared/PageHeader";
import EmptyState from "../../../components/shared/EmptyState";
import ErrorState from "../../../components/shared/ErrorState";
import InfiniteScrollTrigger from "../../../components/shared/InfiniteScrollTrigger";
import CompanyCard from "./parts/CompanyCard";
import CompanyLimitModal from "./modals/CompanyLimitModal";
import { strings } from "../../../constants/strings";
import { companiesService } from "../../../services/companies.service";
import { mapCompanyPage } from "../../../utils/mappers";
import type { Company } from "../../../types";
import { styles } from "../../../styles/super-admin/CompaniesPage.styles";

const s = strings.companies;
const SKELETON_CARD_COUNT = 3;
const PAGE_SIZE = 10;

export default function CompaniesPage() {
  const navigate = useNavigate();

  const [limitModal, setLimitModal] = useState<{
    open: boolean;
    company: Company | null;
  }>({ open: false, company: null });
  const [newLimit, setNewLimit] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const isSearching = searchQuery.trim().length > 0;

  const {
    items: pagedCompanies,
    isLoading: pagedLoading,
    isLoadingMore,
    isError: pagedError,
    hasMore,
    sentinelRef,
    refetch: refetchPaged,
  } = useInfiniteScroll<Company>(
    (page) => companiesService.getAll(page, PAGE_SIZE).then(mapCompanyPage),
    [],
  );
  const {
    data: allCompanies,
    isLoading: allLoading,
    isError: allError,
    refetch: refetchAll,
  } = useCompanies(isSearching);
  const setLimit = useSetCompanyLimit();
  const setActive = useSetCompanyActive();

  const isLoading = isSearching ? allLoading : pagedLoading;
  const isError = isSearching ? allError : pagedError;
  const refetch = isSearching ? refetchAll : refetchPaged;
  const refreshPagedCompanies = () => {
    if (!isSearching) void refetchPaged();
  };

  const sortedCompanies = useMemo(() => {
    const companies = isSearching ? (allCompanies ?? []) : pagedCompanies;
    const query = searchQuery.trim().toLowerCase();
    return [...companies]
      .filter((c) => !query || c.name.toLowerCase().includes(query))
      .sort((a, b) =>
        a.name.localeCompare(b.name, "az", { sensitivity: "base" }),
      );
  }, [isSearching, allCompanies, pagedCompanies, searchQuery]);

  const openLimitModal = (company: Company) => {
    setNewLimit(company.userLimit);
    setLimitModal({ open: true, company });
  };

  const handleSetLimit = () => {
    if (!limitModal.company) return;
    setLimit.mutate(
      { id: limitModal.company.id, limit: newLimit },
      {
        onSuccess: refreshPagedCompanies,
        onSettled: () => setLimitModal({ open: false, company: null }),
      },
    );
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

      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        allowClear
        placeholder="Şirkət adı üzrə axtar"
        prefix={<SearchOutlined style={styles.searchIcon} />}
        size="large"
        style={styles.searchInput}
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
                  setActive.mutate(
                    { id: company.id, isActive: !company.isActive },
                    { onSuccess: refreshPagedCompanies },
                  )
                }
                onChangeLimit={openLimitModal}
                toggleActiveLoading={setActive.isPending}
              />
            ))}
          </div>

          <InfiniteScrollTrigger
            sentinelRef={sentinelRef}
            isLoadingMore={isLoadingMore}
            hasMore={!isSearching && hasMore}
          />
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
