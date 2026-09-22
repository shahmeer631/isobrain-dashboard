export type DocumentStatus = "ACTIVE" | "DRAFT" | "Active" | "Draft";

export type DocumentType = "PDF" | "DOC" | "DOCX" | "XLSX" | "PPTX" | "TXT";

export interface DocumentCategoryObj {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// Keeping this string union for backward compatibility with older UI components if any
export type DocumentCategory =
  | "Templates"
  | "Checklists"
  | "Forms"
  | "Diagrams"
  | "Guides"
  | "Reports"
  | string;

export interface Document {
  id: string;
  title: string;
  description?: string;
  categoryId?: string;
  type: string;
  version?: string;
  author?: string;
  tags?: string | string[];
  fileUrl?: string;
  fileSize: string;
  downloads: number | string;
  status: DocumentStatus;
  createdAt?: string;
  updatedAt?: string;
  category?: DocumentCategoryObj | string;
  
  // legacy properties mapped
  uploadedAt?: string;
}

export interface DocumentResponse {
  success: boolean;
  message: string;
  meta: {
      page: number;
      limit: number;
      total: number;
  };
  data: Document[];
}
