import { ImportRequestType } from '@/enums/importRequestType';
import { PageMetaData } from './ImportRequestType';

export interface ImportRequestListResponse {
  pageMeta: PageMetaData;
  data: ImportRequestType[];
}
