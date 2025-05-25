import express from "express";
import upload from "../middleware/upload";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  deleteCategory,
} from "../controllers/CategoryController";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById); 
router.post("/", upload.single("image"), createCategory);
router.delete("/:id", deleteCategory);

export default router;
