import {
  DownloadOutlined,
  FileExcelOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Button, Card, Select } from "antd";
import { strings } from "../../../../constants/strings";
import type { EmployeeOption } from "../../../../types";

interface ExportCardProps {
  format: "excel" | "html";
  employeeOptions: EmployeeOption[];
  employeesLoading: boolean;
  employeesError: boolean;
  loading: boolean;
  selectedIds: string[];
  selectedLoading: boolean;
  onSelectionChange: (ids: string[]) => void;
  onAllDownload: () => void;
  onSelectedDownload: () => void;
}

export default function ExportCard({
  format,
  employeeOptions,
  employeesLoading,
  employeesError,
  loading,
  selectedIds,
  selectedLoading,
  onSelectionChange,
  onAllDownload,
  onSelectedDownload,
}: ExportCardProps) {
  const isExcel = format === "excel";
  const Icon = isExcel ? FileExcelOutlined : GlobalOutlined;
  const title = isExcel ? "Excel ixracı (.xlsx)" : "Oflayn HTML ixracı";
  const allLabel = isExcel
    ? "Bütün əməkdaşları Excel formatında yüklə"
    : "Bütün vizitkartları HTML formatında yüklə";
  const selectedLabel = `Seçilmişləri ${isExcel ? "Excel" : "HTML"} formatında yüklə (${selectedIds.length})`;

  return (
    <Card
      title={
        <span className="import-export-card-title">
          <Icon />
          {title}
        </span>
      }
    >
      {isExcel && (
        <p className="import-export-hint">{strings.importExport.exportHint}</p>
      )}
      <Button
        className="import-export-action-button"
        type={isExcel ? "primary" : "default"}
        icon={<DownloadOutlined />}
        loading={loading}
        onClick={onAllDownload}
        block
      >
        {allLabel}
      </Button>

      <Select
        className="import-export-select"
        mode="multiple"
        allowClear
        showSearch
        options={employeeOptions}
        value={selectedIds}
        onChange={onSelectionChange}
        placeholder="Seçilmiş əməkdaşlar"
        optionFilterProp="label"
        loading={employeesLoading}
        disabled={employeesLoading || employeesError}
      />
      <Button
        className="import-export-action-button import-export-selected-button"
        icon={<DownloadOutlined />}
        loading={selectedLoading}
        disabled={!selectedIds.length || employeesLoading || employeesError}
        onClick={onSelectedDownload}
        block
      >
        {selectedLabel}
      </Button>
    </Card>
  );
}
