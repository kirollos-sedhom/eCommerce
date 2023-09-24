// create a subcategory
import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";
export const createSubCategorySchema = Joi.object({
  name: Joi.string().min(5).max(20).required(),
  categoryId: Joi.string().custom(isValidObjectId).required(),
}).required();

export const updateSubCategorySchema = Joi.object({
  name: Joi.string().min(5).max(20),
  categoryId: Joi.string().custom(isValidObjectId).required(),
  subcategoryId: Joi.string().custom(isValidObjectId).required(),
}).required();

export const deleteSubCategorySchema = Joi.object({
  categoryId: Joi.string().custom(isValidObjectId).required(),
  subcategoryId: Joi.string().custom(isValidObjectId).required(),
}).required();
