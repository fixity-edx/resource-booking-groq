import { Router } from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { resourceRules } from "../validators/resourceValidators.js";
import { listResources, createResource } from "../controllers/resourceController.js";

const router = Router();

router.get("/", protect, listResources);
router.post("/", protect, requireRole("admin"), resourceRules, validate, createResource);

export default router;
