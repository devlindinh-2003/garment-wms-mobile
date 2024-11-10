import { Gender } from '@/enums/gender';
import { PurchasingStaff } from './PurchasingStaff';
import { WarehouseManager } from './WarehouseManager';
import { WarehouseStaff } from './WarehouseStaff';
import { InspectionDepartment } from './InspectionDepartment';
import { ProductionDepartment } from './InspectionRequest';

export interface Account {
  id: string;
  email: string;
  password: string;
  username: string;
  avatarUrl?: string | null;
  cidId?: string | null;
  dateOfBirth: string;
  firstName: string;
  gender: Gender;
  isDeleted?: boolean | null;
  isVerified?: boolean | null;
  lastName: string;
  phoneNumber: string;
  status?: string | null;
  createdAt?: string | null;
  deletedAt?: string | null;
  updatedAt?: string | null;
  factoryDirector?: FactoryDirector | null;
  inspectionDepartment?: InspectionDepartment | null;
  productionDepartment?: ProductionDepartment | null;
  purchasingStaff?: PurchasingStaff | null;
  warehouseManager?: WarehouseManager | null;
  warehouseStaff?: WarehouseStaff | null;
}

export interface FactoryDirector {
  id: string;
  accountId: string;
  createdAt: string;
  updatedAt: string;
}
