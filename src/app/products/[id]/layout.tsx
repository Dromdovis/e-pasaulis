import { Metadata } from 'next';
import { generateMetadata as getMetadata } from './metadata';

// Export the metadata generator with the correct type
export const generateMetadata = getMetadata;

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 