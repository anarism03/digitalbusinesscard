import { useState } from "react";
import { exportImportService } from "../../../../services/exportImport.service";
import { strings } from "../../../../constants/strings";
import { message } from "../../../../utils/feedback";
import { triggerBlobDownload } from "../../../../utils/download";

const s = strings.importExport;

export function useExcelExport(companyId: string) {
  const [selectedExcelIds, setSelectedExcelIds] = useState<string[]>([]);
  const [excelLoading, setExcelLoading] = useState(false);
  const [selectedExcelLoading, setSelectedExcelLoading] = useState(false);

  const handleExcelDownload = async () => {
    if (!companyId) return message.error("Şirkət ID tapılmadı");
    setExcelLoading(true);
    try {
      const blob = await exportImportService.downloadExcel(companyId);
      triggerBlobDownload(blob, "emekdaslar.xlsx");
      message.success(s.exportSuccess);
    } catch {
      message.error(strings.errors.generic);
    } finally {
      setExcelLoading(false);
    }
  };

  const handleSelectedExcelDownload = async () => {
    if (!selectedExcelIds.length) {
      return message.warning("Ən azı bir əməkdaş seçin");
    }
    setSelectedExcelLoading(true);
    try {
      const blob =
        await exportImportService.downloadSelectedExcel(selectedExcelIds);
      triggerBlobDownload(blob, "secilmis-emekdaslar.xlsx");
      message.success("Seçilmiş əməkdaşlar Excel kimi yükləndi");
    } catch {
      message.error(strings.errors.generic);
    } finally {
      setSelectedExcelLoading(false);
    }
  };

  return {
    selectedExcelIds,
    setSelectedExcelIds,
    excelLoading,
    selectedExcelLoading,
    handleExcelDownload,
    handleSelectedExcelDownload,
  };
}
