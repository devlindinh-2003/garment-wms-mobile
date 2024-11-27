export enum InventoryReportPlanStatus {
  NOT_YET = 'NOT_YET',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

export const InventoryReportPlanStatusLabels: Record<
  InventoryReportPlanStatus,
  string
> = {
  [InventoryReportPlanStatus.NOT_YET]: 'Not Yet',
  [InventoryReportPlanStatus.IN_PROGRESS]: 'In Progress',
  [InventoryReportPlanStatus.FINISHED]: 'Finished',
  [InventoryReportPlanStatus.CANCELLED]: 'Cancelled',
};

export const InventoryReportPlanStatusColors: Record<
  InventoryReportPlanStatus,
  string
> = {
  [InventoryReportPlanStatus.NOT_YET]: '#FF9800', // Orange
  [InventoryReportPlanStatus.IN_PROGRESS]: '#2196F3', // Blue
  [InventoryReportPlanStatus.FINISHED]: '#4CAF50', // Green
  [InventoryReportPlanStatus.CANCELLED]: '#F44336', // Red
};
