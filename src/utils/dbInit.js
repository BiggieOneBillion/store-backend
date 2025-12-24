const User = require('../features/v1/user/user.model');
const logger = require('../config/logger');
const config = require('../config/config');

/**
 * Create default admin user if none exists
 * @returns {Promise<void>}
 */
const createDefaultAdmin = async () => {
  try {
    // Check if any admin user exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      logger.info('Admin user already exists');
      return;
    }
    
    // Get admin credentials from environment variables
    const adminEmail = config.defaultAdmin.email || 'admin@example.com';
    const adminPassword = config.defaultAdmin.password || 'Admin@123456';
    const adminName = config.defaultAdmin.name || 'System Administrator';
    
    // Create admin user
    const adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isEmailVerified: true
    });
    
    logger.warn('═══════════════════════════════════════════════════════');
    logger.warn('DEFAULT ADMIN USER CREATED');
    logger.warn('═══════════════════════════════════════════════════════');
    logger.warn(`Email: ${adminEmail}`);
    logger.warn(`Password: ${adminPassword}`);
    logger.warn(`Name: ${adminName}`);
    logger.warn('═══════════════════════════════════════════════════════');
    logger.warn('⚠️  IMPORTANT: Please change the admin password immediately!');
    logger.warn('═══════════════════════════════════════════════════════');
    
    return adminUser;
  } catch (error) {
    logger.error('Failed to create default admin user:', error);
    throw error;
  }
};

/**
 * Initialize database with default data
 * @returns {Promise<void>}
 */
const initializeDatabase = async () => {
  try {
    logger.info('Initializing database...');
    
    // Create default admin user
    await createDefaultAdmin();
    
    logger.info('Database initialization completed');
  } catch (error) {
    logger.error('Database initialization failed:', error);
    // Don't throw - allow server to start even if initialization fails
  }
};

module.exports = {
  createDefaultAdmin,
  initializeDatabase
};
