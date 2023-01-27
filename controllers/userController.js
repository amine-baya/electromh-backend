import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js' 
import Avis from '../models/avis.js'

const authUser = asyncHandler(async (req, res)=>{
  
    const {email, password} = req.body
    const user = await User.findOne({email})
     
    if(user ){ 
      if ((await user.matchPassword(password))) {
        res.json({  
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin, 
            token: generateToken(user._id)
        })
      } else {
        res.status(401) 
        throw new Error('Invalid  password')
      }
        
    }else{
        res.status(401) 
        throw new Error('Invalid email')
        
    }
    
})


const registerUser = asyncHandler(async (req, res)=>{ 
    const {name, email, password} = req.body

    const userExists = await User.findOne({email}) 
     
    if(userExists){
        res.status(400)
        throw new Error('User already exists')
    }

    const user = await User.create({
         name,
         email,
         password
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id) 
        })
    } else {
        res.status(400)
        throw new Error('Invalid User data')
    }
    
})


const google = asyncHandler(async (req, res)=>{

   const {name, email} = req.body

   

   const userExist = await User.findOne({email})

   if (userExist) {

     res.status(201).json({
       _id: userExist._id,
       name: userExist.name,
       email: userExist.email,
       isAdmin: userExist.isAdmin,
       token: generateToken(userExist._id)

     })
   }
   
   const user = await User.create({
          name,
          email
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id) 
        })
    } else {
        res.status(400)
        throw new Error('Invalid User data ')
    }

})


const getUserProfile = asyncHandler(async (req, res)=>{
    
    const user = await User.findById(req.user._id)
      
    if(user){

          res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })
    }else {
        res.status(404)
        throw new Error('User not found ')
    }

})

const updateUserProfile = asyncHandler(async (req, res)=>{
    
    const user = await User.findById(req.user._id)
     
    if(user){
        user.name = req.body.name || user.name 
        user.email = req.body.email || user.email
        user.password = req.body.password ||  user.password
       
    
        const updatedUser = await user.save()
          res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        })
    }else { 
        res.status(404)
        throw new Error('User not found ')
    }
})

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {

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
  const count = await User.countDocuments({ ...keyword })
  const users = await User.find({ ...keyword }).limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({users, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found') 
  }
})



// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin === undefined ? user.isAdmin : req.body.isAdmin

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

const createAvis = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const aviss = await Avis.find({})

  if (aviss) {
    const alreadyReviewed = aviss.find(
      (r) => r.user.toString() === req.user._id.toString()
       
    )
    
    if (alreadyReviewed) {
      res.status(400)
      throw new Error('avis already reviewed')
    } 

    const avis = new Avis({
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
      
    })

    const review = await avis.save()

    res.status(201).json(review)
  } else {
    res.status(404)
    throw new Error('avis not found')
  }
})

const getAvis = asyncHandler (async (req, res) => {

  const avis = await Avis.find({})
  const count = await Avis.countDocuments({ }) 
  
  if (avis) { 
    res.status(200).json({avis, count})
  } else {
    res.status(404)
    throw new Error('avis not found')
  }
})

const deleteAvis = asyncHandler(async (req, res) => {
  const avis = await Avis.findById(req.params.id)

  if (avis) {
    await avis.remove()
    res.json({ message: 'avis removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})
export { authUser, registerUser, google, getUserProfile, updateUserProfile, getUsers, deleteUser, getUserById, updateUser, createAvis, getAvis, deleteAvis}