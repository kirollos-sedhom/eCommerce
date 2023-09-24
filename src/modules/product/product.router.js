import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.middleware.js";
import {
  createProductSchema,
  deleteProductSchema,
  getSingleProductSchema,
} from "./product.validation.js";
import {
  addProduct,
  deleteProduct,
  allProducts,
  singleProduct,
} from "./product.controller.js";
const router = Router({ mergeParams: true });

// crud
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).fields([
    { name: "defaultImage", maxCount: 1 },
    { name: "subImages", maxCount: 3 },
  ]),
  isValid(createProductSchema),
  addProduct
);

router.delete(
  "/:productId",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(deleteProductSchema),

  deleteProduct
);

// get all products
router.get("/", allProducts);

// read all products with certain category
router.get("/withcategory/:categoryId");

// get single product
router.get(
  "/single/:productId",
  isValid(getSingleProductSchema),
  singleProduct
);
export default router;
