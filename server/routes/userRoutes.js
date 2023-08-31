import express from 'express';
const router = express.Router();
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
} from '../controller/userController.js';
import { protectedRoute } from '../middleware/authMiddleware.js';

router.post('/auth', authUser);
router.post('/', registerUser);
router.post('/logout', logoutUser);
router.route('/profile').get(protectedRoute, getUserProfile).put(protectedRoute, updateUserProfile);


export default router;