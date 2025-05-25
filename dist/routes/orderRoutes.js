"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderController_1 = require("../controllers/OrderController");
const router = (0, express_1.Router)();
router.post('/', OrderController_1.OrderController.createOrder);
router.get('/', OrderController_1.OrderController.getAllOrders);
router.get("/in-progress", OrderController_1.OrderController.getInProgressOrders);
router.get("/pending-payment", OrderController_1.OrderController.getPendingPaymentOrders);
router.get("/paid", OrderController_1.OrderController.getPaidOrders);
router.get("/:id", OrderController_1.OrderController.getOrderById);
router.patch("/:id", OrderController_1.OrderController.update);
router.delete("/:id", OrderController_1.OrderController.delete);
router.patch("/:id/status", OrderController_1.OrderController.updateStatus);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map