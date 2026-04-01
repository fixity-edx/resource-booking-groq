import { body } from "express-validator";

export const bookingRules = [
  body("resourceId").isMongoId().withMessage("Valid resourceId required"),
  body("date").matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("Date must be YYYY-MM-DD"),
  body("slot").notEmpty().withMessage("Slot required"),
];

export const statusRules = [
  body("status").isIn(["approved","cancelled"]).withMessage("Invalid status"),
];
