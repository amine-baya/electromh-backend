import express from 'express'
const router = express.Router()     

import { getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts, category, SubCategory, SubCategory2, getProductsFilter, getNouveaxProducts} from '../controllers/productController.js'

import {protect,admin} from '../middleware/authMiddleware.js'  
 
router.route('/two').get(getProducts).post(protect, admin, createProduct)

router.route('/').get(getProducts).post(protect, admin, createProduct) 

router.route('/filter').get(getProductsFilter) 

router.route('/nouveaux').get(getNouveaxProducts) 
  
router.route('/:id/reviews').post(protect, createProductReview) 
 
router.route('/top').get(getTopProducts) 
 
router.route('/category/:category').get(category)

router.route('/sub-category/:category').get(SubCategory)  

router.route('/sub-category2/:category').get(SubCategory2)  

router.route('/:id').get(getProductById).delete(protect, admin, deleteProduct).put(protect, admin, updateProduct)  


 


export default router 