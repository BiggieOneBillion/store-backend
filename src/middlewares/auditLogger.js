const { init } = require("passport");
const auditService = require("../features/v1/audit/audit.service");

/**
 * Middleware to automatically log API requests
 * @param {Object} options - Configuration options
 * @returns {Function} Express middleware
 */
const auditLogger = (options = {}) => {
  return async (req, res, next) => {
    const startTime = Date.now();

    const intialRequest = req.originalUrl;

    const entityType = extractEntityType(intialRequest)

    // Capture original end function
    const originalEnd = res.end;

    // Override end function to log after response
    res.end = function (...args) {
      const responseTime = Date.now() - startTime;

      // Only log if user is authenticated (optional)
      if (req.user && !options.skipAudit) {
        // Determine action based on HTTP method
        const actionMap = {
          POST: "CREATE",
          GET: "READ",
          PATCH: "UPDATE",
          PUT: "UPDATE",
          DELETE: "DELETE",
        };

        const action = actionMap[req.method] || req.method;

        // Determine category based on route
        let category = "USER_ACTIVITY";
        if (intialRequest.includes("/auth")) category = "SECURITY";
        if (
          intialRequest.includes("/payment") ||
          intialRequest.includes("/order")
        )
          category = "FINANCIAL";
        if (
          intialRequest.includes("/stock") ||
          intialRequest.includes("/product")
        )
          category = "INVENTORY";
        if (req.user.role === "admin") category = "ADMIN";

        // Log the action (async, don't wait)
        auditService
          .logUserAction({
            user: req.user,
            action,
            entityType: entityType,
            entityId:
              req.params.id ||
              req.params.userId ||
              req.params.productId ||
              req.params.orderId ||
              req.params.storeId,
            metadata: {
              ip: req.ip || req.connection.remoteAddress,
              userAgent: req.get("user-agent"),
              device: req.device?.type,
              method: req.method,
              endpoint: intialRequest,
              statusCode: res.statusCode,
              responseTime,
            },
            category,
            severity:
              res.statusCode >= 400
                ? res.statusCode >= 500
                  ? "ERROR"
                  : "WARNING"
                : "INFO",
            status: res.statusCode < 400 ? "SUCCESS" : "FAILURE",
          })
          .catch((err) => {
            // Silent fail - don't break the request
            console.error("Audit logging failed:", err);
          });

      }

      // Call original end
      originalEnd.apply(res, args);
    };

    next();
  };
};

/**
 * Extract entity type from request path
 * @param {string} path - Request path
 * @returns {string} Entity type
 */
const extractEntityType = (path) => {
  if (path.includes("/user")) return "User";
  if (path.includes("/store")) return "Store";
  if (path.includes("/product")) return "Product";
  if (path.includes("/order")) return "Order";
  if (path.includes("/payment") || path.includes("/paystack")) return "Payment";
  if (path.includes("/discount")) return "Discount";
  if (path.includes("/categor")) return "Category";
  if (path.includes("/wishlist")) return "Wishlist";
  if (path.includes("/stock")) return "StockHistory";
  if (path.includes("/address")) return "UserAddress";
  if (path.includes("/auth")) return "Auth";
  return "System";
};

module.exports = auditLogger;
