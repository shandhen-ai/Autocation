// Mock data — source of truth for all reports. Must match PDF §4.4 + §4.7 exactly.

export interface SavingsCategory {
  id: "financing" | "warranty" | "tradein" | "insurance";
  label: string;
  icon: string;
  amount: number;
  amountMax?: number; // range for trade-in
  summary: string;
  confidence: number;
  fields: Array<{
    label: string;
    value: string;
    confidence: number;
  }>;
  flag?: string;
  recommendation?: string;
  sources: string[];
}

export interface Report {
  id: string;
  vehicle: {
    year: number;
    make: string;
    model: string;
    trim: string;
    vin: string;
    mileage: number;
    purchasePrice: number;
    kbbValue: number;
    blackBookValue: number;
    overpayFlag?: string;
    overpayAmount?: number;
  };
  totalSavings: number;
  confidence: number;
  reportDate: string;
  status: "complete" | "processing";
  categories: SavingsCategory[];
  nextSteps: Array<{ title: string; description: string; status: "available" | "coming_soon" }>;
}

// ─── Demo account reports (seeded for le e@auto-cation.com) ──────────────────

const REPORT_1_CATEGORIES: SavingsCategory[] = [
  {
    id: "financing",
    label: "Financing",
    icon: "💰",
    amount: 2127,
    summary: "APR is 8.9% — market average for your credit tier is 6.4%",
    confidence: 94,
    fields: [
      { label: "Your APR", value: "8.9%", confidence: 98 },
      { label: "Market average (6.4%)", value: "Est. savings: $2,127/yr", confidence: 96 },
      { label: "Loan term", value: "72 months", confidence: 99 },
      { label: "Dealer markup detected", value: "$1,200 over buy rate", confidence: 91 },
    ],
    flag: "Dealer markup detected: $1,200 over buy rate",
    recommendation: "Refinance with credit union — estimated savings: $2,127/yr",
    sources: ["Federal Reserve H.15", "Credit Union National Association rate data"],
  },
  {
    id: "warranty",
    label: "Extended Warranty",
    icon: "🛡",
    amount: 1420,
    summary: "Price on contract: $3,200 — third-party equivalent: ~$1,780",
    confidence: 96,
    fields: [
      { label: "Warranty provider", value: "Fidelity National", confidence: 96 },
      { label: "Price on contract", value: "$3,200", confidence: 99 },
      { label: "Third-party equivalent", value: "~$1,780", confidence: 88 },
      { label: "Overpay flagged", value: "$1,420", confidence: 94 },
    ],
    flag: "Overpay flagged: $1,420",
    recommendation: "Cancel within 30-day window or negotiate",
    sources: ["Autocation warranty database", "Endurance", "CarShield benchmark"],
  },
  {
    id: "tradein",
    label: "Trade-in Value",
    icon: "🚗",
    amount: 300,
    amountMax: 1400,
    summary: "Offered: $12,800 — KBB range: $13,100–$14,200",
    confidence: 88,
    fields: [
      { label: "Your trade-in", value: "2018 Toyota Camry LE, 62,400 mi", confidence: 99 },
      { label: "Offered by dealer", value: "$12,800", confidence: 99 },
      { label: "KBB trade-in range", value: "$13,100–$14,200", confidence: 95 },
      { label: "Manheim auction avg", value: "$13,900", confidence: 90 },
    ],
    flag: "Potential underpayment: $300–$1,400",
    recommendation: "Request a higher trade-in offer",
    sources: ["KBB", "Black Book", "Manheim Market Report"],
  },
  {
    id: "insurance",
    label: "Insurance",
    icon: "🛡",
    amount: 0,
    summary: "No insurance document uploaded.",
    confidence: 0,
    fields: [],
    recommendation: "Upload your insurance quote to check for savings",
    sources: [],
  },
]

const REPORT_2_CATEGORIES: SavingsCategory[] = [
  {
    id: "financing",
    label: "Financing",
    icon: "💰",
    amount: 1340,
    summary: "APR is 9.4% — market average for your credit tier is 6.7%",
    confidence: 92,
    fields: [
      { label: "Your APR", value: "9.4%", confidence: 97 },
      { label: "Market average (6.7%)", value: "Est. savings: $1,340/yr", confidence: 94 },
      { label: "Loan term", value: "84 months", confidence: 99 },
      { label: "Dealer markup detected", value: "$850 over buy rate", confidence: 88 },
    ],
    flag: "Dealer markup detected: $850 over buy rate",
    recommendation: "Refinance with credit union — estimated savings: $1,340/yr",
    sources: ["Federal Reserve H.15", "Credit Union National Association rate data"],
  },
  {
    id: "warranty",
    label: "Extended Warranty",
    icon: "🛡",
    amount: 620,
    summary: "Price on contract: $2,100 — third-party equivalent: ~$1,480",
    confidence: 93,
    fields: [
      { label: "Warranty provider", value: "Assurant", confidence: 94 },
      { label: "Price on contract", value: "$2,100", confidence: 99 },
      { label: "Third-party equivalent", value: "~$1,480", confidence: 86 },
      { label: "Overpay flagged", value: "$620", confidence: 91 },
    ],
    flag: "Overpay flagged: $620",
    recommendation: "Cancel within 30-day window or negotiate",
    sources: ["Autocation warranty database", "Endurance", "CarShield benchmark"],
  },
  {
    id: "tradein",
    label: "Trade-in Value",
    icon: "🚗",
    amount: 196,
    amountMax: 820,
    summary: "Offered: $18,500 — KBB range: $18,696–$19,320",
    confidence: 87,
    fields: [
      { label: "Your trade-in", value: "2019 Chevrolet Silverado 1500, 48,200 mi", confidence: 99 },
      { label: "Offered by dealer", value: "$18,500", confidence: 99 },
      { label: "KBB trade-in range", value: "$18,696–$19,320", confidence: 94 },
      { label: "Manheim auction avg", value: "$19,000", confidence: 89 },
    ],
    flag: "Potential underpayment: $196–$820",
    recommendation: "Request a higher trade-in offer",
    sources: ["KBB", "Black Book", "Manheim Market Report"],
  },
  {
    id: "insurance",
    label: "Insurance",
    icon: "🛡",
    amount: 0,
    summary: "No insurance document uploaded.",
    confidence: 0,
    fields: [],
    recommendation: "Upload your insurance quote to check for savings",
    sources: [],
  },
]

const REPORT_3_CATEGORIES: SavingsCategory[] = [
  {
    id: "financing",
    label: "Financing",
    icon: "💰",
    amount: 890,
    summary: "APR is 7.8% — market average for your credit tier is 6.2%",
    confidence: 90,
    fields: [
      { label: "Your APR", value: "7.8%", confidence: 95 },
      { label: "Market average (6.2%)", value: "Est. savings: $890/yr", confidence: 92 },
      { label: "Loan term", value: "60 months", confidence: 99 },
    ],
    recommendation: "Refinance with credit union — estimated savings: $890/yr",
    sources: ["Federal Reserve H.15", "Credit Union National Association rate data"],
  },
  {
    id: "warranty",
    label: "Extended Warranty",
    icon: "🛡",
    amount: 398,
    summary: "Price on contract: $1,850 — third-party equivalent: ~$1,452",
    confidence: 89,
    fields: [
      { label: "Warranty provider", value: "Blue Ghost", confidence: 92 },
      { label: "Price on contract", value: "$1,850", confidence: 99 },
      { label: "Third-party equivalent", value: "~$1,452", confidence: 84 },
    ],
    flag: "Overpay flagged: $398",
    recommendation: "Cancel within 30-day window or negotiate",
    sources: ["Autocation warranty database", "Endurance", "CarShield benchmark"],
  },
  {
    id: "tradein",
    label: "Trade-in Value",
    icon: "🚗",
    amount: 0,
    summary: "No trade-in document uploaded.",
    confidence: 0,
    fields: [],
    recommendation: "Upload your trade-in offer to check for savings",
    sources: [],
  },
  {
    id: "insurance",
    label: "Insurance",
    icon: "🛡",
    amount: 0,
    summary: "No insurance document uploaded.",
    confidence: 0,
    fields: [],
    recommendation: "Upload your insurance quote to check for savings",
    sources: [],
  },
]

export const REPORTS: Report[] = [
  {
    id: "demo-report-1",
    vehicle: {
      year: 2023,
      make: "Honda",
      model: "Accord",
      trim: "EX-L",
      vin: "1HGCV1F3XNA045678",
      mileage: 24318,
      purchasePrice: 28750,
      kbbValue: 26400,
      blackBookValue: 25900,
      overpayFlag: "Purchase price is $2,350 above KBB fair market",
      overpayAmount: 2350,
    },
    totalSavings: 3847,
    confidence: 94,
    reportDate: "March 15, 2026",
    status: "complete",
    categories: REPORT_1_CATEGORIES,
    nextSteps: [
      {
        title: "Refinance your auto loan",
        description: "Connect with 3 sample credit union partners offering rates between 5.9%–6.4%",
        status: "coming_soon",
      },
      {
        title: "Cancel your extended warranty within 30 days",
        description: "Contact Fidelity National: 1-800-555-0134",
        status: "available",
      },
      {
        title: "Request a higher trade-in offer",
        description: "Use KBB and Manheim data to negotiate at least $13,500",
        status: "available",
      },
    ],
  },
  {
    id: "demo-report-2",
    vehicle: {
      year: 2021,
      make: "Ford",
      model: "F-150",
      trim: "XLT",
      vin: "1FTFW1E85NFA12345",
      mileage: 48200,
      purchasePrice: 42100,
      kbbValue: 39500,
      blackBookValue: 38800,
    },
    totalSavings: 2156,
    confidence: 91,
    reportDate: "February 8, 2026",
    status: "complete",
    categories: REPORT_2_CATEGORIES,
    nextSteps: [
      {
        title: "Refinance your auto loan",
        description: "Connect with 3 sample credit union partners",
        status: "coming_soon",
      },
      {
        title: "Cancel your extended warranty within 30 days",
        description: "Contact Assurant: 1-800-555-0199",
        status: "available",
      },
      {
        title: "Request a higher trade-in offer",
        description: "Use KBB and Manheim data to negotiate at least $19,000",
        status: "available",
      },
    ],
  },
  {
    id: "demo-report-3",
    vehicle: {
      year: 2022,
      make: "Tesla",
      model: "Model 3",
      trim: "Long Range",
      vin: "5YJ3E1EA5PF123456",
      mileage: 18500,
      purchasePrice: 52400,
      kbbValue: 49800,
      blackBookValue: 49200,
    },
    totalSavings: 1288,
    confidence: 89,
    reportDate: "January 22, 2026",
    status: "complete",
    categories: REPORT_3_CATEGORIES,
    nextSteps: [
      {
        title: "Refinance your auto loan",
        description: "Connect with 3 sample credit union partners",
        status: "coming_soon",
      },
      {
        title: "Cancel your extended warranty within 30 days",
        description: "Contact Blue Ghost: 1-800-555-0177",
        status: "available",
      },
    ],
  },
]

// ─── Aggregate helpers ────────────────────────────────────────────────

export function getTotalSavings(reports: Report[] = REPORTS): number {
  return reports.reduce((sum, r) => sum + r.totalSavings, 0)
}

export function getSavingsByCategory(reports: Report[] = REPORTS) {
  const financing = reports.reduce((s, r) => s + (r.categories.find(c => c.id === "financing")?.amount ?? 0), 0)
  const warranty = reports.reduce((s, r) => s + (r.categories.find(c => c.id === "warranty")?.amount ?? 0), 0)
  const tradein = reports.reduce((s, r) => s + (r.categories.find(c => c.id === "tradein")?.amount ?? 0), 0)
  const insurance = reports.reduce((s, r) => s + (r.categories.find(c => c.id === "insurance")?.amount ?? 0), 0)
  return [
    { category: "Financing", amount: financing, color: "oklch(0.78 0.16 182)" },
    { category: "Warranty", amount: warranty, color: "oklch(0.68 0.14 245)" },
    { category: "Trade-in", amount: tradein, color: "oklch(0.76 0.14 75)" },
    { category: "Insurance", amount: insurance, color: "oklch(0.62 0.22 18)" },
  ].filter(c => c.amount > 0)
}

export function getRecentReports(count = 3) {
  return REPORTS.slice(0, count)
}

export function getReportById(id: string): Report | undefined {
  return REPORTS.find(r => r.id === id)
}
