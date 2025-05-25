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
exports.OrderController = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const InventoryItem_1 = __importDefault(require("../models/InventoryItem"));
class OrderController {
}
exports.OrderController = OrderController;
_a = OrderController;
OrderController.getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.query;
        const filter = {};
        if (status) {
            filter.status = status;
        }
        const orders = yield Order_1.default.find(filter)
            .populate("products.product")
            .sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        console.error("Error al obtener órdenes:", error.message);
        res.status(500).json({ message: "Error al obtener órdenes" });
    }
});
OrderController.getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const order = yield Order_1.default.findById(id).populate("products.product");
        if (!order) {
            res.status(404).json({ message: "Orden no encontrada" });
            return;
        }
        res.json(order);
    }
    catch (error) {
        console.error("Error al obtener la orden:", error.message);
        res.status(500).json({ message: "Error al obtener la orden" });
    }
});
OrderController.createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { client, table, type, products } = req.body;
        for (const ordered of products) {
            const product = yield Product_1.default.findById(ordered.product);
            if (!product) {
                res.status(404).json({ message: `Producto con ID ${ordered.product} no encontrado.` });
                return;
            }
            for (const ing of product.ingredients) {
                const totalRequired = ing.quantity * ordered.quantity;
                const item = yield InventoryItem_1.default.findOne({ name: ing.name });
                if (!item || item.stock < totalRequired) {
                    res.status(400).json({
                        message: `No hay suficiente stock de "${ing.name}" para "${product.name}". Faltan ${totalRequired - ((item === null || item === void 0 ? void 0 : item.stock) || 0)} unidades.`
                    });
                    return;
                }
            }
            for (const extra of ordered.extras || []) {
                const item = yield InventoryItem_1.default.findOne({ name: extra.name });
                if (!item || item.stock < ordered.quantity) {
                    res.status(400).json({
                        message: `No hay suficiente stock de extra "${extra.name}".`
                    });
                    return;
                }
            }
        }
        for (const ordered of products) {
            const product = yield Product_1.default.findById(ordered.product);
            if (!product)
                continue;
            for (const ing of product.ingredients) {
                const totalRequired = ing.quantity * ordered.quantity;
                yield InventoryItem_1.default.updateOne({ name: ing.name }, { $inc: { stock: -totalRequired } });
            }
            for (const extra of ordered.extras || []) {
                yield InventoryItem_1.default.updateOne({ name: extra.name }, { $inc: { stock: -ordered.quantity } });
            }
        }
        let total = 0;
        for (const ordered of products) {
            const product = yield Product_1.default.findById(ordered.product);
            if (!product)
                continue;
            const extrasTotal = (ordered.extras || []).reduce((sum, extra) => sum + (extra.price || 0), 0);
            total += (product.price + extrasTotal) * ordered.quantity;
        }
        const newOrder = yield Order_1.default.create({
            client,
            table,
            type,
            products,
            total,
        });
        res.status(201).json(newOrder);
    }
    catch (error) {
        console.error("Error al crear orden:", error.message);
        res.status(500).json({ message: "Error al crear orden" });
    }
});
OrderController.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { client, table, type, products, status } = req.body;
        const existingOrder = yield Order_1.default.findById(id);
        if (!existingOrder) {
            res.status(404).json({ message: "Orden no encontrada" });
            return;
        }
        for (const ordered of existingOrder.products) {
            const product = yield Product_1.default.findById(ordered.product);
            if (!product)
                continue;
            for (const ing of product.ingredients) {
                const totalToRestore = ing.quantity * ordered.quantity;
                yield InventoryItem_1.default.updateOne({ name: ing.name }, { $inc: { stock: totalToRestore } });
            }
            for (const extra of ordered.extras || []) {
                yield InventoryItem_1.default.updateOne({ name: extra.name }, { $inc: { stock: ordered.quantity } });
            }
        }
        for (const ordered of products) {
            const product = yield Product_1.default.findById(ordered.product);
            if (!product) {
                res.status(404).json({ message: `Producto con ID ${ordered.product} no encontrado.` });
                return;
            }
            for (const ing of product.ingredients) {
                const totalRequired = ing.quantity * ordered.quantity;
                const item = yield InventoryItem_1.default.findOne({ name: ing.name });
                if (!item || item.stock < totalRequired) {
                    res.status(400).json({
                        message: `No hay suficiente stock de "${ing.name}" para "${product.name}".`
                    });
                    return;
                }
            }
            for (const extra of ordered.extras || []) {
                const item = yield InventoryItem_1.default.findOne({ name: extra.name });
                if (!item || item.stock < ordered.quantity) {
                    res.status(400).json({
                        message: `No hay suficiente stock de extra "${extra.name}".`
                    });
                    return;
                }
            }
        }
        for (const ordered of products) {
            const product = yield Product_1.default.findById(ordered.product);
            if (!product)
                continue;
            for (const ing of product.ingredients) {
                const totalRequired = ing.quantity * ordered.quantity;
                yield InventoryItem_1.default.updateOne({ name: ing.name }, { $inc: { stock: -totalRequired } });
            }
            for (const extra of ordered.extras || []) {
                yield InventoryItem_1.default.updateOne({ name: extra.name }, { $inc: { stock: -ordered.quantity } });
            }
        }
        const updatedOrder = yield Order_1.default.findByIdAndUpdate(id, { client, table, type, products, status }, { new: true });
        res.json(updatedOrder);
    }
    catch (error) {
        console.error("Error al actualizar orden:", error.message);
        res.status(500).json({ message: "Error al actualizar orden" });
    }
});
OrderController.delete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const order = yield Order_1.default.findById(id);
        if (!order) {
            res.status(404).json({ message: "Orden no encontrada" });
            return;
        }
        for (const ordered of order.products) {
            const product = yield Product_1.default.findById(ordered.product);
            if (!product)
                continue;
            for (const ing of product.ingredients) {
                const totalToRestore = ing.quantity * ordered.quantity;
                yield InventoryItem_1.default.updateOne({ name: ing.name }, { $inc: { stock: totalToRestore } });
            }
            for (const extra of ordered.extras || []) {
                yield InventoryItem_1.default.updateOne({ name: extra.name }, { $inc: { stock: ordered.quantity } });
            }
        }
        yield Order_1.default.findByIdAndDelete(id);
        res.json({ message: "Orden eliminada y stock reestablecido correctamente" });
    }
    catch (error) {
        console.error("Error al eliminar orden:", error.message);
        res.status(500).json({ message: "Error al eliminar orden" });
    }
});
OrderController.updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    if (!['en curso', 'pago pendiente', 'pagado'].includes(status)) {
        res.status(400).json({ message: "Estado inválido" });
        return;
    }
    const updated = yield Order_1.default.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updated);
});
OrderController.getInProgressOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.default.find({ status: 'en curso' }).populate("products.product");
        res.json(orders);
    }
    catch (error) {
        console.error("Error al obtener órdenes en curso:", error.message);
        res.status(500).json({ message: "Error al obtener órdenes en curso" });
    }
});
OrderController.getPendingPaymentOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.default.find({ status: 'pago pendiente' }).populate("products.product");
        res.json(orders);
    }
    catch (error) {
        console.error("Error al obtener órdenes de pago pendiente:", error.message);
        res.status(500).json({ message: "Error al obtener órdenes de pago pendiente" });
    }
});
OrderController.getPaidOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.default.find({ status: "pagado" }).populate("products.product");
        res.json(orders);
    }
    catch (error) {
        console.error("Error al obtener órdenes pagadas:", error);
        res.status(500).json({ message: "Error al obtener órdenes pagadas" });
    }
});
//# sourceMappingURL=OrderController.js.map