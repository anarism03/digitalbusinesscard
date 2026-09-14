import { useCallback } from "react";
import { Button, Pagination, Tabs, Badge, Tooltip, Tag } from "antd";
import { PlusOutlined, CheckOutlined, InboxOutlined } from "@ant-design/icons";
import EmployeeListCard from "./EmployeeListCard";
import EmployeeIdentifiersModal from "../modals/EmployeeIdentifiersModal";
import ResetPasswordModal from "../modals/ResetPasswordModal";
import ResetPasswordSuccessModal from "../modals/ResetPasswordSuccessModal";
import ChangePasswordModal from "../../../employee/parts/ChangePasswordModal";
import ShareProfileSheet from "../../../../components/shared/ShareProfileSheet";
import ConfirmActionModal from "../../../../components/shared/ConfirmActionModal";
import PageHeader from "../../../../components/shared/PageHeader";
import EmptyState from "../../../../components/shared/EmptyState";
import ErrorState from "../../../../components/shared/ErrorState";
import ImagePreviewModal from "../../../../components/shared/ImagePreviewModal";
import LoadingSkeleton from "../../../../components/shared/LoadingSkeleton";
import { strings } from "../../../../constants/strings";
import { useTeamListSection } from "../hooks/useTeamListSection";
import { styles } from "../../../../styles/company-admin/EmployeesPage.styles";

const s = strings.employees;

interface Props {
  onSelectEmployee: (id: string, edit: boolean) => void;
}

export default function TeamListSection({ onSelectEmployee }: Props) {
  const {
    navigate,
    user,
    activeTab,
    page,
    pageSize,
    confirm,
    close,
    previewEmployee,
    setPreviewEmployee,
    shareEmployee,
    setShareEmployee,
    identifiersEmployee,
    setIdentifiersEmployee,
    resetEmployee,
    setResetEmployee,
    resetSuccessPassword,
    setResetSuccessPassword,
    changeOwnPasswordOpen,
    setChangeOwnPasswordOpen,
    changeOwnPassword,
    isLoading,
    isError,
    refetch,
    setActive,
    resetPassword,
    archivedCount,
    limit,
    usedCount,
    limitReached,
    totalCount,
    pageItems,
    setEmployeeParams,
    handleView,
    handleEdit,
    handlePreviewAvatar,
    handleToggleActive,
    handleConfirmToggle,
    handleResetPassword,
    handleDownloadVcf,
    handleChangeOwnPassword,
  } = useTeamListSection(onSelectEmployee);

  const handleOpenChangeOwnPassword = useCallback(() => {
    setChangeOwnPasswordOpen(true);
  }, [setChangeOwnPasswordOpen]);

  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div style={styles.pageRoot}>
      <PageHeader
        title="Komanda"
        extra={
          <div style={styles.headerActions}>
            {limit != null && limit > 0 && (
              <Tag
                color={limitReached ? "error" : "default"}
                style={styles.limitTag}
              >
                {usedCount} / {limit}
              </Tag>
            )}
            <Tooltip
              title={
                limitReached
                  ? `Şirkətiniz üçün əməkdaş limiti aşılıb (Maksimum: ${limit})`
                  : undefined
              }
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                disabled={limitReached}
                onClick={() => navigate("/admin/employees/new")}
              >
                {s.createButton}
              </Button>
            </Tooltip>
          </div>
        }
      />

      <Tabs
        activeKey={activeTab}
        onChange={(key) =>
          setEmployeeParams({ status: key as "active" | "inactive", page: 1 })
        }
        items={[
          {
            key: "active",
            label: (
              <span>
                <CheckOutlined style={styles.tabIcon} />
                {s.tabs.active}
              </span>
            ),
          },
          {
            key: "inactive",
            label: (
              <span>
                <InboxOutlined style={styles.tabIcon} />
                {s.tabs.archive}
                {archivedCount > 0 && (
                  <Badge count={archivedCount} size="small" style={styles.archiveBadge} />
                )}
              </span>
            ),
          },
        ]}
      />

      {activeTab === "inactive" && (
        <div style={styles.archivedHint}>
          <InboxOutlined style={styles.tabIcon} />
          {s.archivedHint}
        </div>
      )}

      <div key={activeTab} className="page-fade" style={styles.listArea}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : pageItems.length === 0 ? (
          <EmptyState description={s.empty} />
        ) : (
          pageItems.map((employee) => (
            <EmployeeListCard
              key={employee.id}
              employee={employee}
              isCurrentUser={employee.id === user?.id}
              onView={handleView}
              onEdit={handleEdit}
              onPreviewAvatar={handlePreviewAvatar}
              onToggleActive={handleToggleActive}
              onShare={setShareEmployee}
              onShowIdentifiers={setIdentifiersEmployee}
              onResetPassword={setResetEmployee}
              onChangeOwnPassword={handleOpenChangeOwnPassword}
              onDownloadVcf={handleDownloadVcf}
            />
          ))
        )}

        {totalCount > 0 && (
          <div style={styles.paginationWrap}>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={totalCount}
              showSizeChanger
              pageSizeOptions={["10", "20", "50"]}
              simple
              size="small"
              onChange={(nextPage, nextPageSize) =>
                setEmployeeParams({ page: nextPage, pageSize: nextPageSize })
              }
            />
          </div>
        )}
      </div>

      <ConfirmActionModal
        open={confirm.open}
        title={
          confirm.targetStatus === "INACTIVE"
            ? strings.common.deactivate
            : strings.common.activate
        }
        message={
          confirm.targetStatus === "INACTIVE" ? s.confirmDeactivate : s.confirmActivate
        }
        loading={setActive.isPending}
        danger={confirm.targetStatus === "INACTIVE"}
        cancelButtonClassName={
          confirm.targetStatus === "ACTIVE" ? "confirm-cancel-button-red" : ""
        }
        onConfirm={handleConfirmToggle}
        onCancel={close}
      />

      <ImagePreviewModal
        open={Boolean(previewEmployee)}
        src={previewEmployee?.photoUrl}
        title={previewEmployee?.fullName}
        onClose={() => setPreviewEmployee(null)}
      />

      {shareEmployee && (
        <ShareProfileSheet
          open={Boolean(shareEmployee)}
          onClose={() => setShareEmployee(null)}
          employee={shareEmployee}
        />
      )}

      <EmployeeIdentifiersModal
        employee={identifiersEmployee}
        onClose={() => setIdentifiersEmployee(null)}
      />

      <ResetPasswordModal
        open={Boolean(resetEmployee)}
        loading={resetPassword.isPending}
        onClose={() => setResetEmployee(null)}
        onReset={handleResetPassword}
      />
      <ResetPasswordSuccessModal
        password={resetSuccessPassword}
        onClose={() => setResetSuccessPassword(null)}
      />

      <ChangePasswordModal
        open={changeOwnPasswordOpen}
        loading={changeOwnPassword.isPending}
        onSubmit={handleChangeOwnPassword}
        onCancel={() => setChangeOwnPasswordOpen(false)}
      />
    </div>
  );
}
