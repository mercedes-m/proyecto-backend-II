import { TicketService } from '../services/TicketService.js';

const ticketService = new TicketService();

export class TicketController {
  // Método de instancia en lugar de static
  async purchase(req, res) {
    try {
      const { cartId } = req.body;
      const purchaserId = req.user.id; // req.user viene del middleware de auth

      const { ticket, remainingProducts } = await ticketService.purchaseCart(cartId, purchaserId);

      res.status(201).json({
        status: 'success',
        message: 'Compra procesada correctamente',
        ticket,
        remainingProducts,
      });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}