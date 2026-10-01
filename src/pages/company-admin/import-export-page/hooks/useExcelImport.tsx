import { useState } from "react";
import type { UploadFile } from "antd";
import { exportImportService } from "../../../../services/exportImport.service";
import { EMPLOYEES_QUERY_KEY } from "../../../../hooks/useEmployees";
import { invalidate } from "../../../../hooks/useApi";
import { strings } from "../../../../constants/strings";
import { showApiError } from "../../../../utils/apiError";
import { triggerBlobDownload } from "../../../../utils/file";
import { message } from "../../../../utils/feedback";
import { mapImportResult } from "../../../../utils/mappers";
import type { ImportResult } from "../../../../types";

export function useExcelImport(
  companyId: string,
  limitReached: boolean,
  companyLimit?: number,
) {
  const [templateLoading, setTemplateLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const handleTemplateDownload = async () => {
    setTemplateLoading(true);
    try {
      const blob = await exportImportService.downloadTemplate();
      triggerBlobDownload(blob, "import-sablon.xlsx");
      message.success("Şablon uğurla yükləndi");
    } catch {
      message.error(strings.errors.generic);
    } finally {
      setTemplateLoading(false);
    }
  };

  const handleImport = async () => {
    if (!companyId) return message.error("Şirkət ID tapılmadı");
    if (limitReached) {
      return message.error(
        `Şirkətiniz əməkdaş limitinə çatıb (Maksimum: ${companyLimit})`,
      );
    }
    const file = fileList[0]?.originFileObj;
    if (!file) return message.error("Zəhmət olmasa fayl seçin");

    setImportLoading(true);
    setImportResult(null);
    try {
      const result = mapImportResult(
        await exportImportService.importExcel(companyId, file),
      );
      setImportResult(result);
      if (!result) {
        message.error(
          "İdxal nəticəsini təsdiqləmək mümkün olmadı. Yenidən cəhd etməzdən əvvəl əməkdaş siyahısını yoxlayın.",
        );
      } else if (result.created === 0) {
        message.error(
          result.failed > 0
            ? `Heç bir əməkdaş idxal edilmədi: ${result.failed} xəta`
            : "Heç bir əməkdaş idxal edilmədi",
        );
      } else {
        setFileList([]);
        invalidate(EMPLOYEES_QUERY_KEY);
        if (result.failed) {
          message.warning(
            `${result.created} əməkdaş idxal edildi, ${result.failed} xəta`,
          );
        } else {
          message.success(`${result.created} əməkdaş idxal edildi`);
        }
      }
    } catch (error) {
      showApiError(error);
    } finally {
      setImportLoading(false);
    }
  };

  return {
    templateLoading,
    importLoading,
    fileList,
    setFileList,
    importResult,
    setImportResult,
    handleTemplateDownload,
    handleImport,
  };
}
