import { Router } from 'express';
import { TicketController } from '../controllers/ticketController.js';

const router = Router();

// Endpoint para generar un ticket a partir del carrito
router.post('/purchase/:cid', TicketController.purchaseCart);

export default router;