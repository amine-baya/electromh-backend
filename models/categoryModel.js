/*import mongoose from 'mongoose'
const subsubCategorySchema = mongoose.Schema({
  name: { type: String, required: true },

}, {
  timestamps: true
})

const subCategorySchema = mongoose.Schema({
  name: { type: String, required: true },
  smallSubs: [subsubCategorySchema],

  

}, {
  timestamps: true
})


const categorySchema =  mongoose.Schema( 
  {
    name: {
      type: String,
      required: true,
      trim: true, 
    },
    subs: [subCategorySchema],
  },
  { timestamps: true }
);

 const Category= mongoose.model('Category', categorySchema)
 

export default Category
*/


import mongoose from 'mongoose'
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    parentId: {
      type: String,
    },
   
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema)


export default Category
