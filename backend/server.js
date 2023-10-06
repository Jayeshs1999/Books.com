import express from 'express';
import dotenv from 'dotenv'; 
import connectDB from './config/db.js';
import productRoutes from './routes/productRoute.js'
import userRoute from './routes/userRoute.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

import cookieParser from 'cookie-parser';
dotenv.config();
const port = process.env.PORT || 5000;

connectDB();  //connect to mongoDB

const app = express();

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// cookie parser middleware
app.use(cookieParser());

app.get('/', (req,res)=> {
    res.send('API is running...');
});

app.use('/api/products',productRoutes)
app.use('/api/users',userRoute)

app.use(notFound)
app.use(errorHandler)

app.listen(port,()=>{console.log(`server running on ${port}`)})