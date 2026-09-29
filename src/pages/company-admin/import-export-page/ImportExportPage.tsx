import { Alert, Button, Col, Row } from "antd";
import PageHeader from "../../../components/shared/PageHeader";
import { useImportExportPage } from "./hooks/useImportExportPage";
import ExcelImportCard from "./parts/ExcelImportCard";
import ExportCard from "./parts/ExportCard";
import "../../../styles/company-admin/ImportExportPage.css";

export default function ImportExportPage() {
  const page = useImportExportPage();

  return (
    <div className="import-export-page">
      <PageHeader title="İdxal və ixrac" />

      {page.employeesError && (
        <Alert
          type="error"
          showIcon
          message="Əməkdaş siyahısı yüklənmədi"
          description="Seçilmiş əməkdaşları ixrac etmək üçün siyahını yenidən yükləyin."
          action={
            <Button size="small" onClick={() => void page.refetchEmployees()}>
              Yenidən cəhd et
            </Button>
          }
        />
      )}

      {page.companyError && (
        <Alert
          type="error"
          showIcon
          message="Şirkət məlumatları yüklənmədi"
          description="İdxal üçün əməkdaş limitini yoxlamaq mümkün olmadı."
          action={
            <Button size="small" onClick={() => void page.refetchCompany()}>
              Yenidən cəhd et
            </Button>
          }
        />
      )}

      <Row gutter={[16, 16]}>
        <Col
          span={24}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <ExportCard
            format="excel"
            employeeOptions={page.employeeOptions}
            employeesLoading={page.employeesLoading}
            employeesError={page.employeesError}
            loading={page.excelLoading}
            selectedIds={page.selectedExcelIds}
            selectedLoading={page.selectedExcelLoading}
            onSelectionChange={page.setSelectedExcelIds}
            onAllDownload={page.handleExcelDownload}
            onSelectedDownload={page.handleSelectedExcelDownload}
          />
          <ExcelImportCard
            companyLimit={page.company?.userLimit}
            fileList={page.fileList}
            importLoading={page.importLoading}
            importResult={page.importResult}
            limitReached={page.limitReached}
            canImport={page.canImport}
            templateLoading={page.templateLoading}
            setFileList={page.setFileList}
            setImportResult={page.setImportResult}
            onImport={page.handleImport}
            onTemplateDownload={page.handleTemplateDownload}
          />
        </Col>

        <Col span={24}>
          <ExportCard
            format="html"
            employeeOptions={page.employeeOptions}
            employeesLoading={page.employeesLoading}
            employeesError={page.employeesError}
            loading={page.htmlLoading}
            selectedIds={page.selectedHtmlIds}
            selectedLoading={page.selectedHtmlLoading}
            onSelectionChange={page.setSelectedHtmlIds}
            onAllDownload={page.handleHtmlDownload}
            onSelectedDownload={page.handleSelectedHtmlDownload}
          />
        </Col>
      </Row>
    </div>
  );
}
