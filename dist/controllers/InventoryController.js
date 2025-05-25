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
exports.InventoryController = void 0;
const InventoryItem_1 = __importDefault(require("../models/InventoryItem"));
class InventoryController {
}
exports.InventoryController = InventoryController;
_a = InventoryController;
InventoryController.getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield InventoryItem_1.default.find().sort({ createdAt: -1 });
        res.json(items);
    }
    catch (error) {
        console.error("Error al obtener inventario:", error);
        res.status(500).json({ message: "Error al obtener inventario" });
    }
});
InventoryController.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, stock, minStock, provider } = req.body;
        const newItem = yield InventoryItem_1.default.create({ name, stock, minStock, provider });
        res.status(201).json(newItem);
    }
    catch (error) {
        console.error("Error al agregar al inventario:", error);
        res.status(500).json({ message: "Error al agregar al inventario" });
    }
});
InventoryController.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, stock, minStock, provider } = req.body;
        const updatedItem = yield InventoryItem_1.default.findByIdAndUpdate(id, { name, stock, minStock, provider }, { new: true });
        if (!updatedItem) {
            res.status(404).json({ message: "Ingrediente no encontrado" });
            return;
        }
        res.json(updatedItem);
    }
    catch (error) {
        console.error("Error al actualizar ingrediente:", error.message);
        res.status(500).json({ message: "Error al actualizar ingrediente" });
    }
});
InventoryController.delete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedItem = yield InventoryItem_1.default.findByIdAndDelete(id);
        if (!deletedItem) {
            res.status(404).json({ message: "Ingrediente no encontrado" });
            return;
        }
        res.json({ message: "Ingrediente eliminado correctamente" });
    }
    catch (error) {
        console.error("Error al eliminar ingrediente:", error.message);
        res.status(500).json({ message: "Error al eliminar ingrediente" });
    }
});
//# sourceMappingURL=InventoryController.js.map