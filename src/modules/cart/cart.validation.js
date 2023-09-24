import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

// add to cart

export const addToCartSchema = Joi.object({
  productId: Joi.string().custom(isValidObjectId).required(),
  quantity: Joi.number().integer().min(1).required(),
}).required();

export const updateCartSchema = Joi.object({
  productId: Joi.string().custom(isValidObjectId).required(),
  quantity: Joi.number().integer().min(1).required(),
}).required();

export const deleteFromCartSchema = Joi.object({
  productId: Joi.string().custom(isValidObjectId).required(),
}).required();
