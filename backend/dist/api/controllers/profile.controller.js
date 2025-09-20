"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = exports.updateProfile = exports.getProfile = void 0;
const zodSchemas_1 = require("../../utils/zodSchemas");
const user_repository_1 = require("../../data-access/user.repository");
const profile_service_1 = require("../../services/profile.service");
const getProfile = async (req, res) => {
    try {
        const userId = req.user.uid;
        const profile = await (0, user_repository_1.getUserProfile)(userId);
        if (!profile) {
            // Return 200 with empty object if profile not created yet, common practice
            return res.status(200).json({});
        }
        res.status(200).json(profile);
    }
    catch (error) {
        console.error("Error getting profile:", error);
        res.status(500).json({ error: "Failed to retrieve profile." });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.uid;
        // Use .partial() to allow updating only some fields
        const parsedBody = zodSchemas_1.UserProfileSchema.partial().safeParse(req.body);
        if (!parsedBody.success) {
            return res.status(400).json({ error: "Invalid profile data", details: parsedBody.error.errors });
        }
        await (0, user_repository_1.upsertUserProfile)(userId, parsedBody.data);
        const updatedProfile = await (0, user_repository_1.getUserProfile)(userId);
        res.status(200).json(updatedProfile);
    }
    catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Failed to update profile." });
    }
};
exports.updateProfile = updateProfile;
const uploadFile = async (req, res, fileType) => {
    try {
        const userId = req.user.uid;
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }
        const path = await (0, profile_service_1.uploadProfileFile)(userId, req.file, fileType);
        const fieldToReturn = fileType === 'picture' ? 'profilePictureUrl' : 'resumePath';
        res.status(201).json({
            message: "File uploaded successfully.",
            [fieldToReturn]: path
        });
    }
    catch (error) {
        console.error(`Error uploading ${fileType}:`, error);
        res.status(500).json({ error: `Failed to upload ${fileType}.` });
    }
};
exports.uploadFile = uploadFile;
