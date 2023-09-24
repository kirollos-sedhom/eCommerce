import { Router } from "express";
import { isValid } from "../../middleware/validation.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
} from "./category.validation.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  allCategory,
} from "./category.controller.js";
import subcategoryRouter from "../subcategory/subcategory.router.js";
import productRouter from "../product/product.router.js";
import { fileUpload, filterObject } from "../../utils/multer.js";

const router = Router();

router.use("/:categoryId/subcategory", subcategoryRouter);
router.use("/:categoryId/products", productRouter);

// crud
//create category
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("category"),
  isValid(createCategorySchema),
  createCategory
); // must check if the user creating the category is 1- logged in(authentication)    2- authorized to create a category

router.patch(
  "/:categoryId",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("category"),
  isValid(updateCategorySchema),
  updateCategory
);

router.delete(
  "/:categoryId",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(deleteCategorySchema),
  deleteCategory
);

router.get("/", allCategory);
export default router;
