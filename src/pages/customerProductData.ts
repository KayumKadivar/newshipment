export interface CustomerProduct {
  key: string;
  description: string;
  isActive: boolean;
  nmfc: string;
  productClass: string;
  commodity: string;
  isHazmat: boolean;
  hazmatContact: string;
  length: number;
  height: number;
  weight: number;
  width: number;
  productGroup: string;
  notes?: string;
  isApproved?: boolean;
}

export const customerProductSeed: CustomerProduct[] = [
  {
    key: "product-001",
    description: "Elevator Crossheads",
    isActive: true,
    nmfc: "34550",
    productClass: "50",
    commodity: "Elevator Crossheads",
    isHazmat: false,
    hazmatContact: "",
    length: 0,
    height: 0,
    weight: 0,
    width: 0,
    productGroup: "STANDARD",
  },
  {
    key: "product-002",
    description: "Elevator Weights",
    isActive: true,
    nmfc: "34620",
    productClass: "50",
    commodity: "Elevator Weights",
    isHazmat: false,
    hazmatContact: "",
    length: 0,
    height: 0,
    weight: 0,
    width: 0,
    productGroup: "STANDARD",
  },
  {
    key: "product-003",
    description: "Footwear",
    isActive: true,
    nmfc: "28130-4",
    productClass: "175",
    commodity: "",
    isHazmat: false,
    hazmatContact: "Infotrac",
    length: 48,
    height: 50,
    weight: 563,
    width: 40,
    productGroup: "STANDARD",
  },
  {
    key: "product-004",
    description: "Peppers In Boxes",
    isActive: true,
    nmfc: "78160-00",
    productClass: "92",
    commodity: "Peppers in Boxes",
    isHazmat: false,
    hazmatContact: "",
    length: 0,
    height: 0,
    weight: 0,
    width: 0,
    productGroup: "STANDARD",
  },
  {
    key: "product-005",
    description: "Stainless Steel Tubing",
    isActive: true,
    nmfc: "13120-00",
    productClass: "",
    commodity: "Stainless Steel Tubing",
    isHazmat: false,
    hazmatContact: "",
    length: 0,
    height: 0,
    weight: 0,
    width: 0,
    productGroup: "STANDARD",
  },
];

export const cloneCustomerProductSeed = () =>
  customerProductSeed.map((product) => ({ ...product }));
