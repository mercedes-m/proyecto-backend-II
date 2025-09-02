import { ProductDTO } from './ProductDTO.js';

export class CartDTO {
  constructor(cart) {
    this.id = cart._id || cart.id;

    // Mapear productos dentro del carrito
    this.products = cart.products?.map(item => ({
      product: new ProductDTO(item.product),
      quantity: item.quantity
    })) || [];

    // Calcular total aproximado
    this.total = this.products.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
  }
}