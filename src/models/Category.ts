import mongoose, { Schema, Document } from "mongoose";

export type CategoryType = Document & {
  name: string;
  imageUrl?: string;
};

const CategorySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Category = mongoose.model<CategoryType>("Category", CategorySchema);
export default Category;
