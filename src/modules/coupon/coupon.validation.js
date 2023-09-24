// create coupon

import Joi from "joi";

export const createCouponSchema = Joi.object({
  discount: Joi.number().min(1).max(100).required(),
  expiredAt: Joi.date().greater(Date.now()).required(),
}).required();

export const updateCouponSchema = Joi.object({
  discount: Joi.number().min(1).max(100),
  expiredAt: Joi.date().greater(Date.now()),
  code: Joi.string().length(5).required(),
}).required();

export const deleteCouponSchema = Joi.object({
  code: Joi.string().length(5).required(),
}).required();
