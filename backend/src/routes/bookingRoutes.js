import { Router } from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { bookingRules, statusRules } from "../validators/bookingValidators.js";
import { listBookings, createBooking, updateStatus } from "../controllers/bookingController.js";

const router = Router();

router.get("/", protect, listBookings);
router.post("/", protect, requireRole("user","admin"), bookingRules, validate, createBooking);
router.put("/:id/status", protect, requireRole("admin"), statusRules, validate, updateStatus);

export default router;
