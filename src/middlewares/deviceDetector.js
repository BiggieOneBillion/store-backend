const deviceDetector = (req, res, next) => {
  // Check for mobile-specific headers
  const platform = req.headers['x-platform'];
  const appVersion = req.headers['x-app-version'];
  
  // Set device info on request object
  req.deviceInfo = {
    isMobile: platform === 'mobile',
    platform: platform || 'web',
    appVersion: appVersion || null,
    isApp: !!(platform && appVersion)
  };

  // Optional: Log device information
  // console.log('Device Info:', req.deviceInfo);

  next();
};

module.exports = deviceDetector;