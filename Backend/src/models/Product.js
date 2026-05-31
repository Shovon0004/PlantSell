import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, index: true },
  stock: { type: Number, required: true, default: 0 },
  images: [{ type: String }],
  category: { type: String, required: true, index: true }, // e.g. plants, medicines, pots, accessories
  type: { type: String, required: true, index: true }, // e.g. indoor, outdoor, fertilizer, ceramic, soil
  tags: [{ type: String, index: true }],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  discount: { type: Number, default: 0 }, // Discount percentage
  isFeatured: { type: Boolean, default: false, index: true },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

// Text index for search functionality
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
