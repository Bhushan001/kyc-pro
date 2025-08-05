export interface DemoUser {
  id: string;
  email: string;
  role: string;
  name: string;
  tenantId?: string;
  assignedApplications?: string[];
  description: string;
}

export interface Application {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  features: string[];
  icon: string;
  color: string;
  isHighlighted?: boolean;
}

export interface PricingTier {
  name: string;
  price: number;
  description: string;
  features: string[];
  limitations: string[];
  cta: string;
  popular: boolean;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
} 