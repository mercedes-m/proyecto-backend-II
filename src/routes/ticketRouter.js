import { Router } from 'express';
import { TicketController } from '../controllers/ticketController.js';

const ticketRouter = Router();
const ticketController = new TicketController();

// Endpoint para generar un ticket a partir del carrito
ticketRouter.post('/purchase/:cid', ticketController.purchaseCart.bind(ticketController));

export default ticketRouter;