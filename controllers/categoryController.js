
import Category from '../models/categoryModel.js'
import slugify  from "slugify"
import asyncHandler from 'express-async-handler'

function createCategories(categories, parentId = null) {
    const categorys = [];
    let category;
    if (parentId == null) {
        category = categories.filter((cat) => cat.parentId == undefined);
    } else {
        category = categories.filter((cat) => cat.parentId == parentId);
    }

    for (let cate of category) {
        categorys.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            parentId: cate.parentId,
            type: cate.type,
            children: createCategories(categories, cate._id),
        });
    }

    return categorys;
}

const addCategory = asyncHandler( async (req, res) => {
    const { name, parentId} = req.body
    const category = new Category({ 
        name,
        slug: slugify(name),
        parentId: parentId ? parentId : null
    })

    const createdCategory = await category.save()

    if (createdCategory) {
        res.status(201).json(createdCategory)
    } else {
        res.status(500).json({message: "sorry"})
    }
    
})

const getCategories = asyncHandler( async (req, res) => { 
    const categories = await Category.find({});

    if (categories) {
        const categorys = createCategories(categories);
        res.status(200).json({ categorys });
    } else {
        throw new Error('category not found')
    }



})
/*
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    if (categories) {
        res.status(200).json( categories );
    } else {
        throw new Error('category not found')
    }
})

*/
const updateCategories = asyncHandler( async (req, res) => {
        const {name, parentId} = req.body

        const category = await Category.findById(req.params.id)

        if (category) {
            category.name = name
            category.slug = slugify(name)
            category.parentId = parentId ? parentId : null
            
            const updatedCategory = await category.save()
            res.json(updatedCategory)
        } else { 
            res.status(404)
            throw new Error('Product not found')
        }
    
})

const deleteCategories = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id)

    if (category) {
        await category.remove()
        res.json({ message: 'Product removed' })
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})



export {
    getCategories,
    /*createCategory,
    createCategorySub,
    createCategorySubSub*/
    addCategory,
    updateCategories,
    deleteCategories

}