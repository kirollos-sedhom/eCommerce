import { Router } from "express";
import { isValid } from "../../middleware/validation.middleware.js";
import {
  createbrandSchema,
  updatebrandSchema,
  deletebrandSchema,
} from "./brand.validation.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import {
  createBrand,
  updateBrand,
  deleteBrand,
  allBrands,
} from "./brand.controller.js";
import { fileUpload, filterObject } from "../../utils/multer.js";

const router = Router();

// crud
//create brand
router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("brand"),
  isValid(createbrandSchema),
  createBrand
); // must check if the user creating the brand is 1- logged in(authentication)    2- authorized to create a brand

router.patch(
  "/:brandId",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload(filterObject.image).single("brand"),
  isValid(updatebrandSchema),
  updateBrand
);

router.delete(
  "/:brandId",
  isAuthenticated,
  isAuthorized("admin"),
  isValid(deletebrandSchema),
  deleteBrand
);

router.get("/", allBrands);
export default router;
