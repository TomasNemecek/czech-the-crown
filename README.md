# 👑 Czech the Crown 👑

A currency converter and exchange rate viewer for Czech Koruna (CZK). Uses daily exchange rates from the Czech National Bank (CNB).

### Demo
Check out the demo: [czech-the-crown.vercel.app](https:/czech-the-crown.vercel.app/)

## Features
- Convert between CZK and foreign currencies
- View daily exchange rates
- Search through available currencies

## Tech Stack
- React with TypeScript
- Vite
- styled-components
- React Query
- Vitest + Testing Library
- Vercel

## CNB Exchange Rates API
The app uses the [CNB's daily exchange rate feed.](https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt)

Rates are updated once per business day at 14.30 by CNB.  
See [documentation.](https://www.cnb.cz/en/faq/Format-of-the-foreign-exchange-market-rates/)

### CORS

Due to CORS issues with the CNB endpoint, we handle it through:
- Development: Vite dev server proxy (see `vite.config.ts`)
- Production: Vercel rewrites configuration (see `vercel.json`)
