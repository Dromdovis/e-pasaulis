import sharp from 'sharp';

const sizes = {
  thumb: 200,
  medium: 400,
  large: 800
};

async function optimizePlaceholder() {
  const input = './public/no-image.jpg';
  
  for (const [size, dimension] of Object.entries(sizes)) {
    await sharp(input)
      .resize(dimension, dimension)
      .jpeg({ quality: size === 'large' ? 90 : size === 'medium' ? 85 : 80 })
      .toFile(`./public/images/no-image/no-image-${size}.jpg`);
  }
}

optimizePlaceholder(); 