import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { fileUpload, filterObject } from "../../utils/multer.js";
import {
  createSubCategorySchema,
  updateSubCategorySchema,
  deleteSubCategorySchema,
} from "./subcategory.validation.js";
import {
  createSubcategory,
  updateSubCategory,
  deleteSubcategory,
  allSubcategories,
} from "./subcategory.controller.js";
const router = Router({ mergeParams: true }); // mergeparams is necessary to include params of parent route
// crud

// create
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("subcategory"),
  isValid(createSubCategorySchema),
  createSubcategory
);

// update
router.patch(
  "/:subcategoryId",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("subcategory"),
  isValid(updateSubCategorySchema),
  updateSubCategory
);

// delete
router.delete(
  "/:subcategoryId",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(deleteSubCategorySchema),
  deleteSubcategory
);

router.get("/", allSubcategories);

export default router;
