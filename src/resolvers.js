import mongoose from 'mongoose';
import { GraphQLError } from 'graphql';
import { Product } from './models/Product.js';

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const assertValidId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new GraphQLError(`ID inválido: ${id}`, {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
};

const buildQuery = (filter = {}) => {
  const q = {};
  if (filter.name) q.name = { $regex: escapeRegex(filter.name), $options: 'i' };
  if (filter.category) {
    q.category = { $regex: `^${escapeRegex(filter.category)}$`, $options: 'i' };
  }
  if (filter.minPrice != null || filter.maxPrice != null) {
    q.price = {};
    if (filter.minPrice != null) q.price.$gte = filter.minPrice;
    if (filter.maxPrice != null) q.price.$lte = filter.maxPrice;
  }
  if (filter.inStock === true) q.stock = { $gt: 0 };
  if (filter.inStock === false) q.stock = 0;
  return q;
};

export const resolvers = {
  Query: {
    products: (_, { filter, sortBy, order, limit, offset }) =>
      Product.find(buildQuery(filter))
        .sort({ [sortBy]: order === 'DESC' ? -1 : 1 })
        .skip(Math.max(offset, 0))
        .limit(Math.min(Math.max(limit, 1), 200)),
    product: (_, { id }) => {
      assertValidId(id);
      return Product.findById(id);
    },
    categories: () => Product.distinct('category').exec(),
  },
  Mutation: {
    createProduct: (_, { input }) => Product.create(input),
    updateProduct: (_, { id, input }) => {
      assertValidId(id);
      // Ignora campos null para no violar validaciones de campos requeridos
      const update = Object.fromEntries(
        Object.entries(input).filter(([, v]) => v != null)
      );
      return Product.findByIdAndUpdate(id, { $set: update }, {
        new: true,
        runValidators: true,
      });
    },
    deleteProduct: async (_, { id }) => {
      assertValidId(id);
      return (await Product.findByIdAndDelete(id)) !== null;
    },
  },
};
