import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import {
  addToCartSchema,
  updateCartSchema,
  deleteFromCartSchema,
} from "./cart.validation.js";
import {
  addToCart,
  userCart,
  updateCart,
  removeProduct,
  clearCart,
} from "./cart.controller.js";

const router = Router();

// crud

// add product to cart

router.post("/", isAuthenticated, isValid(addToCartSchema), addToCart);

// get cart

router.get("/", isAuthenticated, userCart);

// update cart
router.patch("/", isAuthenticated, isValid(updateCartSchema), updateCart);

// clear cart
router.patch("/clear", isAuthenticated, clearCart);

// remove product from cart
router.patch(
  "/:productId",
  isAuthenticated,
  isValid(deleteFromCartSchema),
  removeProduct
);
export default router;
