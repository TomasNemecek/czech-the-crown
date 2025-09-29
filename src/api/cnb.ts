import { parseCnbTxt, type CnbDailyRates } from "../lib/parseCnb";

const CNB_PATH = "/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt";
const CNB_URL = `/cnb${CNB_PATH}`;

export async function fetchCnbDailyRates(): Promise<CnbDailyRates> {
    const response = await fetch(CNB_URL);
    if (!response.ok) throw new Error(`Failed to fetch CNB data: ${response.status} ${response.statusText}`);
    const text = await response.text();
    return parseCnbTxt(text);
}