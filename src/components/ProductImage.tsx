import Image from "next/image";

const ProductImage: React.FC<{ imageUrl: string; productName: string }> = ({ imageUrl, productName }) => {
  return (
    <Image
      src={imageUrl || "/no-image400.jpg"}
      alt={productName}
      width={400}
      height={400}
      priority
      className="object-cover"
    />
  );
};

export default ProductImage; 