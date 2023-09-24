import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  allCoupons,
} from "./coupon.controller.js";
import {
  createCouponSchema,
  updateCouponSchema,
  deleteCouponSchema,
} from "./coupon.validation.js";

const router = Router();

// crud

// create coupon
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(createCouponSchema),
  createCoupon
);

// update coupon
router.patch(
  "/:code",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(updateCouponSchema),
  updateCoupon
);

// delete coupon
router.delete(
  "/:code",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(deleteCouponSchema),
  deleteCoupon
);

// get all coupons
router.get("/", allCoupons);
export default router;
