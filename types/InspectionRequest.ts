import { InspectionRequestStatus } from '@/enums/inspectionRequestStatus';
import { InspectionRequestType } from '@/enums/inspectionRequestType';
import { ImportRequest } from './ImportRequestType';
import { PurchasingStaff } from './PurchasingStaff';
import { WarehouseManager } from './WarehouseManager';
import { InspectionDepartment } from './InspectionDepartment';
import { InspectionReport } from './InspectionReport';

export interface InspectionRequest {
  id: string;
  code: string;
  purchasingStaffId?: string | null;
  warehouseManagerId?: string | null;
  productionDeparmentId?: string | null;
  inspectionDepartmentId: string;
  status: InspectionRequestStatus;
  type: InspectionRequestType;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
  importRequestId?: string | null;
  note?: string | null;
  inspectionReport?: InspectionReport | null;
  importRequest?: ImportRequest | null;
  inspectionDepartment: InspectionDepartment;
  purchasingStaff?: PurchasingStaff | null;
  productionDeparment?: ProductionDepartment | null;
  warehouseManager?: WarehouseManager | null;
}

export interface ProductionDepartment {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
