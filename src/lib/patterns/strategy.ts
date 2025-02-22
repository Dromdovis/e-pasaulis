// Strategy Pattern for Payment Processing
interface PaymentStrategy {
  pay(amount: number): Promise<boolean>;
}

export class CreditCardPayment implements PaymentStrategy {
  constructor(private cardNumber: string, private cvv: string) {}

  async pay(amount: number): Promise<boolean> {
    // Implementation for credit card payment
    console.log(`Processing credit card payment for ${amount}`);
    return true;
  }
}

export class PayPalPayment implements PaymentStrategy {
  constructor(private email: string) {}

  async pay(amount: number): Promise<boolean> {
    // Implementation for PayPal payment
    console.log(`Processing PayPal payment for ${amount}`);
    return true;
  }
}

export class PaymentProcessor {
  constructor(private strategy: PaymentStrategy) {}

  setStrategy(strategy: PaymentStrategy): void {
    this.strategy = strategy;
  }

  async processPayment(amount: number): Promise<boolean> {
    return await this.strategy.pay(amount);
  }
} 