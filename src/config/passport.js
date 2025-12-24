// const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
// const config = require("./config");
// const { tokenTypes } = require("./tokens");
// const {
//   user: { userModel: User },
// } = require("../features/v1/index");

// const jwtOptions = {
//   secretOrKey: config.jwt.secret,
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
// };

// const jwtVerify = async (payload, done) => {
//   try {
//     if (payload.type !== tokenTypes.ACCESS) {
//       throw new Error("Invalid token type");
//     }
//     const user = await User.findById(payload.sub);
//     if (!user) {
//       return done(null, false);
//     }
//     done(null, user);
//   } catch (error) {
//     done(error, false);
//   }
// };

// const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

// module.exports = {
//   jwtStrategy,
// };

// config/passport.js
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const config = require("./config");
const { tokenTypes } = require("./tokens");
const {
  user: { userModel: User },
} = require("../features/v1/index");

// ----- Access strategy -----
const accessOptions = {
  secretOrKey: config.jwt.accessSecret || config.jwt.secret, // prefer a dedicated secret
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};
const accessVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS)
      throw new Error("Invalid token type");
    const user = await User.findById(payload.sub);
    if (!user) return done(null, false);
    return done(null, user); // attach full user or keep payload if you prefer
  } catch (err) {
    return done(err, false);
  }
};

// ----- Refresh strategy -----
const refreshExtractor = (req) => {
  if (req?.cookies?.refreshToken) return req.cookies.refreshToken; // HttpOnly cookie (recommended)
  if (req?.headers?.["x-refresh-token"]) return req.headers["x-refresh-token"];
  if (req?.body?.refreshToken) return req.body.refreshToken;
  return null;
};
const refreshOptions = {
  secretOrKey: config.jwt.refreshSecret || config.jwt.secret, // prefer a separate refresh secret
  jwtFromRequest: refreshExtractor,
};
const refreshVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.REFRESH)
      throw new Error("Invalid token type");
    // Optionally verify session/rotation here via payload.sid / tokenVersion
    const user = await User.findById(payload.sub);
    if (!user) return done(null, false);

    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
};

module.exports = (passport) => {
  passport.use("jwt", new JwtStrategy(accessOptions, accessVerify));
  passport.use("jwt-refresh", new JwtStrategy(refreshOptions, refreshVerify));

  // (Optional) quick sanity check:
  // console.log("Registered strategies:", Object.keys(passport._strategies));
};
