"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const InventoryController_1 = require("../controllers/InventoryController");
const router = (0, express_1.Router)();
router.get("/", InventoryController_1.InventoryController.getAll);
router.post("/", InventoryController_1.InventoryController.create);
router.put("/:id", InventoryController_1.InventoryController.update);
router.delete("/:id", InventoryController_1.InventoryController.delete);
exports.default = router;
//# sourceMappingURL=inventoryRoutes.js.map