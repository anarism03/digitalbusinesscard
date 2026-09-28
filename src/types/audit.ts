export interface AuditChange {
  label: string;
  from?: string;
  to?: string;
}

export interface AuditLogEntry {
  id: string;
  createdAt: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  changes: AuditChange[];
}
