const httpStatus = require("http-status");
const catchAsync = require("../../../../utils/catchAsync");
const paystackService = require("./paystack.service");
const Order = require("../../order/order.model");
const auditService = require("../../audit/audit.service");

const paystackController = {
  initializeTransaction: catchAsync(async (req, res) => {
    const id = req.params.orderId;
    const getOrder = await Order.findById(id);
    
    try {
      const paymentData = await paystackService.initializeTransaction(
        {
          ...getOrder.toJSON(),
          email: req.user.email,
        },
        req.user.id
      );
      
      // Log payment initialization
      await auditService.logPaymentEvent({
        user: req.user,
        action: 'PAYMENT_INITIATED',
        orderId: id,
        amount: getOrder.total,
        status: 'SUCCESS',
        metadata: {
          ip: req.ip,
          userAgent: req.get('user-agent'),
          reference: paymentData.data?.reference,
          authorization_url: paymentData.data?.authorization_url
        }
      });
      
      res.status(httpStatus.OK).send(paymentData);
    } catch (error) {
      // Log payment initialization failure
      await auditService.logPaymentEvent({
        user: req.user,
        action: 'PAYMENT_INITIATED',
        orderId: id,
        amount: getOrder.total,
        status: 'FAILURE',
        metadata: {
          ip: req.ip,
          userAgent: req.get('user-agent')
        }
      });
      
      throw error;
    }
  }),

  verifyTransaction: catchAsync(async (req, res) => {
    const { reference } = req.query;
    const paymentData = await paystackService.verifyTransaction(reference);

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

    // Log payment verification
    if (paymentData.status === "success") {
      await auditService.logPaymentEvent({
        user: req.user || { _id: order.buyer, email: paymentData.customer?.email },
        action: 'PAYMENT_COMPLETED',
        orderId: order.id,
        amount: paymentData.amount / 100, // Convert from kobo
        status: 'SUCCESS',
        metadata: {
          ip: req.ip,
          userAgent: req.get('user-agent'),
          reference: reference,
          gateway: 'paystack',
          transaction_id: paymentData.id
        }
      });
    } else {
      await auditService.logPaymentEvent({
        user: req.user || { _id: order.buyer },
        action: 'PAYMENT_FAILED',
        orderId: order.id,
        amount: paymentData.amount / 100,
        status: 'FAILURE',
        metadata: {
          ip: req.ip,
          userAgent: req.get('user-agent'),
          reference: reference,
          gateway: 'paystack'
        }
      });
    }

    res.status(httpStatus.OK).send(paymentData);
  }),
};

module.exports = paystackController;
