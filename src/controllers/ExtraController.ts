import { Request, Response } from "express";
import Extra from "../models/Extra";
import InventoryItem from "../models/InventoryItem";

export const getAllExtras = async (_req: Request, res: Response) => {
  try {
    const extras = await Extra.find().sort({ createdAt: -1 });
    res.json(extras);
  } catch (error: any) {
    console.error("Error al obtener extras:", error.message);
    res.status(500).json({ message: "Error al obtener extras" });
  }
};

export const createExtra = async (req: Request, res: Response) => {
  try {
    const { name, price, ingredient, quantityUsed } = req.body;

    if (!name || !price || !ingredient || !quantityUsed) {
       res.status(400).json({ message: "Faltan campos requeridos" });
       return
    }

    // Validar si el ingrediente existe en el inventario
    const exists = await InventoryItem.findOne({ name: ingredient });
    if (!exists) {
       res.status(400).json({ message: `El ingrediente '${ingredient}' no existe en el inventario` });
       return
    }

    const newExtra = await Extra.create({
      name,
      price,
      ingredient,
      quantityUsed
    });

    res.status(201).json(newExtra);
  } catch (error: any) {
    console.error("Error al crear extra:", error.message);
    res.status(500).json({ message: "Error al crear extra" }); 
  }
};

export const deleteExtra = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await Extra.findByIdAndDelete(id);
    if (!deleted) {
       res.status(404).json({ message: "Extra no encontrado" });
       return
    }

    res.json({ message: "Extra eliminado correctamente" });
  } catch (error: any) {
    console.error("Error al eliminar extra:", error.message);
    res.status(500).json({ message: "Error al eliminar extra" });
  }
};
