const httpStatus = require("http-status");
const ApiError = require("../../../utils/ApiError");
const Order = require("./order.model");
const { productService } = require("../product/index");
const { paystackService } = require("../payment/paystack/index");
const mongoose = require("mongoose");

// Order Service
const createOrder = async (orderBody) => {
  // Verify products exist and have sufficient inventory
  const productArr = [];
  for (const item of orderBody.items) {
    const singleProduct = await productService.getProductById(item.product);
    if (!singleProduct) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Product ${item.product} not found`
      );
    }
    if (singleProduct.inventory.quantity < item.quantity) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Insufficient inventory for product ${item.product}`
      );
    }
    productArr.push({
      product: singleProduct.id,
      store: singleProduct.store.toString(),
      quantity: item.quantity,
      price: singleProduct.price,
    });
  }

  // Create order with initial status pending
  const order = await Order.create({
    ...orderBody,
    items: productArr,
    status: "awaiting_payment",
    payment: {
      status: "pending",
    },
    total: productArr.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    ),
  });

  // Initialize Paystack payment
  const paystackData = await paystackService.initializeTransaction(
    order,
    orderBody.buyer
  );

  // console.log("PAYSTACK------", paystackData);

  // Update order with payment reference
  order.payment.reference = paystackData.reference;
  await order.save();

  return {
    order,
    paymentUrl: paystackData,
  };

  // // return Order.create(orderBody);
};

const queryOrders = async (filter, options) => {
  const orders = await Order.paginate(filter, options);
  return orders;
};

const getOrderById = async (id) => {
  return Order.findById(id);
};

const getUserOrder = async (id) => {
  return Order.find({ buyer: id })
    .populate({
      path: "items.product",
      select: "name images price description",
    })
    .populate({
      path: "items.store",
      select: "name logo description",
    })
    .select([
      "payment.amount",
      "payment.gateway",
      "payment.status",
      "payment.paymentDate",
      "items",
      "status",
      "total",
      "createdAt",
    ])
    .sort({ createdAt: -1 }); // This will also sort by newest first
};

// getAllOrder
const getAllOrder = async () => {
  return Order.aggregate([
    { $unwind: "$items" },
    // Add lookup for product details
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "items.productDetails",
      },
    },
    { $unwind: "$items.productDetails" },
    {
      $group: {
        _id: "$_id",
        buyer: { $first: "$buyer" },
        items: {
          $push: {
            product: "$items.product",
            productName: "$items.productDetails.name",
            store: "$items.store",
            quantity: "$items.quantity",
            price: "$items.price",
            variant: "$items.variant",
          },
        },
        status: { $first: "$status" },
        payment: { $first: "$payment" },
        shippingAddress: { $first: "$shippingAddress" },
        total: { $first: "$total" },
        createdAt: { $first: "$createdAt" },
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "buyer",
        foreignField: "_id",
        as: "buyer",
      },
    },
    { $unwind: "$buyer" },
    {
      $project: {
        buyer: { name: 1, email: 1 },
        items: 1,
        status: 1,
        "payment.status": 1,
        "payment.paymentDate": 1,
        shippingAddress: 1,
        total: 1,
        createdAt: 1,
      },
    },
  ]);
};

const getAllOrdersByStore = async (storeId) => {
  return Order.aggregate([
    { $unwind: "$items" },
    { $match: { "items.store": mongoose.Types.ObjectId(storeId) } },
    // Add lookup for product details
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "items.productDetails",
      },
    },
    { $unwind: "$items.productDetails" },
    {
      $group: {
        _id: "$_id",
        buyer: { $first: "$buyer" },
        items: {
          $push: {
            product: "$items.product",
            productName: "$items.productDetails.name",
            store: "$items.store",
            quantity: "$items.quantity",
            price: "$items.price",
            variant: "$items.variant",
          },
        },
        status: { $first: "$status" },
        payment: { $first: "$payment" },
        shippingAddress: { $first: "$shippingAddress" },
        total: { $first: "$total" },
        createdAt: { $first: "$createdAt" },
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "buyer",
        foreignField: "_id",
        as: "buyer",
      },
    },
    { $unwind: "$buyer" },
    {
      $project: {
        buyer: { name: 1, email: 1 },
        items: 1,
        status: 1,
        "payment.status": 1,
        "payment.paymentDate": 1,
        shippingAddress: 1,
        total: 1,
        createdAt: 1,
      },
    },
  ]);
};

const updateOrderById = async (orderId, updateBody, userId) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  // Check if the user is the buyer of the order
  if (order.buyer.toString() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this order"
    );
  }

  Object.assign(order, updateBody);
  await order.save();
  return order;
};

const testWork = () => {
  console.log("TEST ENDPOINT");
  return "done";
};

const deleteOrderById = async (orderId) => {
  const order = await getOrderById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }
  await order.remove();
  return order;
};

module.exports = {
  // Order Service
  createOrder,
  queryOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  getAllOrdersByStore,
  testWork,
  getUserOrder,
  getAllOrder
};
