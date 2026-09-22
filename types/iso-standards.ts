export interface IISOCategory {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISOStandard {
  id: string;
  title: string;
  fileUrl: string;
  fileSize: number;
  downloads: number;
  categoryId: string;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
  category: IISOCategory;
}

export interface IISOStandardsResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: ISOStandard[];
}
