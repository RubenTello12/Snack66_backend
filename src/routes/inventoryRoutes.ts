import { Router } from "express";
import { InventoryController } from "../controllers/InventoryController";

const router = Router();

router.get("/", InventoryController.getAll);
router.post("/", InventoryController.create);
router.put("/:id", InventoryController.update); 
router.delete("/:id", InventoryController.delete);

export default router;
