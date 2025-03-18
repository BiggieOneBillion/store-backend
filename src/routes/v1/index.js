const express = require("express");
const { authRoute } = require("../../features/v1/auth/index");
const { userRoute } = require("../../features/v1/user/index");
const docsRoute = require("../../features/v1/docs/docs.route");
const config = require("../../config/config");
const { storeRoute } = require("../../features/v1/store/index");
const { productRoute } = require("../../features/v1/product/index");
const { wishlistRoute } = require("../../features/v1/wishlist/index");
const { orderRoute } = require("../../features/v1/order/index");
const paymentRoute = require("../../features/v1/payment/payment.route");
const paystackRoute = require("../../features/v1/payment/paystack/paystack.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/store",
    route: storeRoute,
  },
  {
    path: "/product",
    route: productRoute,
  },
  {
    path: "/wishlist",
    route: wishlistRoute,
  },
  {
    path: "/paystack",
    route: paystackRoute,
  },
  {
    path: "/order",
    route: orderRoute,
  },
  {
    path: "/payment",
    route: paymentRoute,
  },
];

// routes available only in development mode only
const devRoutes = [
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
