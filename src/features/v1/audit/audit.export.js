const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const AuditLog = require('./audit.model');

/**
 * Export audit logs to CSV
 * @param {Object} filter - MongoDB filter
 * @param {Object} options - Export options
 * @returns {Promise<string>} CSV string
 */
const exportToCSV = async (filter = {}, options = {}) => {
  try {
    // Fetch logs
    const logs = await AuditLog.find(filter)
      .populate('user', 'name email role')
      .sort({ timestamp: -1 })
      .limit(options.limit || 10000)
      .lean();
    
    // Define CSV fields
    const fields = [
      { label: 'Timestamp', value: 'timestamp' },
      { label: 'User Email', value: 'userEmail' },
      { label: 'User Role', value: 'userRole' },
      { label: 'Action', value: 'action' },
      { label: 'Entity Type', value: 'entityType' },
      { label: 'Entity ID', value: 'entityId' },
      { label: 'Category', value: 'category' },
      { label: 'Severity', value: 'severity' },
      { label: 'Status', value: 'status' },
      { label: 'IP Address', value: 'metadata.ip' },
      { label: 'User Agent', value: 'metadata.userAgent' },
      { label: 'Method', value: 'metadata.method' },
      { label: 'Endpoint', value: 'metadata.endpoint' },
      { label: 'Status Code', value: 'metadata.statusCode' },
      { label: 'Response Time (ms)', value: 'metadata.responseTime' },
      { label: 'Description', value: 'description' },
      { label: 'Error Message', value: 'errorMessage' }
    ];
    
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(logs);
    
    return csv;
  } catch (error) {
    throw new Error(`Failed to export to CSV: ${error.message}`);
  }
};

/**
 * Export audit logs to PDF
 * @param {Object} filter - MongoDB filter
 * @param {Object} options - Export options
 * @returns {Promise<Buffer>} PDF buffer
 */
const exportToPDF = async (filter = {}, options = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Fetch logs
      const logs = await AuditLog.find(filter)
        .populate('user', 'name email role')
        .sort({ timestamp: -1 })
        .limit(options.limit || 1000)
        .lean();
      
      // Create PDF document
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      
      // Add title
      doc.fontSize(20).text('Audit Trail Report', { align: 'center' });
      doc.moveDown();
      
      // Add metadata
      doc.fontSize(10);
      doc.text(`Generated: ${new Date().toISOString()}`, { align: 'right' });
      doc.text(`Total Records: ${logs.length}`, { align: 'right' });
      doc.moveDown();
      
      // Add table header
      doc.fontSize(8);
      const tableTop = doc.y;
      const colWidth = 70;
      
      doc.text('Timestamp', 50, tableTop);
      doc.text('User', 150, tableTop);
      doc.text('Action', 250, tableTop);
      doc.text('Entity', 320, tableTop);
      doc.text('Category', 400, tableTop);
      doc.text('Status', 480, tableTop);
      
      doc.moveDown();
      
      // Add logs
      logs.forEach((log, index) => {
        const y = doc.y;
        
        // Check if we need a new page
        if (y > 700) {
          doc.addPage();
        }
        
        const timestamp = new Date(log.timestamp).toLocaleString();
        const user = log.userEmail || 'N/A';
        const action = log.action;
        const entity = `${log.entityType}`;
        const category = log.category;
        const status = log.status;
        
        doc.fontSize(7);
        doc.text(timestamp.substring(0, 16), 50, doc.y);
        doc.text(user.substring(0, 15), 150, doc.y - 10);
        doc.text(action, 250, doc.y - 10);
        doc.text(entity, 320, doc.y - 10);
        doc.text(category, 400, doc.y - 10);
        doc.text(status, 480, doc.y - 10);
        
        doc.moveDown(0.5);
      });
      
      // Finalize PDF
      doc.end();
    } catch (error) {
      reject(new Error(`Failed to export to PDF: ${error.message}`));
    }
  });
};

/**
 * Get export statistics
 * @param {Object} filter - MongoDB filter
 * @returns {Promise<Object>}
 */
const getExportStats = async (filter = {}) => {
  const count = await AuditLog.countDocuments(filter);
  const estimatedCSVSize = count * 300; // Rough estimate: 300 bytes per record
  const estimatedPDFSize = count * 100; // Rough estimate: 100 bytes per record
  
  return {
    totalRecords: count,
    estimatedCSVSize: `${(estimatedCSVSize / 1024 / 1024).toFixed(2)} MB`,
    estimatedPDFSize: `${(estimatedPDFSize / 1024 / 1024).toFixed(2)} MB`,
    recommendedLimit: count > 10000 ? 10000 : count
  };
};

module.exports = {
  exportToCSV,
  exportToPDF,
  getExportStats
};
