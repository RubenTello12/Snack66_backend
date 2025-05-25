"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const InventoryItem_1 = __importDefault(require("../models/InventoryItem"));
class ProductController {
}
exports.ProductController = ProductController;
_a = ProductController;
ProductController.getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};
        const products = yield Product_1.default.find(filter).sort({ createdAt: -1 });
        res.json(products);
    }
    catch (error) {
        console.error("Error al obtener productos:", error.message);
        res.status(500).json({ message: "Error al obtener productos" });
    }
});
ProductController.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, description, ingredients, imageUrl, category, extras } = req.body;
        if (!name || !price || !category) {
            res.status(400).json({ message: "Faltan campos obligatorios" });
            return;
        }
        const missingIngredients = [];
        for (const ing of ingredients) {
            const exists = yield InventoryItem_1.default.findOne({ name: ing.name });
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
        const newProduct = yield Product_1.default.create({
            name,
            price,
            description,
            ingredients,
            imageUrl,
            category,
            extras,
        });
        res.status(201).json(newProduct);
    }
    catch (error) {
        console.error("Error al crear producto:", error.message);
        res.status(500).json({ message: "Error al crear producto" });
    }
});
ProductController.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, price, description, ingredients, imageUrl, category, extras } = req.body;
        if (!name || !price || !category) {
            res.status(400).json({ message: "Faltan campos obligatorios" });
            return;
        }
        const missingIngredients = [];
        for (const ing of ingredients) {
            const exists = yield InventoryItem_1.default.findOne({ name: ing.name });
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
        const updatedProduct = yield Product_1.default.findByIdAndUpdate(id, { name, price, description, ingredients, imageUrl, category, extras }, { new: true });
        if (!updatedProduct) {
            res.status(404).json({ message: "Producto no encontrado" });
            return;
        }
        res.json(updatedProduct);
    }
    catch (error) {
        console.error("Error al actualizar producto:", error.message);
        res.status(500).json({ message: "Error al actualizar producto" });
    }
});
ProductController.delete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedProduct = yield Product_1.default.findByIdAndDelete(id);
        if (!deletedProduct) {
            res.status(404).json({ message: "Producto no encontrado" });
            return;
        }
        res.json({ message: "Producto eliminado correctamente" });
    }
    catch (error) {
        console.error("Error al eliminar producto:", error.message);
        res.status(500).json({ message: "Error al eliminar producto" });
    }
});
ProductController.deleteByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    try {
        yield Product_1.default.deleteMany({ category: categoryId });
        res.status(200).json({ message: "Productos eliminados exitosamente" });
    }
    catch (error) {
        console.error("Error al eliminar productos por categoría:", error.message);
        res.status(500).json({ message: "Error al eliminar productos por categoría" });
    }
});
//# sourceMappingURL=ProductController.js.map