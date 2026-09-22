export interface ICategory {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICourse {
  id: string;
  title: string;
  slug: string;
  instructor: string;
  description: string;
  thumbnail: string;
  categoryId: string;
  cpdHours: number;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
  category: ICategory;
}

export interface ICourseResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: ICourse[];
}
