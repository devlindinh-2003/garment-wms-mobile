import { InventoryReportStatus } from '@/enums/inventoryReportStatus';
import { MaterialPackagesWithDetails, MaterialVariant } from './MaterialTypes';
import { ProductVariant } from './Product';

export interface InventoryReport {
  id: string;
  warehouseManagerId: string;
  warehouseStaffId: string;
  status: InventoryReportStatus;
  code?: string | null;
  note?: string | null;
  from?: string | null; // ISO format datetime string
  to?: string | null; // ISO format datetime string
  createdAt?: string; // ISO format datetime string
  updatedAt?: string; // ISO format datetime string
  deletedAt?: string | null; // ISO format datetime string
  inventoryReportDetail?: InventoryReportDetail[]; // Array of details
  warehouseManager?: any; // Reference to WarehouseManager
  warehouseStaff?: any; // Reference to WarehouseStaff
  inventoryReportPlanDetail?: any[]; // Array of plan details
  task?: any[]; // Array of related tasks
}

export interface InventoryReportDetail {
  id: string;
  inventoryReportId: string;
  materialReceiptId?: string | null;
  productReceiptId?: string | null;
  expectedQuantity: number;
  actualQuantity: number;
  managerQuantityConfirm: number;
  warehouseStaffNote?: string | null;
  warehouseManagerNote?: string | null;
  materialReceipt?: any;
  recordedAt?: string; // ISO format datetime string
  createdAt?: string; // ISO format datetime string
  updatedAt?: string; // ISO format datetime string
  deletedAt?: string | null; // ISO format datetime string
}

export interface InventoryReportDetailRoot {
  materialVariant?: MaterialVariant | null; // Optional material data
  materialPackages?: MaterialPackagesWithDetails[] | null; // Optional material package details
  productVariant?: ProductVariant | null; // Optional product data
  productSizes?: any[] | null; // Optional product size details
  totalExpectedQuantity: number;
  totalActualQuantity: number;
  totalManagerQuantityConfirm: number;
}
