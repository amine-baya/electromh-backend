import path from 'path'
import express from 'express'
import multer from 'multer'
import Product from '../models/productModel.js'
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import { protect, admin } from '../middleware/authMiddleware.js'
const router = express.Router()



//multer s3
const s3 = new aws.S3();
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    accessSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-southeast-1'
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
      acl: 'public-read',
      s3: s3,
      bucket: `electromh`,
      metadata: function (req, file, cb) {
          cb(null, { fieldName: 'TESTING_METADATA' });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString());
        }
    })
});

router.get('/carousel', async (req, res) => {
    const product = await Product.find({ name : "carousel"}) 
    res.send(product)
})



router.route('/carousel').post( upload.array('image'), (req, res) => {
    
    res.send(`${[req.files.map(file => `${file.location}`)]}`)
})

router.route('/').post( upload.array('image'), (req, res) => {
    
    res.send(`${[req.files.map(file => `${file.location}`)]}`)
})

export default router