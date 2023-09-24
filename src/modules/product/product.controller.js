import { asyncHandler } from "../../utils/asyncHandler.js";
import cloudinary from "../../utils/cloud.js";
import { nanoid } from "nanoid";
import { Product } from "../../../DB/models/product.model.js";
import { Category } from "../../../DB/models/category.model.js";
import { Subcategory } from "../../../DB/models/subcategory.model.js";
import { Brand } from "../../../DB/models/brand.model.js";
import dotenv from "dotenv";
dotenv.config();
export const addProduct = asyncHandler(async (req, res, next) => {
  // data
  // const {
  //   name,
  //   description,
  //   price,
  //   discount,
  //   availableItems,
  //   category,
  //   subcategory,
  //   brand,
  // } = req.body;
  // check category
  const category = await Category.findById(req.body.category);
  if (!category) return next(new Error("can't add a product without category"));
  const subcategory = await Subcategory.findById(req.body.subcategory);
  if (!subcategory)
    return next(new Error("can't add a product without subcategory"));
  const brand = await Brand.findById(req.body.brand);
  if (!brand) return next(new Error("can't add a product without brand"));

  // check files
  if (!req.files)
    return next(new Error("product images are required", { cause: 404 }));

  // create unique folder name
  const cloudFolder = nanoid();
  let images = [];
  console.log(req.files);
  // upload subfiles
  for (const file of req.files.subImages) {
    if (!file) {
      console.log("didn't get file");
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.FOLDER_CLOUD_NAME}/products/${cloudFolder}` }
    );
    images.push({ id: public_id, url: secure_url });
  }

  // upload default image
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path,
    { folder: `${process.env.FOLDER_CLOUD_NAME}/products/${cloudFolder}` }
  );

  // create product
  const product = await Product.create({
    ...req.body,
    cloudFolder,
    createdBy: req.user._id,
    defaultImage: { url: secure_url, id: public_id },
    images,
  });

  // send response
  return res.status(201).json({ success: true, results: product });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  // check product
  const product = await Product.findById(req.params.productId);
  if (!product) {
    return next(new Error("product not found"));
  }

  // check owner
  if (req.user._id.toString() != product.createdBy.toString()) {
    return next(new Error("not authorized", { cause: 401 }));
  }
  const imagesArr = product.images; //[{id:, url:}]
  const ids = imagesArr.map((imageObj) => imageObj.id);
  console.log(ids);
  ids.push(product.defaultImage.id); // add id of default image
  // delete images
  const result = await cloudinary.api.delete_resources(ids);
  console.log(result);

  // delete folder
  await cloudinary.api.delete_folder(
    `${process.env.FOLDER_CLOUD_NAME}/products/${product.cloudFolder}`
  );

  // delete product
  await Product.findByIdAndDelete(req.params.productId);

  // send response
  return res.json({ success: true, message: "product deleted" });
});

// search for product
export const allProducts = asyncHandler(async (req, res, next) => {
  if (req.params.categoryId) {
    const category = await Category.findById(req.params.categoryId);
    if (!category) return next(new Error("category not found", { cause: 404 }));
    const products = await Product.find({ category: req.params.categoryId });
    return res.json({ success: true, result: products });
  }
  // ******************** SEARCH *******************//
  // const { name, fields } = req.query;
  // const products = await Product.find({
  //   $or: [
  //     {
  //       name: { $regex: new RegExp(name, "i") },
  //     },
  //     {
  //       description: { $regex: new RegExp(name, "i") },
  //     },
  //   ],
  // });
  // data page
  //   const { page } = req.query;
  //   const limit = 2;
  //   const skip = limit * (page - 1);
  // pagination
  //   const products = await Product.find({}).skip(skip).limit(limit);
  // select certain fields
  //   const products = await Product.find({}).select(fields);
  // sort
  // const { sort } = req.query;
  // const products = await Product.find({}).sort(sort);
  // const products = await Product.find(); // gives all products

  const products = await Product.find({ ...req.query })
    .paginate(req.query.page)
    .customSelect(req.query.fields)
    .sort(req.query.sort);
  return res.json({ success: true, results: products });
});

export const singleProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    return next(new Error("couldn't find this product"));
  }
  return res.json({ success: true, results: product });
});
