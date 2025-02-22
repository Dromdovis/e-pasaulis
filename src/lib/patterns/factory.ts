// Factory Pattern for Product Creation
interface ProductSpecs {
  [key: string]: string | number | boolean;
}

export abstract class Product {
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public specifications: ProductSpecs,
    public stock: number = 0,
    public category: string
  ) {}

  abstract getType(): string;
  abstract validateSpecs(): boolean;
}

// Processor specific product
export class Processor extends Product {
  getType(): string {
    return 'processor';
  }

  validateSpecs(): boolean {
    const requiredSpecs = [
      'Branduoliai',
      'Gijos',
      'Bazinis dažnis',
      'Turbo dažnis',
      'Cache',
      'TDP',
      'Lizdas'
    ];
    return requiredSpecs.every(spec => 
      this.specifications[spec] !== undefined
    );
  }
}

// Smartphone specific product
export class Smartphone extends Product {
  getType(): string {
    return 'smartphone';
  }

  validateSpecs(): boolean {
    const requiredSpecs = [
      'Ekranas',
      'Procesorius',
      'Atmintis',
      'Kamera',
      'Baterija',
      'Operacinė sistema'
    ];
    return requiredSpecs.every(spec => 
      this.specifications[spec] !== undefined
    );
  }
}

// Laptop specific product
export class Laptop extends Product {
  getType(): string {
    return 'laptop';
  }

  validateSpecs(): boolean {
    const requiredSpecs = [
      'Procesorius',
      'Operatyvioji atmintis',
      'Kietasis diskas',
      'Ekranas',
      'Operacinė sistema'
    ];
    return requiredSpecs.every(spec => 
      this.specifications[spec] !== undefined
    );
  }
}

// Graphics Card specific product
export class GraphicsCard extends Product {
  getType(): string {
    return 'graphics-card';
  }

  validateSpecs(): boolean {
    const requiredSpecs = [
      'Chip',
      'Memory',
      'Memory Type',
      'Core Clock',
      'Power Consumption'
    ];
    return requiredSpecs.every(spec => 
      this.specifications[spec] !== undefined
    );
  }
}

export class ProductFactory {
  static createProduct(type: string, data: {
    id: string;
    name: string;
    price: number;
    specifications: ProductSpecs;
    stock?: number;
    category: string;
  }): Product {
    switch (type.toLowerCase()) {
      case 'processor':
      case 'cpu':
        return new Processor(
          data.id, 
          data.name, 
          data.price, 
          data.specifications,
          data.stock,
          data.category
        );
      
      case 'smartphone':
      case 'phone':
        return new Smartphone(
          data.id, 
          data.name, 
          data.price, 
          data.specifications,
          data.stock,
          data.category
        );
      
      case 'laptop':
      case 'notebook':
        return new Laptop(
          data.id, 
          data.name, 
          data.price, 
          data.specifications,
          data.stock,
          data.category
        );
      
      case 'graphics-card':
      case 'gpu':
        return new GraphicsCard(
          data.id, 
          data.name, 
          data.price, 
          data.specifications,
          data.stock,
          data.category
        );

      default:
        throw new Error(`Unknown product type: ${type}`);
    }
  }
} 