// src/app/layout.tsx
import type { Metadata } from "next";
import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: "E-Pasaulis",
  description: "Your one-stop e-commerce solution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en'}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
