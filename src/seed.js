import mongoose from 'mongoose';
import { Product } from './models/Product.js';

await mongoose.connect(process.env.MONGODB_URI);
await Product.deleteMany({});
await Product.insertMany([
  { name: 'Laptop Pro 14', price: 1499.99, stock: 12, category: 'Electrónica', description: 'Portátil de 14 pulgadas' },
  { name: 'Auriculares Bluetooth', price: 59.9, stock: 40, category: 'Electrónica', description: 'Cancelación de ruido' },
  { name: 'Silla ergonómica', price: 219, stock: 0, category: 'Hogar', description: 'Soporte lumbar ajustable' },
  { name: 'Lámpara de escritorio', price: 29.5, stock: 25, category: 'Hogar', description: 'LED regulable' },
  { name: 'Mochila urbana', price: 45, stock: 18, category: 'Accesorios', description: 'Impermeable, 20L' },
]);
console.log('Datos de ejemplo insertados');
if (!process.env.KEEP_CONNECTION) await mongoose.disconnect();
