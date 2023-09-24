import authRouter from "./modules/user/user.router.js";
import categoryRouter from "./modules/category/category.router.js";
import subcategoryRouter from "./modules/subcategory/subcategory.router.js";
import brandRouter from "./modules/brand/brand.router.js";
import productRouter from "./modules/product/product.router.js";
import couponRouter from "./modules/coupon/coupon.router.js";
import cartRouter from "./modules/cart/cart.router.js";
import orderRouter from "./modules/order/order.router.js";
import morgan from "morgan";
export const appRouter = (app, express) => {
  // morgan
  if (process.env.NODE_ENV === "dev") {
    app.use(morgan("dev"));
  }

  // cors
  const whitelist = [
    "http://127.0.0.1:5500",
    "https://your-vercel-app.vercel.app",
  ];
  app.use((req, res, next) => {
    console.log(req.header("origin"));
    // activate account api , not necessary if the front end will be the one to  send the confirmation request
    if (req.originalUrl.includes("/auth/confirmEmail")) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET");
      return next();
    }

    if (!whitelist.includes(req.header("origin"))) {
      return next(new Error("BLOCKED BY CORS"));
    }
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Private-Network", true); // usually fasle to prevent testing after deployment
    return next();
  });

  // global middleware
  app.use(express.json()); // parses request.body to be able to process it
  // routes

  // auth
  app.use("/auth", authRouter);

  // category
  app.use("/category", categoryRouter);

  // subcategory
  app.use("/subcategory", subcategoryRouter);

  app.use("/brand", brandRouter);

  app.use("/product", productRouter);

  app.use("/coupon", couponRouter);

  app.use("/cart", cartRouter);

  app.use("/order", orderRouter);
  // not found page router
  app.all("*", (req, res, next) => {
    return next(new Error("page not found!", { cause: 404 }));
  });
  // global error handler
  app.use((error, req, res, next) => {
    return res
      .status(error.cause || 500)
      .json({ success: false, message: error.message, stack: error.stack });
  });
};
