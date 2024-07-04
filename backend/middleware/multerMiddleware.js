// middleware/multerMiddleware.js

const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Define the directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // console.log('File MIME type:', file.mimetype); // Log the MIME type of the file
        // console.log('File extension:', path.extname(file.originalname)); // Log the file's extension
        const filetypes = /wav|mp3|png|pdf|jpg|jpeg|jfif|ogg|webm/; // Include WebM in the allowed file types
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Audio files only!');
        }
    }
});

module.exports = upload;
