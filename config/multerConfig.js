import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Set upload base path inside `src/uploads`
const UPLOAD_BASE_PATH = path.resolve('src', 'uploads');

// Create folder if it doesn't exist
const createFolder = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

// Multer storage for user-kid-profiles
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = path.join(UPLOAD_BASE_PATH, 'user-kid-profiles');
        createFolder(folder);
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const uniqueName = `userkid-${Date.now()}${path.extname(file.originalname)}`;
        req.filePath = path.join('uploads', 'user-kid-profiles', uniqueName); // relative path
        cb(null, uniqueName);
    }
});

// File filter for images only
const imageFileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed!'));
    }
};

// Export multer instance
const uploadUserKidProfile = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: imageFileFilter
});

export { uploadUserKidProfile };
