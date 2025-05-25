import type { Request, Response } from "express";
import InventoryItem from "../models/InventoryItem";
import { RequestHandler } from "express-serve-static-core";

export class InventoryController {
    static getAll = async (req: Request, res: Response) => {
        try {
        const items = await InventoryItem.find().sort({ createdAt: -1 });
        res.json(items);
        } catch (error) {
        console.error("Error al obtener inventario:", error);
        res.status(500).json({ message: "Error al obtener inventario" });
        }
    };

    static create = async (req: Request, res: Response) => {
        try {
        const { name, stock, minStock, provider } = req.body;
        const newItem = await InventoryItem.create({ name, stock, minStock, provider });
        res.status(201).json(newItem);
        } catch (error) {
        console.error("Error al agregar al inventario:", error);
        res.status(500).json({ message: "Error al agregar al inventario" });
        }
    };

    static update = async (req: Request, res: Response): Promise<void> => {
        try {
        const { id } = req.params;
        const { name, stock, minStock, provider } = req.body;

        const updatedItem = await InventoryItem.findByIdAndUpdate(
            id,
            { name, stock, minStock, provider },
            { new: true }
        );

        if (!updatedItem) {
            res.status(404).json({ message: "Ingrediente no encontrado" });
            return;
        }

        res.json(updatedItem);
        } catch (error: any) {
        console.error("Error al actualizar ingrediente:", error.message);
        res.status(500).json({ message: "Error al actualizar ingrediente" });
        }
    };

    static delete = async (req: Request, res: Response): Promise<void> => {
        try {
        const { id } = req.params;

        const deletedItem = await InventoryItem.findByIdAndDelete(id);

        if (!deletedItem) {
            res.status(404).json({ message: "Ingrediente no encontrado" });
            return;
        }

        res.json({ message: "Ingrediente eliminado correctamente" });
        } catch (error: any) {
        console.error("Error al eliminar ingrediente:", error.message);
        res.status(500).json({ message: "Error al eliminar ingrediente" });
        }
    };

}
