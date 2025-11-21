// const passport = require("passport");
// const httpStatus = require("http-status");
// const ApiError = require("../utils/ApiError");
// const { roleRights } = require("../config/roles");

// const verifyCallback =
//   (req, resolve, reject, requiredRights) => async (err, user, info) => {
//     if (err || info || !user) {
//       return reject(
//         new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
//       );
//     }
//     req.user = user;

//     if (requiredRights.length) {
//       const userRights = roleRights.get(user.role);
//       // console.log(requiredRights)
//       // console.log(userRights)
//       const hasRequiredRights = requiredRights.every((requiredRight) =>
//         userRights.includes(requiredRight)
//       );
//       // console.log(hasRequiredRights)
//       // console.log("DATA", req.body)
//       if (!hasRequiredRights) {
//         // console.log("IS FORBIDDEN")
//         return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
//       }
//     }

//     resolve();
//   };

// const auth =
//   (...requiredRights) =>
//   async (req, res, next) => {
//     return new Promise((resolve, reject) => {
//       passport.authenticate(
//         "jwt",
//         { session: false },
//         verifyCallback(req, resolve, reject, requiredRights)
//       )(req, res, next);
//     })
//       .then(() => next())
//       .catch((err) => next(err));
//   };

// module.exports = auth;

// // auth.js
// const passport = require("passport");
// const httpStatus = require("http-status");
// const ApiError = require("../utils/ApiError");
// const { roleRights } = require("../config/roles");

// const verifyCallback =
//   (req, resolve, reject, requiredRights) => async (err, user, info) => {
//     if (err || info || !user) {
//       return reject(
//         new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate")
//       );
//     }
//     req.user = user;

//     if (requiredRights.length) {
//       const userRights = roleRights.get(user.role) || [];
//       const hasRequiredRights = requiredRights.every((r) =>
//         userRights.includes(r)
//       );
//       if (!hasRequiredRights)
//         return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
//     }
//     resolve();
//   };

// // Access-token auth (Bearer <access>)
// const auth =
//   (...requiredRights) =>
//   async (req, res, next) => {
//     return new Promise((resolve, reject) => {
//       passport.authenticate(
//         "jwt",
//         { session: false },
//         verifyCallback(req, resolve, reject, requiredRights)
//       )(req, res, next);
//     })
//       .then(() => next())
//       .catch(next);
//   };

// // Refresh-token auth (cookie/body/header)
// const refreshAuth = () => async (req, res, next) => {
//   return new Promise((resolve, reject) => {
//     passport.authenticate(
//       "jwt-refresh",
//       { session: false },
//       // usually no role checks on refresh:
//       verifyCallback(req, resolve, reject, [])
//     )(req, res, next);
//   })
//     .then(() => next())
//     .catch(next);
// };

// module.exports = { auth, refreshAuth };

// auth.js
const passport = require("passport");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { roleRights } = require("../config/roles");

const verifyCallback =
  (req, resolve, reject, requiredRights, strategy) =>
  async (err, user, info) => {
    if (err || info || !user) {
      return reject(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          `Please authenticate - ${strategy}`
        )
      );
    }
    req.user = user;

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role) || [];
      const ok = requiredRights.every((r) => userRights.includes(r));
      if (!ok) return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
    }
    resolve();
  };

/**
 * auth(strategyOrRight?, ...requiredRights)
 * - If first arg is a string, it's treated as the strategy name (default "jwt")
 * - Otherwise first arg is a requiredRight
 */
const auth =
  (first, ...rest) =>
  async (req, res, next) => {
    const strategy = typeof first === "string" ? first : "jwt";
    const requiredRights =
      typeof first === "string" ? rest : [first, ...rest].filter(Boolean);

    return new Promise((resolve, reject) => {
      passport.authenticate(
        strategy,
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights, strategy)
      )(req, res, next);
    })
      .then(() => next())
      .catch(next);
  };

module.exports = { auth };
