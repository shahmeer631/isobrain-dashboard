export interface IPlan {
  id: string;
  name: string;
  description: string;
  badge: string | null;
  buttonText: string;
  originalPrice: number;
  discountedPrice: number;
  validFrom: string;
  validUntil: string;
  learningUnits: number;
  validityDays: number;
  features: string[];
  stripeProductId: string;
  stripePriceId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IPlansResponse {
  success: boolean;
  message: string;
  data: IPlan[];
}

export interface IPlanResponse {
  success: boolean;
  message: string;
  data: IPlan;
}

export interface ICreatePlanRequest {
  name: string;
  description: string;
  badge: string | null;
  buttonText: string;
  originalPrice: number;
  discountedPrice: number;
  validFrom: string;
  validUntil: string;
  learningUnits: number;
  validityDays: number;
  features: string[];
}

export interface IUpdatePlanRequest extends Partial<ICreatePlanRequest> {
  isActive?: boolean;
}
