import express from 'express';

const router = express.Router(); 
/*
import { getCategories, createCategory, createCategorySub, createCategorySubSub/*, updateCategories, deleteCategories  } from '../controllers/categoryController.js'
*/
import {
    getCategories, addCategory,  updateCategories, deleteCategories  } from '../controllers/categoryController.js'

import { protect, admin } from '../middleware/authMiddleware.js' 

 
/*
router.route('/').get(getCategories).post(protect, admin, createCategory)
router.route('/:id/subs/smallSubs').post(protect, admin, createCategorySubSub)
router.route('/:id/subs').post(protect, admin, createCategorySub)
router.route('/:id').delete(protect, admin, deleteCategories).put(protect, admin, updateCategories)

*/
router.route('/').get(getCategories)
router.route('/create').post(protect, admin, addCategory)
router.route('/modifie/:id').put(protect, admin, updateCategories).delete(protect, admin, deleteCategories)

 

export default router


