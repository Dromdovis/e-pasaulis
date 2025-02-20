# E-Pasaulis - Electronics E-commerce Platform

An e-commerce platform built with Next.js, PocketBase, and Bun.

## Prerequisites

- [Bun](https://bun.sh/) (v1.0.0 or higher)
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)

## Setup

1. Install dependencies:
```bash
bun install
```

2. Create a `.env` file in the root directory:
```bash
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

3. Start PocketBase server:
- Windows: `.\pocketbase.bat`
- Unix/MacOS: `./pocketbase.sh`

4. Start the development server:
```bash
bun dev
```

## Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run linter
- `bun populate` - Populate database with sample data

## Project Structure

```
e-pasaulis/
├── src/
│   ├── app/         # Next.js app router pages
│   ├── components/  # React components
│   ├── lib/         # Utility functions and configurations
│   ├── scripts/     # Database scripts
│   └── types/       # TypeScript type definitions
├── public/          # Static files
├── pb_data/         # PocketBase data (gitignored)
└── pb_migrations/   # PocketBase migrations
```

## License

MIT

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
