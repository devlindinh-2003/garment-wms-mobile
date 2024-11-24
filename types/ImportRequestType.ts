import { ImportRequestStatus } from '@/enums/importRequestStatus';
import { ImportRequestType } from '@/enums/importRequestType';
import { MaterialPackage } from './MaterialTypes';
import { PurchaseOrder } from './PurchaseOrder';
import { PurchaseOrderDeliveryStatus } from '@/enums/purchaseOrderDeliveryStatus';
import { InspectionRequest } from './InspectionRequest';
import { PurchasingStaff } from './PurchasingStaff';
import { WarehouseManager } from './WarehouseManager';
import { WarehouseStaff } from './WarehouseStaff';

export interface ImportRequest {
  id: string;
  warehouseStaffId: string | null;
  poDeliveryId: string;
  purchasingStaffId: string | null;
  warehouseManagerId: string | null;
  productionDepartmentId: string | null;
  productionBatchId: string | null;
  status: ImportRequestStatus;
  code: string;
  type: ImportRequestType;
  startedAt: string | null;
  finishedAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  description: string | null;
  approveNote: string | null;
  rejectAt: string | null;
  rejectReason: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  poDelivery: PODelivery;
  purchasingStaff?: PurchasingStaff | null;
  warehouseManager?: WarehouseManager | null;
  warehouseStaff?: WarehouseStaff | null;
  productionBatch?: ProductionBatch | null;
  productionDepartment?: ProductionDepartment | null;
  importRequestDetail: ImportRequestDetail[];
  inspectionRequest: InspectionRequest[];
}

export interface ImportRequestDetail {
  id: string;
  importRequestId: string;
  materialVariantId: string;
  productVariantId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  quantityByPack: number;
  materialPackage: any;
  productSize: any;
}

export interface PODelivery {
  id: string;
  purchaseOrderId: string;
  expectedDeliverDate: string;
  deliverDate: string | null;
  status: PurchaseOrderDeliveryStatus;
  isExtra: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  purchaseOrder: PurchaseOrder;
}

export interface ProductionBatch {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ProductionDepartment {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ImportRequestDetails {
  id: string;
  materialPackage?: MaterialPackage;
  quantityByPack?: number;
}

export interface PageMetaData {
  total: number;
  offset: number;
  limit: number;
  page: number;
  totalPages: number;
}
