const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const passport = require("passport");
const httpStatus = require("http-status");
const config = require("./config/config");
const morgan = require("./config/morgan");
const { jwtStrategy } = require("./config/passport");
const { authLimiter } = require("./middlewares/rateLimiter");
const routes = require("./routes/v1");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const fileUpload = require("express-fileupload");
const deviceDetector = require("./middlewares/deviceDetector");
const registerPassport = require("./config/passport");
// const formidableMiddleware = require("./middlewares/formiableMiddleware");

const app = express();

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// app.use(formidableMiddleware);

// Middleware to handle file uploads
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    parseNested: false,
  })
);

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());
// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
//   exposedHeaders: ['Content-Range', 'X-Content-Range']
// }));
// app.options('*', cors());
// detect device
app.use(deviceDetector);

// jwt authentication
app.use(passport.initialize());
// passport.use("jwt", jwtStrategy);
// IMPORTANT: register BEFORE mounting routes
registerPassport(passport);

// Enable audit logging for all authenticated routes
const auditLogger = require("./middlewares/auditLogger");
app.use(auditLogger());

// limit repeated failed requests to auth endpoints
if (config.env === "production") {
  app.use("/v1/auth", authLimiter);
}

// v1 api routes
app.use("/v1", routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
