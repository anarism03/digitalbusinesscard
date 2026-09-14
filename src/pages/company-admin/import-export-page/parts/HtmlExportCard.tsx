import { Button, Card, Select, Space } from "antd";
import { DownloadOutlined, GlobalOutlined } from "@ant-design/icons";
import { styles } from "../../../../styles/company-admin/ImportExportPage.styles";
import type { EmployeeOption } from "../../../../types";

interface HtmlExportCardProps {
  employeeOptions: EmployeeOption[];
  employeesLoading: boolean;
  htmlLoading: boolean;
  page: number;
  pageSize: number;
  selectedHtmlIds: string[];
  selectedHtmlLoading: boolean;
  totalCount: number;
  goToPage: (page: number) => void;
  setSelectedHtmlIds: (ids: string[]) => void;
  onAllDownload: () => void;
  onSelectedDownload: () => void;
}

export function HtmlExportCard({
  employeeOptions,
  employeesLoading,
  htmlLoading,
  page,
  pageSize,
  selectedHtmlIds,
  selectedHtmlLoading,
  totalCount,
  goToPage,
  setSelectedHtmlIds,
  onAllDownload,
  onSelectedDownload,
}: HtmlExportCardProps) {
  const pageCount = Math.ceil(totalCount / pageSize);

  return (
    <Card
      title={
        <span style={styles.cardTitle}>
          <GlobalOutlined style={styles.excelIcon} />
          Offline HTML export
        </span>
      }
    >
      <Button
        icon={<DownloadOutlined />}
        loading={htmlLoading}
        onClick={onAllDownload}
        block
      >
        Bütün əməkdaşları HTML yüklə
      </Button>

      <Select
        mode="multiple"
        allowClear
        showSearch
        options={employeeOptions}
        value={selectedHtmlIds}
        onChange={setSelectedHtmlIds}
        placeholder="Seçilmiş əməkdaşlar"
        style={styles.select}
        optionFilterProp="label"
        loading={employeesLoading}
      />
      {totalCount > pageSize && (
        <div style={styles.pageControls}>
          <span>
            Səhifə {page} / {pageCount} (Cəmi {totalCount})
          </span>
          <Space size="small">
            <Button
              size="small"
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
            >
              Əvvəlki
            </Button>
            <Button
              size="small"
              disabled={page >= pageCount}
              onClick={() => goToPage(page + 1)}
            >
              Növbəti
            </Button>
          </Space>
        </div>
      )}
      <Button
        icon={<DownloadOutlined />}
        loading={selectedHtmlLoading}
        disabled={!selectedHtmlIds.length}
        onClick={onSelectedDownload}
        style={styles.topButton}
        block
      >
        Seçilmişləri HTML yüklə ({selectedHtmlIds.length})
      </Button>
    </Card>
  );
}
