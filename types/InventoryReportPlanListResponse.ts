import { PageMetaData } from './ImportRequestType';
import { InventoryReportPlan } from './InventoryReportPlan';

export interface InventoryReportPlanListResponse {
  pageMeta: PageMetaData;
  data: InventoryReportPlan[];
}
