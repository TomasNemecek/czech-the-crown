# 👑 Czech the Crown 👑

A currency converter and exchange rate viewer for Czech Koruna (CZK). Uses daily exchange rates from the Czech National Bank (CNB).

### Demo

Check out the demo: [czech-the-crown.vercel.app](https://czech-the-crown.vercel.app/)

## Tech Stack

- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **Package Manager**: PNPM
- **Styling**: styled-components
- **State Management**: React Query (TanStack Query)
- **Testing**: Vitest + Testing Library (95%+ coverage)
- **Deployment**: Vercel
- **Code Quality**: ESLint + Prettier

## Getting Started

### Prerequisites
- Node.js 18+
- PNPM 8+ 

### Installation

```bash
# Clone the repository
git clone https://github.com/TomasNemecek/czech-the-crown.git
cd czech-the-crown

# Install PNPM if you haven't already
npm install -g pnpm

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## CNB Exchange Rates API

The app uses the [CNB's daily exchange rate feed.](https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt)

**Update Schedule**: Rates are updated once per business day at 14:30 Czech time by CNB.  
**Documentation**: [CNB Rate Format Documentation](https://www.cnb.cz/en/faq/Format-of-the-foreign-exchange-market-rates/)

### CORS Handling

Due to CORS restrictions with the CNB endpoint:

- **Development**: Vite dev server proxy (see `vite.config.ts`)
- **Production**: Vercel rewrites configuration (see `vercel.json`)
