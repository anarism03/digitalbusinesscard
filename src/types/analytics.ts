export type PeriodPreset = "day" | "week" | "month" | "year" | "custom";

export interface AnalyticsQueryParams {
  companyId?: string;
  startDate?: string;
  endDate?: string;
  employeeId?: string;
}

export interface ScanChartPoint {
  date: string;
  count: number;
}

export interface EmployeeRanking {
  employeeId: string;
  fullName: string;
  jobTitle?: string;
  photoUrl?: string;
  scanCount: number;
}

export interface ScanLog {
  id: string;
  scannedAt: string;
  employeeId?: string;
  employeeName?: string;
  photoUrl?: string;
}

export interface ScanLogParams extends AnalyticsQueryParams {
  page?: number;
  pageSize?: number;
}
