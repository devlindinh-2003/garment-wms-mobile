import { Account } from './Account';
import { InspectionRequest } from './InspectionRequest';

export interface InspectionDepartment {
  id: string;
  accountId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
  account?: Account | null;
  inspectionRequest: InspectionRequest[];
}
