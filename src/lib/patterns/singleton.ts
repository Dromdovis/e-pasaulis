// Singleton Pattern for Shopping Cart
export class CartManager {
  private static instance: CartManager;
  private cart: Cart;

  private constructor() {
    this.cart = new Cart();
  }

  public static getInstance(): CartManager {
    if (!CartManager.instance) {
      CartManager.instance = new CartManager();
    }
    return CartManager.instance;
  }

  public getCart(): Cart {
    return this.cart;
  }
} 