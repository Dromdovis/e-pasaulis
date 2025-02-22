'use client';

import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { PaymentProcessor, CreditCardPayment, PayPalPayment } from '../../lib/patterns/strategy';

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'paypal'>('credit-card');
  const [processing, setProcessing] = useState(false);

  const handleCheckout = async () => {
    setProcessing(true);
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let paymentStrategy;
    if (paymentMethod === 'credit-card') {
      paymentStrategy = new CreditCardPayment('4111111111111111', '123');
    } else {
      paymentStrategy = new PayPalPayment('user@example.com');
    }

    const paymentProcessor = new PaymentProcessor(paymentStrategy);

    try {
      const success = await paymentProcessor.processPayment(total);
      if (success) {
        // Handle successful payment
        console.log('Payment successful');
      }
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      
      {/* Payment Method Selection */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
        <select 
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as 'credit-card' | 'paypal')}
          className="w-full p-2 border rounded"
        >
          <option value="credit-card">Credit Card</option>
          <option value="paypal">PayPal</option>
        </select>
      </div>

      {/* Order Summary */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
        {cartItems.map(item => (
          <div key={item.productId} className="flex justify-between py-2">
            <span>Product {item.productId}</span>
            <span>{item.quantity} x ${item.price}</span>
          </div>
        ))}
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={processing}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {processing ? 'Processing...' : 'Complete Purchase'}
      </button>
    </div>
  );
} 