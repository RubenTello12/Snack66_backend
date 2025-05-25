import express from "express";
import {
  createExtra,
  getAllExtras,
  deleteExtra
} from "../controllers/ExtraController";

const router = express.Router();

router.get("/", getAllExtras);
router.post("/", createExtra);
router.delete("/:id", deleteExtra);

export default router;
