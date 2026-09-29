export const typeDefs = `#graphql
  type Product {
    id: ID!
    name: String!
    price: Float!
    stock: Int!
    category: String!
    description: String
  }

  input ProductFilter {
    "Búsqueda parcial (sin distinguir mayúsculas) por nombre"
    name: String
    category: String
    minPrice: Float
    maxPrice: Float
    inStock: Boolean
  }

  enum ProductSortField {
    name
    price
    stock
    category
  }

  enum SortOrder {
    ASC
    DESC
  }

  input CreateProductInput {
    name: String!
    price: Float!
    stock: Int = 0
    category: String!
    description: String
  }

  "Solo se actualizan los campos enviados"
  input UpdateProductInput {
    name: String
    price: Float
    stock: Int
    category: String
    description: String
  }

  type Query {
    products(
      filter: ProductFilter
      sortBy: ProductSortField = name
      order: SortOrder = ASC
      limit: Int = 50
      offset: Int = 0
    ): [Product!]!
    product(id: ID!): Product
    categories: [String!]!
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product
    deleteProduct(id: ID!): Boolean!
  }
`;
