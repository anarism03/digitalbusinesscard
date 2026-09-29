import { Alert, Button, Card, Upload } from "antd";
import type { UploadFile } from "antd";
import type { ImportResult } from "../../../../types";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { styles } from "../../../../styles/company-admin/ExcelImportCard.styles";

interface ExcelImportCardProps {
  companyLimit?: number;
  fileList: UploadFile[];
  importLoading: boolean;
  importResult: ImportResult | null;
  limitReached: boolean;
  canImport: boolean;
  templateLoading: boolean;
  setFileList: (files: UploadFile[]) => void;
  setImportResult: (result: ImportResult | null) => void;
  onImport: () => void;
  onTemplateDownload: () => void;
}

export default function ExcelImportCard({
  companyLimit,
  fileList,
  importLoading,
  importResult,
  limitReached,
  canImport,
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
          Excel idxalı
        </span>
      }
    >
      <p style={styles.importText}>
        Əməkdaşları Excel faylından idxal edin. Əvvəlcə şablonu yükləyib
        doldurun.
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
          Fayl seç (.xlsx, .xls)
        </Button>
      </Upload>

      {importResult && (
        <Alert
          style={styles.bottomButton}
          type={
            importResult.created === 0
              ? "error"
              : importResult.failed > 0
                ? "warning"
                : "success"
          }
          icon={
            importResult.created === 0 ? (
              <CloseCircleOutlined />
            ) : (
              <CheckCircleOutlined />
            )
          }
          showIcon
          message={
            importResult.created === 0
              ? `Heç bir əməkdaş idxal edilmədi${importResult.failed > 0 ? ` — ${importResult.failed} xəta` : ""}`
              : `${importResult.created} əməkdaş uğurla idxal edildi${importResult.failed > 0 ? `, ${importResult.failed} xəta` : ""}`
          }
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
          message={`Şirkətiniz əməkdaş limitinə çatıb (Maksimum: ${companyLimit})`}
          description="Limit hesablanarkən aktiv və deaktiv əməkdaşların hamısı nəzərə alınır."
        />
      )}

      <Button
        type="primary"
        icon={<UploadOutlined />}
        loading={importLoading}
        onClick={onImport}
        disabled={fileList.length === 0 || limitReached || !canImport}
        block
      >
        İdxal et
      </Button>
    </Card>
  );
}
