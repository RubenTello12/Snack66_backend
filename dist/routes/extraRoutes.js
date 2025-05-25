"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ExtraController_1 = require("../controllers/ExtraController");
const router = express_1.default.Router();
router.get("/", ExtraController_1.getAllExtras);
router.post("/", ExtraController_1.createExtra);
router.delete("/:id", ExtraController_1.deleteExtra);
exports.default = router;
//# sourceMappingURL=extraRoutes.js.map