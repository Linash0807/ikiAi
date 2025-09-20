import { Request, Response } from "express";
import { UserProfileSchema } from '../../utils/zodSchemas';
import { getUserProfile, upsertUserProfile } from '../../data-access/user.repository';
import { uploadProfileFile } from '../../services/profile.service';

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.uid;
        const profile = await getUserProfile(userId);
        if (!profile) {
            // Return 200 with empty object if profile not created yet, common practice
            return res.status(200).json({});
        }
        res.status(200).json(profile);
    } catch (error) {
        console.error("Error getting profile:", error);
        res.status(500).json({ error: "Failed to retrieve profile." });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.uid;
        // Use .partial() to allow updating only some fields
        const parsedBody = UserProfileSchema.partial().safeParse(req.body);

        if (!parsedBody.success) {
            return res.status(400).json({ error: "Invalid profile data", details: parsedBody.error.errors });
        }

        await upsertUserProfile(userId, parsedBody.data);
        const updatedProfile = await getUserProfile(userId);
        res.status(200).json(updatedProfile);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Failed to update profile." });
    }
};

export const uploadFile = async (req: Request, res: Response, fileType: 'picture' | 'resume') => {
    try {
        const userId = (req as any).user.uid;
        if (!(req as any).file) {
            return res.status(400).json({ error: "No file uploaded." });
        }
        
        const path = await uploadProfileFile(userId, (req as any).file, fileType);
        const fieldToReturn = fileType === 'picture' ? 'profilePictureUrl' : 'resumePath';

        res.status(201).json({ 
            message: "File uploaded successfully.", 
            [fieldToReturn]: path 
        });

    } catch (error) {
        console.error(`Error uploading ${fileType}:`, error);
        res.status(500).json({ error: `Failed to upload ${fileType}.` });
    }
};
