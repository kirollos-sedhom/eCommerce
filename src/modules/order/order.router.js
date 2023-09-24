import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { createOrderSchema, cancelOrderSchema } from "./order.validation.js";
import { createOrder, cancelOrder } from "./order.controller.js";

const router = Router();

// create router
router.post("/", isAuthenticated, isValid(createOrderSchema), createOrder);

// cancel order
router.patch(
  "/:orderId",
  isAuthenticated,
  isValid(cancelOrderSchema),
  cancelOrder
);

// webhook end by stripe
export default router;
