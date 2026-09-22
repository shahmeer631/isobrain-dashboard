export interface Order {
  id: string;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  currency: string;
  status: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  plan: {
    name: string;
  };
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: {
    meta: { page: number; limit: number; total: number };
    stats: {
      todayRevenue: number;
      totalOrders: number;
      avgOrderValue: number;
      pendingOrders: number;
    };
    data: Order[];
  };
}
