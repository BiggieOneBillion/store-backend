const Paystack = require("paystack-node");
const config = require("../../../../config/config");
const ApiError = require("../../../../utils/ApiError");
const httpStatus = require("http-status");
const axios = require("axios");

const Payment = require("../payment.model");
const Order = require("../../order/order.model");
const { userService } = require("../../user/index");

const paystack = new Paystack(config.paystack.secretKey);

const paystackService = {
  initializeTransaction: async (orderData, userId) => {
    try {
      const getUser = await userService.getUserById(userId);

      const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email: getUser.email,
          amount: orderData.total * 100,
          reference: `PAY-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
          callback_url: config.paystack.callbackUrl,
          metadata: {
            orderId: orderData._id || orderData.id,
            userId: userId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${config.paystack.secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Create payment record
      await Payment.create({
        order: orderData._id || orderData.id,
        user: userId,
        amount: orderData.total,
        reference: response.data.data.reference,
        paymentDetails: {
          authorization_url: response.data.data.authorization_url,
          access_code: response.data.data.access_code || "",
        },
        metadata: {
          orderId: orderData.id,
          userId: userId.toString(),
        },
      });

      // Update order payment attempts
      await Order.findByIdAndUpdate(orderData._id || orderData.id, {
        $inc: { "payment.attempts": 1 },
        $set: {
          "payment.lastAttempt": new Date(),
          "payment.authorization_url": response.data.authorization_url,
          "payment.amount": orderData.total,
          "payment.reference": response.data.reference,
        },
      });

      return response.data;
      
    } catch (error) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Paystack initialization failed"
      );
    }
  },

  verifyTransaction: async (reference) => {
    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${config.paystack.secretKey}`,
          },
        }
      );

      // Update payment record
      const payment = await Payment.findOne({ reference });
      if (payment) {
        payment.status =
          response.data.data.status === "success" ? "success" : "failed";
        payment.paymentDetails = {
          ...payment.paymentDetails,
          transaction_date: new Date(response.data.data.transaction_date),
          gateway_response: response.data.data.gateway_response,
          channel: response.data.data.channel,
          card_type: response.data.data.card_type,
          bank: response.data.data.bank,
          last4: response.data.data.last4,
        };
        await payment.save();

        // Update order payment details
        await Order.findByIdAndUpdate(payment.order, {
          $set: {
            "payment.status":
              response.data.data.status === "success" ? "success" : "failed",
            "payment.paymentDate": new Date(
              response.data.data.transaction_date
            ),
            "payment.transaction_id": response.data.data.id.toString(),
            status:
              response.data.data.status === "success"
                ? "processing"
                : "payment_failed",
          },
        });
      }

      return response.data.data;
    } catch (error) {
      // console.log("Verification Error:", error.response?.data || error.message);
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Paystack verification failed"
      );
    }
  },
};

module.exports = paystackService;
