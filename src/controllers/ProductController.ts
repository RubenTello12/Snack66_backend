// src/controllers/ProductController.ts
import { Request, Response } from "express";
import Product from "../models/Product";
import InventoryItem from "../models/InventoryItem";
import Order from "../models/Order";

export class ProductController {
  static getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category } = req.query;
      const filter = category ? { category } : {};
      const products = await Product.find(filter).sort({ createdAt: -1 });
      res.json(products);
    } catch (error: any) {
      console.error("Error al obtener productos:", error.message);
      res.status(500).json({ message: "Error al obtener productos" });
    }
  };

  static create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, price, description, ingredients, imageUrl, category, extras } = req.body;

      if (!name || !price || !category) {
        res.status(400).json({ message: "Faltan campos obligatorios" });
        return;
      }

      const missingIngredients: string[] = [];
      for (const ing of ingredients) {
        const exists = await InventoryItem.findOne({ name: ing.name });
        if (!exists) {
          missingIngredients.push(ing.name);
        }
      }

      if (missingIngredients.length > 0) {
        res.status(400).json({
          message: "Algunos ingredientes no existen en el inventario",
          missing: missingIngredients,
        });
        return;
      }

      const newProduct = await Product.create({
        name,
        price,
        description,
        ingredients,
        imageUrl,
        category,
        extras,
      });

      res.status(201).json(newProduct);
    } catch (error: any) {
      console.error("Error al crear producto:", error.message);
      res.status(500).json({ message: "Error al crear producto" });
    }
  };

  static update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, price, description, ingredients, imageUrl, category, extras } = req.body;

      if (!name || !price || !category) {
        res.status(400).json({ message: "Faltan campos obligatorios" });
        return;
      }

      const missingIngredients: string[] = [];
      for (const ing of ingredients) {
        const exists = await InventoryItem.findOne({ name: ing.name });
        if (!exists) {
          missingIngredients.push(ing.name);
        }
      }

      if (missingIngredients.length > 0) {
        res.status(400).json({
          message: "Algunos ingredientes no existen en el inventario",
          missing: missingIngredients,
        });
        return;
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, price, description, ingredients, imageUrl, category, extras },
        { new: true }
      );

      if (!updatedProduct) {
        res.status(404).json({ message: "Producto no encontrado" });
        return;
      }

      res.json(updatedProduct);
    } catch (error: any) {
      console.error("Error al actualizar producto:", error.message);
      res.status(500).json({ message: "Error al actualizar producto" });
    }
  };

  static delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const activeOrders = await Order.find({
        status: "en curso",
        "products.product": id
      });

      if (activeOrders.length > 0) {
        res.status(400).json({
          message: "Este producto está siendo utilizado en órdenes en curso y no puede ser eliminado."
        });
        return;
      }

      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
        res.status(404).json({ message: "Producto no encontrado" });
        return;
      }

      res.json({ message: "Producto eliminado correctamente" });

    } catch (error: any) {
      console.error("Error al eliminar producto:", error.message);
      res.status(500).json({ message: "Error al eliminar producto" });
    }
  };

  static deleteByCategory = async (req: Request, res: Response): Promise<void> => {
    const { categoryId } = req.params;

    try {
      await Product.deleteMany({ category: categoryId });
      res.status(200).json({ message: "Productos eliminados exitosamente" });
    } catch (error: any) {
      console.error("Error al eliminar productos por categoría:", error.message);
      res.status(500).json({ message: "Error al eliminar productos por categoría" });
    }
  };
}
