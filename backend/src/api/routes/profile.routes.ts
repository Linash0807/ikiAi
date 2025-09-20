import { Router } from 'express';
import multer from 'multer';
import { getProfile, updateProfile, uploadFile } from '../controllers/profile.controller';
import { verifyAuth } from '../middlewares/verifyAuth.middleware';

const router = Router();
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.get('/', verifyAuth, getProfile);
router.put('/', verifyAuth, updateProfile);
router.post('/picture', verifyAuth, upload.single('profilePicture'), (req, res) => uploadFile(req, res, 'picture'));
router.post('/resume', verifyAuth, upload.single('resumeFile'), (req, res) => uploadFile(req, res, 'resume'));

export default router;

