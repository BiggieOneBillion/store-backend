const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { initializeDatabase } = require("./utils/dbInit");
const { initializeAuditCronJobs } = require("./features/v1/audit/audit.cron");

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info("Connected to MongoDB");
  
  // Initialize database (create default admin if needed)
  initializeDatabase().then(() => {
    // Initialize audit cron jobs after database is ready
    initializeAuditCronJobs();
  });
  
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
