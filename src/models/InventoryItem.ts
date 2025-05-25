import mongoose, { Schema, Document } from "mongoose";

export type InventoryItemType = Document & {
  name: string;
  stock: number;
  minStock: number;
  provider?: string;
};

const InventoryItemSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  stock: {
    type: Number,
    required: true
  },
  minStock: {
    type: Number,
    default: 0
  },
  provider: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const InventoryItem = mongoose.model<InventoryItemType>('InventoryItem', InventoryItemSchema);
export default InventoryItem;
