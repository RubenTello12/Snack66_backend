import mongoose, { Schema, Document, Types } from "mongoose";

export type IngredientType = {
  name: string;
  quantity: number;
};

export type ExtraType = {
  name: string;
  price: number;
}

export type ProductType = Document & {
  name: string;
  price: number;
  description?: string;
  ingredients: IngredientType[];
  imageUrl?: string;
  category:Types.ObjectId;
  extras?: ExtraType[];
};

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  ingredients: [
    {
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  imageUrl: {
    type: String,
    trim: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  extras: [
    {
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ]
}, {
  timestamps: true
});

const Product = mongoose.model<ProductType>('Product', ProductSchema);
export default Product;
