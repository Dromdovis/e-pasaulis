'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { pb } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ArrowLeft, ShoppingBag, CheckCircle, AlertCircle } from 'lucide-react';
import type { Product } from '@/types';
import PriceDisplay from '@/components/PriceDisplay';
import { useRouter } from 'next/navigation';
import { useScrollRestoration } from '@/lib/hooks/useScrollRestoration';

interface CartProduct extends Product {
  quantity: number;
}

interface Coupon {
  code: string;
  discountPercent: number;
  validUntil: Date;
}

// Sample coupons for demonstration
const VALID_COUPONS: Coupon[] = [
  { code: 'WELCOME10', discountPercent: 10, validUntil: new Date('2024-12-31') },
  { code: 'SUMMER20', discountPercent: 20, validUntil: new Date('2024-09-01') }
];

type CheckoutStep = 'review' | 'details' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const { t } = useLanguage();
  const { cart, clearCart } = useStore();
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('review');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const router = useRouter();
  
  // Customer information
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Lithuania',
  });
  
  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'banktransfer'>('card');
  
  // Order processing state
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Add scroll restoration
  const { isRestoring } = useScrollRestoration('checkout_page');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productIds = cart.map(item => item.productId);
        if (productIds.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        const fetchedProducts = await pb.collection('products').getList<Product>(1, 50, {
          filter: `id ~ "${productIds.join('" || id ~ "')}"`,
          requestKey: null,
        });

        const cartProducts = fetchedProducts.items.map(product => ({
          ...product,
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

  // Function to apply coupon code
  const applyCoupon = () => {
    // Reset previous errors
    setCouponError('');
    
    if (!couponCode.trim()) {
      setCouponError(t('checkout.couponEmpty'));
      return;
    }
    
    const coupon = VALID_COUPONS.find(c => 
      c.code.toLowerCase() === couponCode.trim().toLowerCase() && 
      new Date() < c.validUntil
    );
    
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponError('');
    } else {
      setAppliedCoupon(null);
      setCouponError(t('checkout.invalidCoupon'));
    }
  };

  // Calculate subtotal
  const subtotal = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
  
  // Calculate discount if coupon applied
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent / 100) : 0;
  
  // Calculate total
  const total = subtotal - discount;

  // Handle form submission for customer details
  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
    window.scrollTo(0, 0);
  };

  // Handle order placement
  const placeOrder = async () => {
    setIsProcessing(true);
    
    try {
      // In a real app, you would send the order to your backend
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear cart after successful order
      await clearCart();
      setOrderPlaced(true);
      setCurrentStep('confirmation');
    } catch (error) {
      console.error('Failed to place order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  function getImageUrl(product: Product): string {
    if (!product.image) {
      return '/no-image400.jpg';
    }
    return `${pb.baseUrl}/api/files/${product.collectionId}/${product.id}/${product.image}`;
  }

  if (loading || isRestoring) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (products.length === 0 && !orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">{t('cart.empty')}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">{t('cart.addItemsToCart')}</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft size={20} className="mr-2" />
            {t('products.actions.continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center mb-8">
        <Link href="/cart" className="text-blue-600 hover:underline flex items-center mr-2">
          <ArrowLeft size={16} className="mr-1" />
          <span>{t('cart')}</span>
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-700 dark:text-gray-300">{t('checkout')}</span>
      </div>

      <h1 className="text-3xl font-bold mb-8 dark:text-white">{t('checkout')}</h1>

      {/* Checkout Steps Indicator */}
      {!orderPlaced && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex-1 flex flex-col items-center ${currentStep === 'review' ? 'text-blue-600' : 'text-gray-500'}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${currentStep === 'review' ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                1
              </div>
              <span className="text-sm">{t('checkout_steps_review')}</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
            <div className={`flex-1 flex flex-col items-center ${currentStep === 'details' ? 'text-blue-600' : 'text-gray-500'}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${currentStep === 'details' ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                2
              </div>
              <span className="text-sm">{t('checkout_steps_details')}</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-2"></div>
            <div className={`flex-1 flex flex-col items-center ${currentStep === 'payment' ? 'text-blue-600' : 'text-gray-500'}`}>
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${currentStep === 'payment' ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                3
              </div>
              <span className="text-sm">{t('checkout_steps_payment')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Order Review Step */}
      {currentStep === 'review' && (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">{t('checkout_order_items')}</h2>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={getImageUrl(product)}
                        alt={product.name}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-medium dark:text-white">{product.name}</h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {t('checkout.quantity')}: {product.quantity}
                      </div>
                    </div>

                    <PriceDisplay 
                      price={product.price * product.quantity} 
                      className="font-medium dark:text-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">{t('checkout.discountCode')}</h2>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder={t('checkout.enterCode')}
                  className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                  onClick={applyCoupon}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {t('checkout.apply')}
                </button>
              </div>
              
              {couponError && (
                <p className="mt-2 text-red-500 text-sm">{couponError}</p>
              )}
              
              {appliedCoupon && (
                <div className="mt-2 p-2 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 rounded flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  <span>
                    {t('checkout.couponApplied', { discount: appliedCoupon.discountPercent })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">{t('checkout_order_summary')}</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('checkout_subtotal')}</span>
                  <PriceDisplay price={subtotal} className="font-medium dark:text-white" />
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>{t('checkout_discount')}</span>
                    <span>-<PriceDisplay price={discount} /></span>
                  </div>
                )}
                
                <div className="pt-3 border-t dark:border-gray-700">
                  <div className="flex justify-between font-bold">
                    <span className="dark:text-white">{t('checkout_total')}</span>
                    <PriceDisplay price={total} className="text-lg dark:text-white" />
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setCurrentStep('details')}
                className="w-full px-4 py-3 mt-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
              >
                {t('checkout_proceed_to_details')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Details Step */}
      {currentStep === 'details' && (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">{t('checkout_customer_details')}</h2>
              
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-white">{t('checkout_form_full_name')}</label>
                    <input 
                      type="text" 
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      required
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-white">{t('checkout_form_email')}</label>
                    <input 
                      type="email" 
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      required
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">{t('checkout_form_phone')}</label>
                  <input 
                    type="tel" 
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    required
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-white">{t('checkout_form_address')}</label>
                  <input 
                    type="text" 
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    required
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-white">{t('checkout_form_city')}</label>
                    <input 
                      type="text" 
                      value={customerInfo.city}
                      onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                      required
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-white">{t('checkout_form_postal_code')}</label>
                    <input 
                      type="text" 
                      value={customerInfo.postalCode}
                      onChange={(e) => setCustomerInfo({...customerInfo, postalCode: e.target.value})}
                      required
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-white">{t('checkout_form_country')}</label>
                    <select 
                      value={customerInfo.country}
                      onChange={(e) => setCustomerInfo({...customerInfo, country: e.target.value})}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="Lithuania">Lithuania</option>
                      <option value="Latvia">Latvia</option>
                      <option value="Estonia">Estonia</option>
                      <option value="Poland">Poland</option>
                      <option value="Germany">Germany</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('review')}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {t('checkout_back')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {t('checkout_continue_to_payment')}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Order Summary (Same as in Review Step) */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">{t('checkout_order_summary')}</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('checkout_subtotal')}</span>
                  <PriceDisplay price={subtotal} className="font-medium dark:text-white" />
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>{t('checkout_discount')}</span>
                    <span>-<PriceDisplay price={discount} /></span>
                  </div>
                )}
                
                <div className="pt-3 border-t dark:border-gray-700">
                  <div className="flex justify-between font-bold">
                    <span className="dark:text-white">{t('checkout_total')}</span>
                    <PriceDisplay price={total} className="text-lg dark:text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Step */}
      {currentStep === 'payment' && (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">{t('checkout_payment_method')}</h2>
              
              <div className="space-y-4">
                <div className="flex items-center p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" 
                     onClick={() => setPaymentMethod('card')}>
                  <input 
                    type="radio" 
                    id="card" 
                    name="paymentMethod" 
                    checked={paymentMethod === 'card'} 
                    onChange={() => setPaymentMethod('card')} 
                    className="mr-3"
                  />
                  <label htmlFor="card" className="flex items-center cursor-pointer dark:text-white">
                    <div className="mr-3">
                      <svg width="40" height="25" viewBox="0 0 40 25" className="fill-current" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="25" rx="4" fill="#252525"/>
                        <rect x="4" y="12" width="23" height="3" rx="1" fill="#F4F4F4"/>
                        <rect x="4" y="17" width="9" height="3" rx="1" fill="#F4F4F4"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">{t('checkout_payments_credit_card')}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Visa, Mastercard, American Express</div>
                    </div>
                  </label>
                </div>
                
                <div className="flex items-center p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" 
                     onClick={() => setPaymentMethod('paypal')}>
                  <input 
                    type="radio" 
                    id="paypal" 
                    name="paymentMethod" 
                    checked={paymentMethod === 'paypal'} 
                    onChange={() => setPaymentMethod('paypal')} 
                    className="mr-3"
                  />
                  <label htmlFor="paypal" className="flex items-center cursor-pointer dark:text-white">
                    <div className="mr-3">
                      <svg width="40" height="25" viewBox="0 0 40 25" className="fill-current" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="25" rx="4" fill="#0070BA"/>
                        <path d="M15 8H10C9.44772 8 9 8.44772 9 9V16C9 16.5523 9.44772 17 10 17H15C16.6569 17 18 15.6569 18 14V11C18 9.34315 16.6569 8 15 8Z" fill="#003087"/>
                        <path d="M29 8H24C23.4477 8 23 8.44772 23 9V16C23 16.5523 23.4477 17 24 17H29C30.6569 17 32 15.6569 32 14V11C32 9.34315 30.6569 8 29 8Z" fill="#003087"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">PayPal</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t('checkout_payments_paypal_desc')}</div>
                    </div>
                  </label>
                </div>
                
                <div className="flex items-center p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" 
                     onClick={() => setPaymentMethod('banktransfer')}>
                  <input 
                    type="radio" 
                    id="banktransfer" 
                    name="paymentMethod" 
                    checked={paymentMethod === 'banktransfer'} 
                    onChange={() => setPaymentMethod('banktransfer')} 
                    className="mr-3"
                  />
                  <label htmlFor="banktransfer" className="flex items-center cursor-pointer dark:text-white">
                    <div className="mr-3">
                      <svg width="40" height="25" viewBox="0 0 40 25" className="fill-current" xmlns="http://www.w3.org/2000/svg">
                        <rect width="40" height="25" rx="4" fill="#E8E8E8"/>
                        <path d="M20 4L30 10H10L20 4Z" fill="#5C5C5C"/>
                        <rect x="13" y="11" width="14" height="9" rx="1" fill="#5C5C5C"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">{t('checkout_payments_bank_transfer')}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t('checkout_payments_bank_transfer_desc')}</div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-between pt-6 mt-4 border-t dark:border-gray-700">
                <button
                  onClick={() => setCurrentStep('details')}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  disabled={isProcessing}
                >
                  {t('checkout_back')}
                </button>
                <button
                  onClick={placeOrder}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      {t('checkout_processing')}
                    </>
                  ) : (
                    t('checkout_place_order')
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Order Summary (Same as in Review Step) */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">{t('checkout_order_summary')}</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('checkout_subtotal')}</span>
                  <PriceDisplay price={subtotal} className="font-medium dark:text-white" />
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>{t('checkout_discount')}</span>
                    <span>-<PriceDisplay price={discount} /></span>
                  </div>
                )}
                
                <div className="pt-3 border-t dark:border-gray-700">
                  <div className="flex justify-between font-bold">
                    <span className="dark:text-white">{t('checkout_total')}</span>
                    <PriceDisplay price={total} className="text-lg dark:text-white" />
                  </div>
                </div>
              </div>
              
              {/* Customer Information Summary */}
              <div className="mt-4 pt-4 border-t dark:border-gray-700">
                <h3 className="font-medium mb-2 dark:text-white">{t('checkout_delivery_details')}</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>{customerInfo.name}</p>
                  <p>{customerInfo.email}</p>
                  <p>{customerInfo.phone}</p>
                  <p>{customerInfo.address}</p>
                  <p>{customerInfo.city}, {customerInfo.postalCode}</p>
                  <p>{customerInfo.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmation Step */}
      {currentStep === 'confirmation' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle size={64} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4 dark:text-white">{t('checkout_order_success')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
            {t('checkout_order_thanks')}
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t('checkout_continue_shopping')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 