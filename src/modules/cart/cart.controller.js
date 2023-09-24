import { asyncHandler } from "../../utils/asyncHandler.js";
import { Cart } from "../../../DB/models/cart.model.js";
import { Product } from "../../../DB/models/product.model.js";

export const addToCart = asyncHandler(async (req, res, next) => {
  // data id , quantity
  const { productId, quantity } = req.body;
  // check product
  const product = await Product.findById(productId);
  if (!product) return next(new Error("product not found", { cause: 404 }));
  // check stock
  if (quantity > product.availableItems)
    return next(new Error("this is more items than what i currently have :c"));

  // check if product already exists in cart
  const isProductInCart = await Cart.findOne({
    user: req.user._id,
    "products.productId": productId,
  });
  if (isProductInCart) {
    isProductInCart.products.forEach((productObj) => {
      if (
        productObj.productId.toString() === productId.toString() &&
        productObj.quantity + quantity < product.availableItems
      ) {
        productObj.quantity += quantity;
      }
    });
    await isProductInCart.save();
    // response
    return res.json({
      success: true,
      results: isProductInCart,
      message: "product added successfully",
    });
  }
  // add to Cart
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $push: { products: { productId, quantity } } }, // todo add product name too
    { new: true }
  );

  await cart.save();
  // response
  return res.json({ success: true, results: cart });
});

export const userCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "products.productId",
    "name defaultImage.url"
  );
  return res.json({ success: true, results: cart });
});

export const updateCart = asyncHandler(async (req, res, next) => {
  //data
  const { productId, quantity } = req.body;
  // check product
  const product = await Product.findById(productId);
  if (!product) return next(new Error("product not found", { cause: 404 }));
  // check stock
  //   if (quantity > product.availableItems)
  //     return next(new Error("this is more items than what i currently have :c"));
  if (!product.inStock(quantity)) {
    return next(new Error("this is more items than what i currently have :c"));
  }

  //update product
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id, "products.productId": productId },
    {
      $set: { "products.$.quantity": quantity },
    },
    { new: true }
  );
  //send response
  return res.json({ success: true, results: cart });
});

export const removeProduct = asyncHandler(async (req, res, next) => {
  //remove
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { products: { productId: req.params.productId } } },
    { new: true }
  );

  // response
  return res.json({ success: true, results: cart });
});

export const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { products: [] },
    { new: true }
  );
  if (cart) {
    return res.json({ success: true, results: cart, message: "cart cleared" });
  } else {
    return res.json({
      success: false,
      message: "can't find cart , something wrong with this account",
    });
  }
});
