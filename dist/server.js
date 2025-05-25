"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const inventoryRoutes_1 = __importDefault(require("./routes/inventoryRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const extraRoutes_1 = __importDefault(require("./routes/extraRoutes"));
dotenv_1.default.config();
(0, db_1.connectDB)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//Routes
app.use("/api/inventory", inventoryRoutes_1.default);
app.use("/api/categories", categoryRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/extras", extraRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use("/uploads", express_1.default.static("uploads"));
exports.default = app;
//# sourceMappingURL=server.js.map