export enum PurchaseOrderStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  CANCELLED = 'CANCELLED',
  FINISHED = 'FINISHED'
}

export const PurchaseOrderStatusLabels: Record<PurchaseOrderStatus, string> = {
  [PurchaseOrderStatus.IN_PROGRESS]: 'In Progress',
  [PurchaseOrderStatus.CANCELLED]: 'Cancelled',
  [PurchaseOrderStatus.FINISHED]: 'Finished'
};
