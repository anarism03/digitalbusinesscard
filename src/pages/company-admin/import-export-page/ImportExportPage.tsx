import { Col, Row } from "antd";
import PageHeader from "../../../components/shared/PageHeader";
import { strings } from "../../../constants/strings";
import { styles } from "../../../styles/company-admin/ImportExportPage.styles";
import { useImportExportPage } from "./hooks/useImportExportPage";
import { ExcelExportCard } from "./parts/ExcelExportCard";
import { ExcelImportCard } from "./parts/ExcelImportCard";
import { HtmlExportCard } from "./parts/HtmlExportCard";

const s = strings.importExport;

export default function ImportExportPage() {
  const page = useImportExportPage();

  return (
    <div>
      <PageHeader title={s.title} />

      <Row gutter={[16, 16]}>
        <Col span={24} style={styles.columnStack}>
          <ExcelExportCard
            employeeOptions={page.employeeOptions}
            employeesLoading={page.employeesLoading}
            excelLoading={page.excelLoading}
            selectedExcelIds={page.selectedExcelIds}
            selectedExcelLoading={page.selectedExcelLoading}
            setSelectedExcelIds={page.setSelectedExcelIds}
            onAllDownload={page.handleExcelDownload}
            onSelectedDownload={page.handleSelectedExcelDownload}
          />
          <ExcelImportCard
            companyLimit={page.company?.userLimit}
            fileList={page.fileList}
            importLoading={page.importLoading}
            importResult={page.importResult}
            limitReached={page.limitReached}
            templateLoading={page.templateLoading}
            setFileList={page.setFileList}
            setImportResult={page.setImportResult}
            onImport={page.handleImport}
            onTemplateDownload={page.handleTemplateDownload}
          />
        </Col>

        <Col span={24}>
          <HtmlExportCard
            employeeOptions={page.employeeOptions}
            employeesLoading={page.employeesLoading}
            htmlLoading={page.htmlLoading}
            page={page.page}
            pageSize={page.pageSize}
            selectedHtmlIds={page.selectedHtmlIds}
            selectedHtmlLoading={page.selectedHtmlLoading}
            totalCount={page.totalCount}
            goToPage={page.goToPage}
            setSelectedHtmlIds={page.setSelectedHtmlIds}
            onAllDownload={page.handleHtmlDownload}
            onSelectedDownload={page.handleSelectedHtmlDownload}
          />
        </Col>
      </Row>
    </div>
  );
}
