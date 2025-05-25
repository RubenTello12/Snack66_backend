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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExtra = exports.createExtra = exports.getAllExtras = void 0;
const Extra_1 = __importDefault(require("../models/Extra"));
const InventoryItem_1 = __importDefault(require("../models/InventoryItem"));
const getAllExtras = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const extras = yield Extra_1.default.find().sort({ createdAt: -1 });
        res.json(extras);
    }
    catch (error) {
        console.error("Error al obtener extras:", error.message);
        res.status(500).json({ message: "Error al obtener extras" });
    }
});
exports.getAllExtras = getAllExtras;
const createExtra = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, ingredient, quantityUsed } = req.body;
        if (!name || !price || !ingredient || !quantityUsed) {
            res.status(400).json({ message: "Faltan campos requeridos" });
            return;
        }
        // Validar si el ingrediente existe en el inventario
        const exists = yield InventoryItem_1.default.findOne({ name: ingredient });
        if (!exists) {
            res.status(400).json({ message: `El ingrediente '${ingredient}' no existe en el inventario` });
            return;
        }
        const newExtra = yield Extra_1.default.create({
            name,
            price,
            ingredient,
            quantityUsed
        });
        res.status(201).json(newExtra);
    }
    catch (error) {
        console.error("Error al crear extra:", error.message);
        res.status(500).json({ message: "Error al crear extra" });
    }
});
exports.createExtra = createExtra;
const deleteExtra = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield Extra_1.default.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ message: "Extra no encontrado" });
            return;
        }
        res.json({ message: "Extra eliminado correctamente" });
    }
    catch (error) {
        console.error("Error al eliminar extra:", error.message);
        res.status(500).json({ message: "Error al eliminar extra" });
    }
});
exports.deleteExtra = deleteExtra;
//# sourceMappingURL=ExtraController.js.map