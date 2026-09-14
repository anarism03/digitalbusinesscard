import type { Employee } from "../../types";
import { buildViewLinkRows } from "../../utils/cardLinkRows";

const VCF_ONLY_CORE_ROW_IDS = new Set(["core:phone2"]);

export function buildPublicCardRows(employee: Employee) {
  return buildViewLinkRows(employee).filter(
    (row) => !VCF_ONLY_CORE_ROW_IDS.has(row.id),
  );
}
