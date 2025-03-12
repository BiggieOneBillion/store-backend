// module.exports.paystackService = require("./paystack.service");
// module.exports.paystackController = require("./paystack.controller");
// module.exports.paystackRoute = require("./paystack.route");

const paystackController = require('./paystack.controller');
const paystackService = require('./paystack.service');
const paystackRoute = require('./paystack.route');

module.exports = {
  paystackController,
  paystackService,
  paystackRoute
};

