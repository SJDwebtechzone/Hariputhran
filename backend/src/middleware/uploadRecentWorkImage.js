const multer = require("multer");

// 200 KB in bytes (204,800 bytes)
const MAX_RECENT_WORK_IMAGE_SIZE = 200 * 1024;

// Magic numbers validation for JPEG, PNG, WebP
function getMimeFromMagicBytes(buffer) {
  if (!buffer || buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }

  // WebP: RIFF .... WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return "image/webp";
  }

  return null;
}

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_RECENT_WORK_IMAGE_SIZE,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (allowed.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and WebP images are allowed."));
    }
  },
});

function handleRecentWorkImageUpload(fieldName = "image") {
  const multerSingle = upload.single(fieldName);

  return (req, res, next) => {
    multerSingle(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(413).json({
            success: false,
            message: "Image must be 200 KB or smaller.",
          });
        }
        return res.status(400).json({ success: false, message: err.message });
      } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      if (req.file) {
        const detectedMime = getMimeFromMagicBytes(req.file.buffer);
        if (!detectedMime) {
          return res.status(400).json({
            success: false,
            message: "Invalid file content. Only real JPEG, PNG, or WebP images are accepted.",
          });
        }
        req.file.verifiedMime = detectedMime;
      }

      next();
    });
  };
}

module.exports = {
  handleRecentWorkImageUpload,
  getMimeFromMagicBytes,
  MAX_RECENT_WORK_IMAGE_SIZE,
};
