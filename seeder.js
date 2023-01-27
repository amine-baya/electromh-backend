import mongoose from "mongoose";
import dotenv from "dotenv";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from './config/db.js'

dotenv.config()



const importdata = async () => {
    await connectDB()
   try {
        await User.deleteMany()
        await Product.deleteMany()
        await Order.deleteMany()

        const createdUsers = await User.insertMany(users)

        const adminUser = createdUsers[0]._id

        const sampleProducts = products.map(product => {
            return { ...product, user: adminUser}
        })

        await Product.insertMany(sampleProducts)

        console.log("data imported");
        process.exit()

   } catch (error) {
       console.error(error);
       process.exit(1)
   }
}

const destroydata = async () => {
    await connectDB()
   try {
        await User.deleteMany()
        await Product.deleteMany()
        await Order.deleteMany()

        console.log("data destroyed");
        process.exit()

   } catch (error) {
       console.error(error);
       process.exit(1)
   }
}
if (process.argv[2] ==='-d') {
    destroydata()
} else {
    importdata()
}
