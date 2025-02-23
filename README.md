# E-Pasaulis - Electronics E-commerce Platform

## Prerequisites

- Python 3.9 or later
- Node.js 18 or later
- Bun (will be installed automatically if missing)

## Quick Start

1. **Clone the Repository**
```bash
git clone https://github.com/your-username/e-pasaulis.git
cd e-pasaulis
```

2. **Install Dependencies**

Windows:
```bash
.\scripts\install_dependencies.bat
```

Linux/macOS:
```bash
chmod +x ./scripts/install_dependencies.sh
./scripts/install_dependencies.sh
```

3. **Set up Environment**
```bash
cp .env.example .env
# Update .env with your values
```

4. **Set up Database**
- Download [PocketBase](https://pocketbase.io/docs/) for your platform
- Place executable in project root
- Download initial database backup from [Releases](link-to-your-release)
- Extract backup to `pb_data` folder

5. **Start Development**
```bash
# Terminal 1: Start PocketBase
.\pocketbase.exe serve  # Windows
./pocketbase serve     # Linux/macOS

# Terminal 2: Start Next.js
bun dev
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
├── scraper/         # Web scraping scripts
├── scripts/         # Setup and utility scripts
├── public/          # Static files
├── pb_migrations/   # DB migrations
└── pb_data/        # Database (gitignored)
```

## Available Scripts

### Development
- `bun dev` - Start Next.js development server
- `bun build` - Create production build
- `bun start` - Start production server

### Database
- `.\pocketbase.exe serve` - Start PocketBase server (Windows)
- `./pocketbase serve` - Start PocketBase server (Linux/macOS)
- `.\backup-db.bat` - Backup database (Windows)
- `./backup-db.sh` - Backup database (Linux/macOS)

### Scraping
- `.\run_scraper.bat` - Run web scraper (Windows)
- `./run_scraper.sh` - Run web scraper (Linux/macOS)

### Other
- `bun update-translations` - Update translations
- `bun test` - Run tests
- `bun lint` - Run linter

## Dependencies

### Frontend (Node.js)
- Next.js 14
- React 18
- TailwindCSS
- React Query
- Zustand
- PocketBase Client

### Backend (PocketBase)
- PocketBase (latest)

### Scraper (Python)
- BeautifulSoup4
- Requests
- Playwright
- Pandas
- aiohttp
- And more (see `setup.py`)

## Environment Variables
```env
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
POCKETBASE_ADMIN_EMAIL=admin@e-pasaulis.lt
POCKETBASE_ADMIN_PASSWORD=your_password
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LOCALE=en
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Support

For support, email support@e-pasaulis.lt or join our Discord channel.

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

## Database Setup

1. Download PocketBase from https://pocketbase.io/docs/
2. Place the executable in your project root
3. Run initial setup:
   ```bash
   ./pocketbase serve
   ```
4. Access admin UI at http://127.0.0.1:8090/_/
5. Create required collections and fields as documented in SCHEMA.md
