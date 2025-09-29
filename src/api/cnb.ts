import { cache } from "react";
import { parseCnbTxt, type CnbDailyRates } from "../lib/parseCnb";

const CNB_PATH = "/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt";
const CNB_URL = import.meta.env.DEV ? `/cnb${CNB_PATH}` : `https://www.cnb.cz${CNB_PATH}`;

export const fetchCnbDailyRates = cache(async (): Promise<CnbDailyRates> => {
    const response = await fetch(CNB_URL, {
        cache: "no-store",
        headers: {
            'Accept': 'text/plain'
        }
    });
    if (!response.ok) throw new Error(`Failed to fetch CNB data: ${response.status} ${response.statusText}`);
    const text = await response.text();
    return parseCnbTxt(text);
});