# API GraphQL de Productos

Express + Apollo Server 5 + Mongoose (MongoDB Atlas).

## Local
1. `npm install`
2. Copia `.env.example` a `.env` y completa `MONGODB_URI`.
3. `npm run seed` (datos de ejemplo, opcional) y `npm run dev`.
4. Abre http://localhost:4000/graphql (Apollo Sandbox).

## Ejemplos
```graphql
query {
  products(filter: { category: "Hogar", minPrice: 20, inStock: true }, sortBy: price, order: DESC) {
    id name price stock category description
  }
}

mutation {
  updateProduct(id: "<ID>", input: { price: 49.9, stock: 10 }) { id name price stock }
}
```

## Despliegue en Render
- Web Service, Build: `npm install`, Start: `npm start`.
- Variable de entorno: `MONGODB_URI` (no subas `.env` al repositorio). Render define `PORT` solo.
- Health check path: `/health`.
- En Atlas → Network Access, permite la IP de Render (o `0.0.0.0/0`).
