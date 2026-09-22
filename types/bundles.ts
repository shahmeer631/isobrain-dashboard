export interface BundleStats {
  label: string;
  value: string | number;
  isHighlight?: boolean;
}

export interface BundleItem {
  id: string;
  bundleId: string;
  itemType: "COURSE";
  itemId: string;
  createdAt: string;
}

export interface IBundleCourse {
  id: string;
  title: string;
  slug: string;
  instructor: string;
  director: string;
  description: string;
  thumbnail: string;
  categoryId: string;
  cpdHours: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  certificateTemplateId: string | null;
}

export interface IBundle {
  id: string;
  title: string;
  description: string;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED";
  price: number;
  originalPrice: number;
  categoryId: string | null;
  bundleItems: BundleItem[];
  courses?: IBundleCourse[];
  createdAt: string;
  updatedAt: string;
}

export interface IBundleRequest {
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  courseIds: string[];
  status?: "ACTIVE" | "DRAFT" | "ARCHIVED";
}

export interface IBundleResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: IBundle[];
}

// Deprecated: Old Bundle interface
export interface Bundle extends Partial<IBundle> {
  discount?: string;
  itemsCount?: number;
  stats?: BundleStats[];
}
