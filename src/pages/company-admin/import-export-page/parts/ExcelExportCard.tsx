import { Button, Card, Select } from "antd";
import { DownloadOutlined, FileExcelOutlined } from "@ant-design/icons";
import { strings } from "../../../../constants/strings";
import { styles } from "../../../../styles/company-admin/ImportExportPage.styles";
import type { EmployeeOption } from "../../../../types";

const s = strings.importExport;

interface ExcelExportCardProps {
  employeeOptions: EmployeeOption[];
  employeesLoading: boolean;
  excelLoading: boolean;
  selectedExcelIds: string[];
  selectedExcelLoading: boolean;
  setSelectedExcelIds: (ids: string[]) => void;
  onAllDownload: () => void;
  onSelectedDownload: () => void;
}

export function ExcelExportCard({
  employeeOptions,
  employeesLoading,
  excelLoading,
  selectedExcelIds,
  selectedExcelLoading,
  setSelectedExcelIds,
  onAllDownload,
  onSelectedDownload,
}: ExcelExportCardProps) {
  return (
    <Card
      title={
        <span style={styles.cardTitle}>
          <FileExcelOutlined style={styles.excelIcon} />
          {s.exportSection}
        </span>
      }
    >
      <p style={styles.sectionText}>{s.exportHint}</p>
      <Button
        type="primary"
        icon={<DownloadOutlined />}
        loading={excelLoading}
        onClick={onAllDownload}
        block
      >
        Bütün əməkdaşları Excel yüklə
      </Button>

      <Select
        mode="multiple"
        allowClear
        showSearch
        options={employeeOptions}
        value={selectedExcelIds}
        onChange={setSelectedExcelIds}
        placeholder="Seçilmiş əməkdaşlar"
        style={styles.select}
        optionFilterProp="label"
        loading={employeesLoading}
      />
      <Button
        icon={<DownloadOutlined />}
        loading={selectedExcelLoading}
        disabled={!selectedExcelIds.length}
        onClick={onSelectedDownload}
        style={styles.topButton}
        block
      >
        Seçilmişləri Excel yüklə ({selectedExcelIds.length})
      </Button>
    </Card>
  );
}
