import { Request, Response } from "express";
import Category from "../models/Category";

// Obtener todas las categorías
export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener categorías" });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
       res.status(404).json({ message: "Categoría no encontrada" });
       return
    }
    res.json(category);
  } catch (error) {
    console.error("Error al obtener categoría:", error);
    res.status(500).json({ message: "Error al obtener la categoría" });
  }
};

// Crear una nueva categoría
export const createCategory = async (req: Request & { file?: Express.Multer.File }, res: Response) => {
  try {
    const { name } = req.body;
    const image = req.file?.filename;

    if (!name || !image) {
       res.status(400).json({ message: "Faltan campos requeridos" });
       return
    }

    const imageUrl = `https://snack66-backend.onrender.com/uploads/${image}`;

    const newCategory = await Category.create({ name, imageUrl });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error al crear categoría:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
// Eliminar una categoría
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
        res.status(404).json({ message: "Categoría no encontrada" });
        return
    }
    res.json({ message: "Categoría eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la categoría" });
  }
};
