import { useState } from "react";
import type { UploadFile } from "antd";
import { exportImportService } from "../../../../services/exportImport.service";
import { EMPLOYEES_QUERY_KEY } from "../../../../hooks/useEmployees";
import { invalidate } from "../../../../hooks/useApi";
import { strings } from "../../../../constants/strings";
import { showApiError } from "../../../../utils/apiError";
import { triggerBlobDownload } from "../../../../utils/download";
import { message } from "../../../../utils/feedback";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function toErrorRowMessages(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    if (typeof item === "string") return item;
    const row = asRecord(item);
    const reason = row.reason ?? row.message ?? row.error ?? "";
    const rowNumber = row.row ?? row.rowNumber ?? row.index;
    return rowNumber != null ? `Sətir ${rowNumber}: ${reason}` : String(reason);
  });
}

export function useExcelImport(
  companyId: string,
  limitReached: boolean,
  companyLimit?: number,
) {
  const [templateLoading, setTemplateLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [importResult, setImportResult] = useState<{
    created: number;
    failed: number;
    errors: string[];
  } | null>(null);

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
        `Şirkətiniz üçün əməkdaş limiti aşılıb (Maksimum: ${companyLimit})`,
      );
    }
    const file = fileList[0]?.originFileObj;
    if (!file) return message.error("Zəhmət olmasa fayl seçin");

    setImportLoading(true);
    setImportResult(null);
    try {
      const res = await exportImportService.importExcel(companyId, file);
      const body = asRecord(res);
      const created =
        body.created ??
        body.createdCount ??
        body.successCount ??
        body.count ??
        null;
      const errorRows = toErrorRowMessages(body.errorRows);
      const failed =
        body.failed ?? body.failedCount ?? body.errorCount ?? errorRows.length;
      const errors = errorRows.length
        ? errorRows
        : toStringArray(body.errors).length
          ? toStringArray(body.errors)
          : toStringArray(body.messages);
      setFileList([]);
      invalidate(EMPLOYEES_QUERY_KEY);

      if (created !== null) {
        setImportResult({
          created: Number(created),
          failed: Number(failed),
          errors,
        });
        message.success(
          `${created} əməkdaş idxal edildi${failed ? `, ${failed} xəta` : ""}`,
        );
      } else {
        message.success("İdxal uğurla tamamlandı");
      }
    } catch (err: unknown) {
      showApiError(err);
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
