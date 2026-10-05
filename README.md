# Medicine Directory

A Next.js app to search FDA-approved drug labels, dosage info, active ingredients, and safety warnings.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- TanStack Query
- OpenFDA Drug Label API

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Search medications by brand name or generic name
- Debounced search (500ms) to avoid unnecessary API calls
- Grouped results by brand name with formulation count
- Detail page with warnings, active ingredients, dosage info
- Loading skeletons and error/empty state handling

## API

Uses the [OpenFDA Drug Label API](https://open.fda.gov/apis/drug/label/).
