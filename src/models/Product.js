import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    category: { type: String, required: true, trim: true, index: true },
    description: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
