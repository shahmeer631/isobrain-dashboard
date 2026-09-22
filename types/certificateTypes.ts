export interface ICertificateCourse {
  id: string;
  title: string;
}

export interface ICertificateTemplate {
  id: string;
  name: string;
  title?: string;
  subtitle?: string;
  bodyText?: string;
  templateType?: string;
  signature1?: string;
  signature2?: string;
  footerText?: string;
  isActive: boolean;
  autoIssue: boolean;
  backgroundImageUrl?: string;
  certificatesIssued?: number;
  attachedCourses?: number;
  courses?: ICertificateCourse[];
  createdAt: string;
  updatedAt: string;
}

export interface ICertificateStats {
  totalCertificates: number;
  activeTemplates: number;
  downloadsThisMonth: number;
  issuedThisWeek: number;
}

export interface ICertificateDashboardResponse {
  success: boolean;
  message: string;
  data: {
    stats: ICertificateStats;
    templates: ICertificateTemplate[];
  };
}

export interface ICreateCertificateRequest {
  name: string;
  title?: string;
  subtitle?: string;
  bodyText?: string;
  templateType?: string;
  signature1?: string;
  signature2?: string;
  footerText?: string;
  autoIssue: boolean;
  courseIds: string[];
  backgroundImageUrl?: string;
}

export interface IUpdateCertificateRequest extends Partial<ICreateCertificateRequest> {
  isActive?: boolean;
}

export interface ICertificateResponse {
  success: boolean;
  message: string;
  data: ICertificateTemplate;
}
