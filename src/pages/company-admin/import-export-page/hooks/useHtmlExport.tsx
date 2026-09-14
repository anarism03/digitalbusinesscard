import { useState } from "react";
import { exportImportService } from "../../../../services/exportImport.service";
import { strings } from "../../../../constants/strings";
import { message } from "../../../../utils/feedback";
import { isZipBlob, triggerBlobDownload } from "../../../../utils/download";

export function useHtmlExport(companyId: string) {
  const [selectedHtmlIds, setSelectedHtmlIds] = useState<string[]>([]);
  const [htmlLoading, setHtmlLoading] = useState(false);
  const [selectedHtmlLoading, setSelectedHtmlLoading] = useState(false);

  const handleHtmlDownload = async () => {
    if (!companyId) return message.error("Şirkət ID tapılmadı");
    setHtmlLoading(true);
    try {
      const blob = await exportImportService.downloadCompanyHtml(companyId);
      const extension = (await isZipBlob(blob)) ? "zip" : "html";
      triggerBlobDownload(blob, `butun-vizitkartlar.${extension}`);
      message.success("Offline HTML uğurla yükləndi");
    } catch {
      message.error(strings.errors.generic);
    } finally {
      setHtmlLoading(false);
    }
  };

  const handleSelectedHtmlDownload = async () => {
    if (!selectedHtmlIds.length) {
      return message.warning("Ən azı bir əməkdaş seçin");
    }
    setSelectedHtmlLoading(true);
    try {
      const blob =
        selectedHtmlIds.length === 1
          ? await exportImportService.downloadUserHtml(selectedHtmlIds[0])
          : await exportImportService.downloadSelectedHtml(selectedHtmlIds);
      const extension = (await isZipBlob(blob)) ? "zip" : "html";
      const fileName =
        selectedHtmlIds.length === 1
          ? `${selectedHtmlIds[0]}.${extension}`
          : `secilmis-vizitkartlar.${extension}`;
      triggerBlobDownload(blob, fileName);
      message.success("Seçilmiş vizitkartlar HTML kimi yükləndi");
    } catch {
      message.error(strings.errors.generic);
    } finally {
      setSelectedHtmlLoading(false);
    }
  };

  return {
    selectedHtmlIds,
    setSelectedHtmlIds,
    htmlLoading,
    selectedHtmlLoading,
    handleHtmlDownload,
    handleSelectedHtmlDownload,
  };
}
