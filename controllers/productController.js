import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc    Fetch all products 
// @route   GET /api/products
// @access  Public 
const getProducts = asyncHandler(async (req, res) => { 

    const pageSize = 10   
    const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? { 
        name: {
          $regex: req.query.keyword, 
          $options: 'i',
        },
      }
    : {}

  
   const count = await Product.countDocuments({ ...keyword })
  const products = await Product.find({...keyword }).limit(pageSize)
     .skip(pageSize * (page - 1)).sort({ createdAt: -1 } )

  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

const getProductsFilter = asyncHandler(async (req, res) => {

  const keyword = req.query.keyword 
    ? {
      name: {
        $regex: req.query.keyword, 
        $options: 'i',
      },
    }
    : {}

  const products = await Product.find({ ...keyword }).sort({ createdAt: -1 })

  res.json({ products })
})

// @desc    Fetch single product
// @route  GET /api/products/:id 
// @access  Public
const getProductById = asyncHandler(async (req, res)=>{
const product = await Product.findById(req.params.id)
    if (product) {
        res.json(product)
    } else {
        res.status(404)
        throw new Error('Product is not found')  
    }
 
   
})


// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {

  
  const product = await Product.findById(req.params.id)

  if (product) {
    await product.remove()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create a product
// @route   POST /api/products 
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    remise,
    price, 
    brand,
    category,
    image,
    subCategoryId,
    subCategoryId2,
    description,
    countInStock, 
    recommander
    
  } = req.body 

  console.log(req.user)

  const product = new Product({
    name,
    remise,
    price,
    user: req.user._id, 
    image, 
    brand,
    category,
    subCategoryId,
    subCategoryId2,
    description, 
    countInStock,
    recommander,
    
  }) 

  const createdProduct = await product.save()
  res.status(201).json(createdProduct) 
})


// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => { 
  const {
    name,
    remise,
    price,
    description,
    image, 
    brand,
    category,
    subCategoryId,
    subCategoryId2,
    countInStock,
    recommander
  } = req.body 

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.remise = remise
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.subCategoryId = subCategoryId
    product.subCategoryId2 = subCategoryId2
    product.countInStock = countInStock 
    product.recommander = recommander

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed') 
    }

    const review = {
      name: req.user.name,
      rating: Number(rating), 
      comment,
      user: req.user._id,
    }

    product.reviews.unshift(review)

    product.numReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})     


// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({  rating: -1 })

  res.json(products)
})

// @desc    Get new products
// @route   GET /api/products/nouveaux
// @access  Public

const getNouveaxProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: -1 })

  res.json(products)
})

// @desc    Get the product by the category
// @route   GET /api/products/category/:category
// @access  Public

const category = asyncHandler(async (req, res) => {
  const pageSize = 50
  const page = Number(req.query.pageNumber) || 1

  
  const products = await Product.find({ category: req.params.category }).limit(pageSize)
    .skip(pageSize * (page - 1)).sort({createdAt: -1})

  const count = await Product.countDocuments({ category: req.params.category })

  if (products) {
    
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
    
  } else { 
    res.status(404)
    throw new Error('Product not found') 
  }
})
 
const SubCategory = asyncHandler(async (req, res) => {
  const pageSize = 50
  const page = Number(req.query.pageNumber) || 1


  const products = await Product.find({ subCategoryId: req.params.category }).limit(pageSize)
    .skip(pageSize * (page - 1)).sort({ createdAt: -1 })

  const count = await Product.countDocuments({ subCategoryId: req.params.category })

  if (products) {

    res.json({ products, page, pages: Math.ceil(count / pageSize) })
  } else { 
    res.status(404)
    throw new Error('Product not found') 
  }
}) 

const SubCategory2 = asyncHandler(async (req, res) => {
  const pageSize = 50
  const page = Number(req.query.pageNumber) || 1


  const products = await Product.find({ subCategoryId2: req.params.category }).limit(pageSize)
    .skip(pageSize * (page - 1)).sort({ createdAt: -1 })

  const count = await Product.countDocuments({ subCategoryId2: req.params.category })

  if (products) {

    res.json({ products, page, pages: Math.ceil(count / pageSize) })
  } else { 
    res.status(404)
    throw new Error('Product not found') 
  }
})


export {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getTopProducts,
    category,
    SubCategory,
    SubCategory2,
  getProductsFilter,
  getNouveaxProducts
}