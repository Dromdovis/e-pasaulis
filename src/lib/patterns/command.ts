// Command Pattern for Cart Operations
interface CartCommand {
  execute(): void;
  undo(): void;
}

export class CartItem {
  constructor(
    public productId: string,
    public quantity: number,
    public price: number
  ) {}
}

export class Cart {
  private items: Map<string, CartItem> = new Map();

  addItem(item: CartItem): void {
    this.items.set(item.productId, item);
  }

  removeItem(productId: string): void {
    this.items.delete(productId);
  }

  getItems(): CartItem[] {
    return Array.from(this.items.values());
  }
}

export class AddToCartCommand implements CartCommand {
  private previousState?: CartItem;

  constructor(
    private cart: Cart,
    private item: CartItem
  ) {}

  execute(): void {
    const existingItem = this.cart.getItems().find(i => i.productId === this.item.productId);
    if (existingItem) {
      this.previousState = {...existingItem};
    }
    this.cart.addItem(this.item);
  }

  undo(): void {
    if (this.previousState) {
      this.cart.addItem(this.previousState);
    } else {
      this.cart.removeItem(this.item.productId);
    }
  }
} 