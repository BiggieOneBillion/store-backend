const httpStatus = require("http-status");
const catchAsync = require("../../../../utils/catchAsync");
const paystackService = require("./paystack.service");
const Order = require("../../order/order.model");
// const { orderService } = require("../../order");

const paystackController = {
  initializeTransaction: catchAsync(async (req, res) => {
    const id = req.params.orderId;
    const getOrder = await Order.findById(id);
    const paymentData = await paystackService.initializeTransaction(
      {
        ...getOrder.toJSON(),
        email: req.user.email,
      },
      req.user.id
    );
    res.status(httpStatus.OK).send(paymentData);
  }),

  verifyTransaction: catchAsync(async (req, res) => {
    const { reference } = req.query;
    const paymentData = await paystackService.verifyTransaction(reference);

    // if (paymentData.status === "success") {
    // Update order payment status
    // await orderService.updateOrderById(paymentData.metadata.orderId, {
    //   "payment.status": "success",
    //   "payment.reference": reference,
    //   "payment.paymentDate": new Date(),
    //   status: "processing"
    // });
    // const order = await Order.findById(paymentData.metadata.orderId);
    const order = await Order.findByIdAndUpdate(
      paymentData.metadata.orderId,
      {
        $set: {
          "payment.status": "success",
          "payment.reference": reference,
          "payment.paymentDate": new Date(),
          status: "processing",
        },
      },
      { new: true }
    );

    // console.log("ORDER INFO----", order);
    // if (!order) {
    //   throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
    // }
    // Object.assign(order, {
    //   "payment.status": "success",
    //   "payment.reference": reference,
    //   "payment.paymentDate": new Date(),
    //   status: "processing",
    // });

    // console.log("ORDER INFO----", order);
    // await order.save();
    //   return order;
    // }

    res.status(httpStatus.OK).send(paymentData);
  }),
};

module.exports = paystackController;
