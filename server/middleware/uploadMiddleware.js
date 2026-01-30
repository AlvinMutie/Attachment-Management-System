const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDir = 'uploads';
const logoDir = 'uploads/logos';
const logbookDir = 'uploads/logbooks';
const csvDir = 'uploads/csv';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(logoDir)) {
    fs.mkdirSync(logoDir);
}
if (!fs.existsSync(logbookDir)) {
    fs.mkdirSync(logbookDir);
}
if (!fs.existsSync(csvDir)) {
    fs.mkdirSync(csvDir);
}

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, logoDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only images (jpeg, jpg, png, webp, svg) are allowed'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

const logbookStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, logbookDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'evidence-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const logbookFileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only images and PDFs are allowed for logbook evidence'));
    }
};

const uploadLogbook = multer({
    storage: logbookStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for evidence
    fileFilter: logbookFileFilter
});

const csvStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, csvDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'roster-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const csvFileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.csv') {
        cb(null, true);
    } else {
        cb(new Error('Only CSV files are allowed for bulk onboarding'));
    }
};

const uploadCSV = multer({
    storage: csvStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit for CSV
    fileFilter: csvFileFilter
});

module.exports = {
    uploadLogo: upload.single('logoFile'),
    uploadLogbook: uploadLogbook.array('evidenceFiles', 5), // Support up to 5 files
    uploadCSV: uploadCSV.single('csvFile')
};
