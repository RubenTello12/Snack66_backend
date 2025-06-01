import { Router } from "express";
import { OrderController } from "../controllers/OrderController";

const router = Router()

router.post('/', OrderController.createOrder)
router.get('/', OrderController.getAllOrders)
router.get("/in-progress", OrderController.getInProgressOrders);
router.get("/pending-payment", OrderController.getPendingPaymentOrders);
router.patch("/:id/payment", OrderController.updatePaymentMethod);
router.get("/paid", OrderController.getPaidOrders);
router.get("/:id", OrderController.getOrderById)
router.patch("/:id", OrderController.update)
router.delete("/:id", OrderController.delete)
router.patch("/:id/status", OrderController.updateStatus);  

export default router