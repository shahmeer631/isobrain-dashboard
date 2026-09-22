export interface IAffiliate {
  id: string;
  name: string;
  email: string;
  affiliateCode: string;
  commissionRate: number;
  status: "ACTIVE" | "PENDING" | "INACTIVE";
  paymentMethod: string;
  paymentDetails: string;
  notes?: string;
  totalSales: number;
  totalRevenue: number;
  totalCommission: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateAffiliateRequest {
  name: string;
  email: string;
  affiliateCode: string;
  commissionRate: number;
  status: "ACTIVE" | "PENDING" | "INACTIVE";
  paymentMethod: string;
  paymentDetails: string;
  notes?: string;
}

export interface IUpdateAffiliateRequest {
  name?: string;
  email?: string;
  affiliateCode?: string;
  commissionRate?: number;
  status?: "ACTIVE" | "PENDING" | "INACTIVE";
  paymentMethod?: string;
  paymentDetails?: string;
  notes?: string;
}

export interface IAffiliateStats {
  totalAffiliates: number;
  totalRevenue: number;
  totalCommission: number;
  totalSales: number;
  totalSalesThisMonth: number;
}

export interface IAffiliateResponse {
  success: boolean;
  message: string;
  data: IAffiliate;
}

export interface IAffiliatesResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: IAffiliate[];
}

export interface IAffiliateStatsResponse {
  success: boolean;
  message: string;
  data: IAffiliateStats;
}
