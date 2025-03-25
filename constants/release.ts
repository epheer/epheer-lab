export enum ReleaseStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DELIVERED = 'delivered',
  FINALIZED = 'finalized',
}

export enum ReleaseType {
  SINGLE = 'single',
  EP = 'ep',
  ALBUM = 'album',
}

export interface ReleaseTypeItem {
  label: string;
  value: ReleaseType;
}
