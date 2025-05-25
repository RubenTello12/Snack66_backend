"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = __importDefault(require("../middleware/upload"));
const CategoryController_1 = require("../controllers/CategoryController");
const router = express_1.default.Router();
router.get("/", CategoryController_1.getAllCategories);
router.get("/:id", CategoryController_1.getCategoryById);
router.post("/", upload_1.default.single("image"), CategoryController_1.createCategory);
router.delete("/:id", CategoryController_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map