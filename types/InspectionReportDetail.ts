import { MaterialPackage } from './MaterialTypes';

export interface InspectionReportDetail {
  id: string;
  inspectionReportId: string;
  materialPackageId?: string | null;
  productSizeId?: string | null;
  approvedQuantityByPack: number;
  defectQuantityByPack: number;
  quantityByPack?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
  materialPackage?: MaterialPackage | null;
  productSize?: ProductSize | null;
}

export interface ProductSize {
  id: string;
  productVariantId: string;
  name: string;
  code: string;
  width: number;
  height: number;
  length: number;
  weight: number;
  size: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  productVariant?: any | null; // Nested ProductVariant
}
