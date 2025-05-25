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
exports.deleteCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const Category_1 = __importDefault(require("../models/Category"));
// Obtener todas las categorías
const getAllCategories = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Category_1.default.find().sort({ createdAt: -1 });
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: "Error al obtener categorías" });
    }
});
exports.getAllCategories = getAllCategories;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield Category_1.default.findById(id);
        if (!category) {
            res.status(404).json({ message: "Categoría no encontrada" });
            return;
        }
        res.json(category);
    }
    catch (error) {
        console.error("Error al obtener categoría:", error);
        res.status(500).json({ message: "Error al obtener la categoría" });
    }
});
exports.getCategoryById = getCategoryById;
// Crear una nueva categoría
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name } = req.body;
        const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        if (!name || !image) {
            res.status(400).json({ message: "Faltan campos requeridos" });
            return;
        }
        const imageUrl = `http://localhost:4000/uploads/${image}`;
        const newCategory = yield Category_1.default.create({ name, imageUrl });
        res.status(201).json(newCategory);
    }
    catch (error) {
        console.error("Error al crear categoría:", error);
        res.status(500).json({ message: "Error del servidor" });
    }
});
exports.createCategory = createCategory;
// Eliminar una categoría
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield Category_1.default.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ message: "Categoría no encontrada" });
            return;
        }
        res.json({ message: "Categoría eliminada correctamente" });
    }
    catch (error) {
        res.status(500).json({ message: "Error al eliminar la categoría" });
    }
});
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=CategoryController.js.map