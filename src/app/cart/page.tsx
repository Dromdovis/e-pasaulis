// src/app/cart/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useStore, CartItem } from '@/lib/store';
import { pb } from '@/lib/db';
import PriceDisplay from '@/components/PriceDisplay';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { RecordModel } from 'pocketbase';

interface CartProduct extends Omit<ProductRecord, 'collectionId' | 'collectionName'> {
  quantity: number;
}

interface ProductRecord extends RecordModel {
  name: string;
  price: number;
  stock: number;
}

export default function CartPage() {
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { cart, removeFromCart, updateQuantity } = useStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productIds = cart.map(item => item.productId);
        if (productIds.length === 0) {
          setProducts([]);
          return;
        }

        const fetchedProducts = await pb.collection('products').getList<ProductRecord>(1, 50, {
          filter: `id in "${productIds.join('","')}"`,
        });

        const cartProducts = fetchedProducts.items.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          quantity: cart.find(item => item.productId === product.id)?.quantity || 0,
        }));

        setProducts(cartProducts);
      } catch (error) {
        console.error('Failed to fetch cart products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [cart]);

  const handleQuantityUpdate = async (productId: string, newQuantity: number) => {
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemoveFromCart = async (productId: string) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const total = products.reduce((sum, product) => 
    sum + (product.price * product.quantity), 0);

  if (loading) {
    return <div className="p-8">Loading cart...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600">Add some products to your cart to see them here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid gap-8">
        {products.map((product) => (
          <div key={product.id} 
               className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4 bg-[rgb(var(--card-bg))] rounded-lg shadow">
            <div className="md:col-span-2">
              <h3 className="font-semibold">{product.name}</h3>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleQuantityUpdate(product.id, Math.max(0, product.quantity - 1))}
                className="p-1 rounded-full hover:bg-secondary-100"
                disabled={product.quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span>{product.quantity}</span>
              <button
                onClick={() => handleQuantityUpdate(product.id, Math.min(product.stock, product.quantity + 1))}
                className="p-1 rounded-full hover:bg-secondary-100"
                disabled={product.quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleRemoveFromCart(product.id)}
                className="p-1 rounded-full hover:bg-secondary-100 text-error"
                aria-label="Remove from cart"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <PriceDisplay 
              price={product.price * product.quantity} 
              className="text-right"
            />
          </div>
        ))}
        <div className="mt-8 flex justify-between items-center p-4 bg-[rgb(var(--card-bg))] rounded-lg shadow">
          <span className="font-bold text-xl">Total:</span>
          <PriceDisplay price={total} className="text-2xl" />
        </div>
        <button 
          className="mt-4 w-full md:w-auto md:ml-auto px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          onClick={() => {/* TODO: Implement checkout */}}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}