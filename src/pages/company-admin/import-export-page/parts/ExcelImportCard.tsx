import { Alert, Button, Card, Upload } from "antd";
import type { UploadFile } from "antd";
import {
  CheckCircleOutlined,
  DownloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { styles } from "../../../../styles/company-admin/ImportExportPage.styles";

interface ExcelImportCardProps {
  companyLimit?: number;
  fileList: UploadFile[];
  importLoading: boolean;
  importResult: { created: number; failed: number; errors: string[] } | null;
  limitReached: boolean;
  templateLoading: boolean;
  setFileList: (files: UploadFile[]) => void;
  setImportResult: (
    result: { created: number; failed: number; errors: string[] } | null,
  ) => void;
  onImport: () => void;
  onTemplateDownload: () => void;
}

export function ExcelImportCard({
  companyLimit,
  fileList,
  importLoading,
  importResult,
  limitReached,
  templateLoading,
  setFileList,
  setImportResult,
  onImport,
  onTemplateDownload,
}: ExcelImportCardProps) {
  return (
    <Card
      title={
        <span style={styles.cardTitle}>
          <UploadOutlined style={styles.importIcon} />
          Excel İdxal
        </span>
      }
    >
      <p style={styles.importText}>
        Əməkdaşları Excel faylından idxal et. Əvvəlcə şablonu yüklə,
        dolduraraq göndər.
      </p>
      <Button
        icon={<DownloadOutlined />}
        loading={templateLoading}
        onClick={onTemplateDownload}
        style={styles.bottomButton}
        block
      >
        İdxal şablonunu yüklə
      </Button>
      <Upload
        accept=".xlsx,.xls"
        fileList={fileList}
        beforeUpload={() => false}
        onChange={({ fileList: fl }) => {
          setFileList(fl.slice(-1));
          setImportResult(null);
        }}
        maxCount={1}
        className="upload-block"
      >
        <Button icon={<UploadOutlined />} block style={styles.bottomButton}>
          Fayl seç (.xlsx)
        </Button>
      </Upload>

      {importResult && (
        <Alert
          style={styles.bottomButton}
          type={importResult.failed > 0 ? "warning" : "success"}
          icon={<CheckCircleOutlined />}
          showIcon
          message={`${importResult.created} əməkdaş uğurla idxal edildi${importResult.failed > 0 ? `, ${importResult.failed} xəta` : ""}`}
          description={
            importResult.errors.length > 0 ? (
              <ul style={styles.errorList}>
                {importResult.errors.slice(0, 5).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            ) : undefined
          }
        />
      )}

      {limitReached && (
        <Alert
          type="warning"
          showIcon
          style={styles.bottomButton}
          message={`Şirkətiniz üçün əməkdaş limiti aşılıb (Maksimum: ${companyLimit})`}
          description="Limit hesablanarkən aktiv və deaktiv əməkdaşların hamısı nəzərə alınır."
        />
      )}

      <Button
        type="primary"
        icon={<UploadOutlined />}
        loading={importLoading}
        onClick={onImport}
        disabled={fileList.length === 0 || limitReached}
        block
      >
        İdxal et
      </Button>
    </Card>
  );
}
