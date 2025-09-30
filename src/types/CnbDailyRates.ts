export interface CnbRate {
  country: string;
  currency: string;
  amount: number;
  code: string;
  rate: number; // CZK amount per 1 unit of currency
}

export interface CnbDailyRates {
  date: string; // e.g. 26 Sep 2025
  sequence: number; // e.g. 188
  rates: CnbRate[];
}
