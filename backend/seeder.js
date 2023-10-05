import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModule.js";
import Product from "./models/productModule.js";
import Order from "./models/orderModule.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async ()=> {

    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createUsers = await User.insertMany(users);
        const adminUser = createUsers[0]._id;

        const sampleProducts = products.map((product)=>{
            return {...product,user:adminUser}
        });

        await Product.insertMany(sampleProducts)
        console.log("data Imported :".green.inverse)
        process.exit();
    } catch(error){
        console.log(`${error}`.red.inverse)
        process.exit(1);
    }
}

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        console.log("data Destroyed ! :".red.inverse)
        process.exit();
    } catch(error){
        console.log(`${error}`.red.inverse)
        process.exit(1);
    } 
}

if(process.argv[2]==='-d') {
    destroyData();
}else {
    importData();
}
