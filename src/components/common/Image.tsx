import NextImage from 'next/image';
import { ImageProps } from 'next/image';

export default function Image(props: ImageProps) {
  return <NextImage {...props} />;
} 