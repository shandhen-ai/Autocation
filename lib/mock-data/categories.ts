// Mock benchmark data — real sources per PDF spec §4.7

export interface Benchmark {
  source: string;
  sourceShort: string;
  description: string;
  url: string;
}

export const BENCHMARKS: Benchmark[] = [
  {
    source: "Kelley Blue Book",
    sourceShort: "KBB",
    description: "Vehicle valuation and trade-in ranges",
    url: "https://www.kbb.com",
  },
  {
    source: "Black Book",
    sourceShort: "Black Book",
    description: "Vehicle valuation and auction data",
    url: "https://www.blackbook.com",
  },
  {
    source: "Federal Reserve H.15",
    sourceShort: "Fed H.15",
    description: "Prime rates and bank APR benchmarks",
    url: "https://www.federalreserve.gov/releases/h15",
  },
  {
    source: "Manheim Market Report",
    sourceShort: "Manheim",
    description: "Auction average wholesale values",
    url: "https://www.manheim.com/market-report",
  },
  {
    source: "Credit Union National Association",
    sourceShort: "CUNA",
    description: "Credit union rate data",
    url: "https://www.cuna.org",
  },
  {
    source: "Autocation Warranty Database",
    sourceShort: "Autocation",
    description: "Proprietary warranty pricing data",
    url: "",
  },
]

export const MARKET_RATES = {
  primeRate: 8.50,
  creditUnionAvg: 6.40,
  bankAvg: 7.25,
}
