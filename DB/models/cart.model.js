import mongoose, { Schema, Types, model } from "mongoose";

const cartSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    products: [
      {
        _id: false,
        productId: { type: Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);
export const Cart = mongoose.models.Cart || model("Cart", cartSchema);
