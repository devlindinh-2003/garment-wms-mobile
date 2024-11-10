import { InspectionRequest } from './InspectionRequest';

export interface InspectionReport {
  id: string;
  inspectionRequestId: string;
  code: string;
  createdAt?: string | null;
  updateAt?: string | null;
  deletedAt?: string | null;
  importReceipt?: ImportReceipt | null;
  inspectionRequest: InspectionRequest;
  inspectionReportDetail: InspectionReportDetail[];
}

export interface ImportReceipt {
  id: string;
  receiptCode: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface InspectionReportDetail {
  id: string;
  inspectionReportId: string;
  detail: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
