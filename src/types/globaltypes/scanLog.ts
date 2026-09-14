import type { AnalyticsQueryParams } from "../analytics";

export interface ScanLogParams extends AnalyticsQueryParams {
  page?: number;
  pageSize?: number;
}
