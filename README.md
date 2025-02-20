# E-Pasaulis - Electronics E-commerce Platform

## Quick Start

1. **Clone and Install**
```bash
git clone https://github.com/your-username/e-pasaulis.git
cd e-pasaulis
bun install
```

2. **Set up Environment**
```bash
cp .env.example .env
# Update .env with your values
```

3. **Set up Database**
- Download [PocketBase](https://pocketbase.io/docs/) for your platform
- Place executable in project root
- Download initial database backup from [Releases](link-to-your-release)
- Extract backup to `pb_data` folder

4. **Start Development**
```bash
# Terminal 1: Start PocketBase
.\pocketbase.exe serve  # or ./pocketbase serve

# Terminal 2: Start Next.js
bun dev
```

## Database Management

### Backup
```bash
.\backup-db.bat
```
Backups are stored in `pb_data_backup/`

### Restore
1. Stop PocketBase
2. Replace `pb_data` folder with backup contents
3. Restart PocketBase

## Available Scripts
- `bun dev` - Development server
- `bun build` - Production build
- `bun start` - Production server
- `bun populate` - Initialize database
- `bun update-translations` - Update translations

## Environment Variables
```env
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
POCKETBASE_ADMIN_EMAIL=admin@e-pasaulis.lt
POCKETBASE_ADMIN_PASSWORD=your_password
```

## Project Structure
```
e-pasaulis/
├── src/
│   ├── app/         # Next.js pages
│   ├── components/  # React components
│   ├── lib/         # Utilities
│   ├── scripts/     # DB scripts
│   └── types/       # TypeScript types
├── public/          # Static files
├── pb_migrations/   # DB migrations
└── pb_data/        # Database (gitignored)
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

## Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your actual values:
   - Set `POCKETBASE_ADMIN_EMAIL` and `POCKETBASE_ADMIN_PASSWORD` to your admin credentials
   - Adjust `NEXT_PUBLIC_POCKETBASE_URL` if using a different port/host
   - Update `NEXT_PUBLIC_SITE_URL` in production
   - Configure optional variables as needed
