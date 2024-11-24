import { InventoryReportPlanStatus } from '@/enums/inventoryReportPlanStatus';
import { InventoryReportPlanType } from '@/enums/inventoryReportPlanType';

export interface InventoryReportPlan {
  id: string; // UUID
  warehouseManagerId: string; // UUID
  type?: InventoryReportPlanType; // Defaults to ALL
  title: string;
  code?: string;
  status: InventoryReportPlanStatus;
  note?: string;
  from?: string; // ISO Date string
  to?: string; // ISO Date string
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  deletedAt?: string; // ISO Date string
  warehouseManager: any;
  inventoryReportPlanDetail: any[];
}
