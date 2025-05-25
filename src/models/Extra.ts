import mongoose, { Schema, Document } from "mongoose";

export type ExtraType = Document & {
  name: string;             
  price: number;             
  ingredient: string;        
  quantityUsed: number;
};

const ExtraSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  ingredient: {
    type: String,
    required: true, 
    trim: true
  },
  quantityUsed: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  }
}, {
  timestamps: true
});

const Extra = mongoose.model<ExtraType>('Extra', ExtraSchema);
export default Extra;
