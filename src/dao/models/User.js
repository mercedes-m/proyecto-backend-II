import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true
    },
    last_name: {
      type: String,
      required: [true, 'El apellido es obligatorio'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Formato de email inválido']
    },
    age: {
      type: Number,
      required: [true, 'La edad es obligatoria'],
      min: [0, 'La edad no puede ser negativa']
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria']
      
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Carts',
      default: null
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  {
    timestamps: true // Crea automáticamente createdAt y updatedAt
  }
);

export const User = mongoose.model('User', userSchema);