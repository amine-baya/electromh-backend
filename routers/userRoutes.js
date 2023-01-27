import express from 'express';
import { authUser, registerUser, google, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserById, updateUser, getAvis, createAvis, deleteAvis} from '../controllers/userController.js'
import {protect,admin} from '../middleware/authMiddleware.js' 



const router = express.Router()

router.route('/').post(registerUser).get(protect,admin,getUsers)     
router.post('/google', google)
router.post('/login', authUser)    
router.route('/profile').get(protect , getUserProfile).put(protect,updateUserProfile)
router.route('/avis').get(getAvis).post(protect,createAvis).delete(protect,admin,deleteAvis)
router.route('/avis/:id').delete(protect, admin, deleteAvis)
router.route('/:id').delete(protect,admin,deleteUser).get(protect,getUserById).put(protect,admin, updateUser)
 
export default router  