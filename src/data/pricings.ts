import { PricingType } from "../enum";

export type Pricing = {
  name: string;
  price: number;
  type: PricingType;
  currency: {
    code: string;
    symbol: string;
  };
  description: string;
};

export const pricings: Pricing[] = [
  {
    name: "Basic",
    price: 10,
    currency: {
      code: "USD",
      symbol: "$",
    },
    type: PricingType.Basic,
    description:
      "Get advanced features designed specifically for restaurants, retailers, or appointment-based businesses. Upgrade when you want to, cancel anytime.",
  },
  {
    name: "Pro",
    price: 20,
    currency: {
      code: "USD",
      symbol: "$",
    },
    type: PricingType.Pro,
    description:
      "Create purchase orders, view inventory valuation report and manage stock. * If you have more than 3 stores, contact us for special offer",
  },
];
