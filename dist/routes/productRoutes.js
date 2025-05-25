"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductController_1 = require("../controllers/ProductController");
const router = (0, express_1.Router)();
router.get("/", ProductController_1.ProductController.getAll);
router.post("/", ProductController_1.ProductController.create);
router.put("/:id", ProductController_1.ProductController.update);
router.delete("/:id", ProductController_1.ProductController.delete);
router.delete('/by-category/:categoryId', ProductController_1.ProductController.deleteByCategory);
exports.default = router;
//# sourceMappingURL=productRoutes.js.map