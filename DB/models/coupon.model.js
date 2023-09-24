import mongoose, { Schema, Types, model } from "mongoose";

const couponSchema = new Schema(
  {
    name: { type: String, required: true },
    discount: { type: Number, mi: 1, max: 100, required: true },
    expiredAt: Number,
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Coupon = mongoose.models.Coupon || model("Coupon", couponSchema);
