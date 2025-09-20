import { storage } from '../config/firebase';
import { upsertUserProfile } from '../data-access/user.repository';

/**
 * Handles the upload of a profile picture or a resume.
 */
export const uploadProfileFile = async (
    userId: string,
    file: any,
    fileType: 'picture' | 'resume'
): Promise<string> => {
    const bucket = storage.bucket();
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
            
            await upsertUserProfile(userId, updateData);
            resolve(fileType === 'picture' ? fileUpload.publicUrl() : filePath);
        });
        stream.end(file.buffer);
    });
};

