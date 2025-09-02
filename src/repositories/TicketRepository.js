import TicketModel from '../dao/models/TicketModel.js';

export class TicketRepository {
  // Crear un nuevo ticket
  async create(ticketData) {
    return await TicketModel.create(ticketData);
  }

  // Obtener todos los tickets
  async getAll() {
    return await TicketModel.find().populate('purchaser').populate('products.product').lean();
  }

  // Obtener ticket por ID
  async getById(id) {
    return await TicketModel.findById(id).populate('purchaser').populate('products.product').lean();
  }

  // Buscar ticket por código
  async getByCode(code) {
    return await TicketModel.findOne({ code }).populate('purchaser').populate('products.product').lean();
  }
}