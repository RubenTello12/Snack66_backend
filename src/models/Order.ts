import mongoose, { Schema, Document, Types } from "mongoose";

export type OrderedProduct = {
  product: mongoose.Types.ObjectId;
  quantity: number;
  extras?: { name: string; price: number }[]; 
};

export type OrderType = Document & {
  client: string;
  table?: number;
  address?: string;
  type: 'restaurante' | 'para llevar' | 'pickup';
  products: OrderedProduct[];
  total: number;
  status: 'en curso' | 'pago pendiente' | 'pagado' | 'cancelado';
  timeCreated?: Date;
};

const OrderSchema: Schema = new Schema({
  client: {
    type: String,
    required: true,
    trim: true
  },
  table: {
    type: Number
  },
  address: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['restaurante', 'para llevar', 'pickup'],
    required: true
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      },
      extras: [
        {
          name: { type: String },
          price: { type: Number }
        }
      ]
    }
  ],
  total: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['en curso', 'pago pendiente', 'pagado', 'cancelado'],
    default: 'en curso'
  },
  timeCreated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Order = mongoose.model<OrderType>('Order', OrderSchema);
export default Order;
