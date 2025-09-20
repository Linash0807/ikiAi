"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfileFile = void 0;
const firebase_1 = require("../config/firebase");
const user_repository_1 = require("../data-access/user.repository");
/**
 * Handles the upload of a profile picture or a resume.
 */
const uploadProfileFile = async (userId, file, fileType) => {
    const bucket = firebase_1.storage.bucket();
    const folder = fileType === 'picture' ? 'profile-pictures' : 'resumes';
    const filePath = `${folder}/${userId}/${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(filePath);
    const stream = fileUpload.createWriteStream({
        metadata: { contentType: file.mimetype },
        public: fileType === 'picture', // Make profile pictures public
    });
    return new Promise((resolve, reject) => {
        stream.on('error', reject);
        stream.on('finish', async () => {
            const updateData = fileType === 'picture'
                ? { profilePictureUrl: fileUpload.publicUrl() }
                : { resumePath: filePath };
            await (0, user_repository_1.upsertUserProfile)(userId, updateData);
            resolve(fileType === 'picture' ? fileUpload.publicUrl() : filePath);
        });
        stream.end(file.buffer);
    });
};
exports.uploadProfileFile = uploadProfileFile;
