import { Coupon } from "../../../DB/models/coupon.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import voucher_codes from "voucher-code-generator";
export const createCoupon = asyncHandler(async (req, res, next) => {
  // generate gode
  const code = voucher_codes.generate({ length: 5 });

  // create acoupon
  const coupon = await Coupon.create({
    name: code[0],
    discount: req.body.discount,
    expiredAt: new Date(req.body.expiredAt).getTime(),
    createdBy: req.user._id,
  });

  return res.status(201).json({ success: true, result: coupon });
});

export const updateCoupon = asyncHandler(async (req, res, next) => {
  // check coupon
  const coupon = await Coupon.findOne({
    name: req.params.code,
    expiredAt: { $gt: Date.now() },
  });
  if (!coupon) return next(new Error("invalid coupon"));

  // check owner
  if (req.user.id !== coupon.createdBy.toString()) {
    return next(new Error("you aren't authorized to delete it"));
  }
  coupon.discount = req.body.discount ? req.body.discount : coupon.discount;
  coupon.expiredAt = req.body.expiredAt
    ? new Date(req.body.expiredAt).getTime()
    : coupon.expiredAt;

  await coupon.save();
  return res.json({
    success: true,
    message: "coupon updated successfully",
    result: coupon,
  });
});

export const deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    name: req.params.code,
  });
  if (!coupon) {
    return next(new Error("invalid coupon"));
  }

  // check owner
  if (req.user.id !== coupon.createdBy.toString()) {
    return next(new Error("you aren't authorized to delete it"));
  }

  await Coupon.findOneAndDelete(req.params.code);
  return res.json({ success: true, message: "coupon deleted successfully" });
});

// all coupons
export const allCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.find();
  return res.json({ success: true, result: coupons });
});
