export enum InventoryReportStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  REPORTED = 'REPORTED',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

export const InventoryReportStatusLabels: Record<
  InventoryReportStatus,
  string
> = {
  [InventoryReportStatus.IN_PROGRESS]: 'In Progress',
  [InventoryReportStatus.REPORTED]: 'Reported',
  [InventoryReportStatus.FINISHED]: 'Finished',
  [InventoryReportStatus.CANCELLED]: 'Cancelled',
};
