const formidable = require("formidable");
const path = require("path");

const uploadDir = path.join(__dirname, "uploads"); // Set upload directory

const formidableMiddleware = (req, res, next) => {
  const form = new formidable.IncomingForm({
    uploadDir, // Save files to this directory
    keepExtensions: true, // Preserve file extensions
    multiples: true, // Allow multiple files
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "File upload error", details: err });
    }

    req.fields = fields; // Store text fields in req
    req.files = files; // Store uploaded files in req
    // console.log("FROM FORMIABLE", fields)
    next(); // Continue to the next middleware or route handler
  });
};

module.exports = formidableMiddleware;
