export interface ImportRequest {
  id: string;
  warehouseStaffId: string | null;
  status: 'ARRIVED' | 'PENDING' | 'CANCELLED'; // Other statuses if needed
  type: 'MATERIAL_BY_PO' | 'OTHER_TYPES'; // Other types if applicable
  startAt: string | null;
  finishAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  cancelAt: string | null;
  cancelReason: string | null;
  description: string;
  poDeliveryId: string;
  purchasingStaffId: string;
  rejectAt: string | null;
  rejectReason: string | null;
  warehouseManagerId: string | null;
  importRequestDetail: ImportRequestDetail[];
  warehouseManager: WarehouseManager | null;
  purchasingStaff: PurchasingStaff;
  warehouseStaff: WarehouseStaff | null;
  poDelivery: PODelivery;
}

type ImportRequestDetail = {
  id: string;
  importRequestId: string;
  materialVariantId: string;
  productVariantId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  quantityByPack: number;
  materialPackage: materialPackage;
};

type materialPackage = {
  id: string;
  materialId: string;
  name: string;
  code: string;
  packUnit: string;
  uomPerPack: number;
  packedWidth: number;
  packedLength: number;
  packedHeight: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  packedWeight: number;
  material: Material;
};

type Material = {
  id: string;
  materialTypeId: string;
  materialUomId: string;
  image: string;
  name: string;
  code: string;
  reorderLevel: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  materialType: MaterialType;
  materialAttribute: MaterialAttribute[];
};

type MaterialType = {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type MaterialAttribute = any; // Define according to your needs if necessary
interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  avatarUrl: string;
  cidId: string | null;
  dateOfBirth: string;
  firstName: string;
  gender: 'MALE' | 'FEMALE'; // Adjust if needed
  isDeleted: boolean;
  isVerified: boolean;
  lastName: string;
  phoneNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
type PurchasingStaff = {
  id: string;
  userId: string;
  users: User;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type WarehouseManager = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
} | null;

type WarehouseStaff = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
} | null;

type PODelivery = {
  id: string;
  purchaseOrderId: string;
  expectedDeliverDate: string;
  deliverDate: string | null;
  status: 'IMPORTING' | 'DELIVERED'; // Add more statuses if needed
  isExtra: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  purchaseOrder: PurchaseOrder;
};

type PurchaseOrder = {
  id: string;
  poNumber: string;
  quarterlyProductionPlanId: string | null;
  purchasingStaffId: string;
  currency: string;
  subTotalAmount: number;
  taxAmount: number;
  shippingAmount: number;
  otherAmount: number;
  orderDate: string;
  expectedFinishDate: string;
  finishDate: string | null;
  cancelledAt: string | null;
  cancelledReason: string | null;
  status: 'FINISHED' | 'PENDING'; // Add more statuses if needed
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  supplierId: string;
  purchasingStaff: PurchasingStaff;
  supplier: Supplier;
};

export interface poDelivery {
  id: string;
  purchaseOrderId: string;
  expectedDeliverDate: string;
  deliverDate: string;
  purchaseOrder: PurchaseOrder;
}

export interface Supplier {
  supplierName: string;
  address: string;
  email: string;
  phoneNumber: string;
  fax: string;
}
export interface ImportRequestDetails {
  id: string;
  materialPackage?: materialPackage;
  quantityByPack?: number;
}

export interface PageMetaData {
  total: number;
  offset: number;
  limit: number;
  page: number;
  totalPages: number;
}
