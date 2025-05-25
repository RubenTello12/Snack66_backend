import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db'
import orderRoutes from './routes/orderRoutes'
import inventoryRoutes from "./routes/inventoryRoutes"
import productRoutes from "./routes/productRoutes"
import categoryRoutes from "./routes/categoryRoutes"
import extraRoutes from "./routes/extraRoutes"

dotenv.config()

connectDB()

const app = express();

app.use(cors());
app.use(express.json());

//Routes
app.use("/api/inventory", inventoryRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/extras", extraRoutes);
app.use('/api/orders', orderRoutes)

app.use("/uploads", express.static("uploads"));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

export default app