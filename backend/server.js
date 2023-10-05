import express from 'express';
import dotenv from 'dotenv'; 
import connectDB from './config/db.js';
import productRoutes from './routes/productRoute.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
dotenv.config();
const port = process.env.PORT || 5000;

connectDB();  //connect to mongoDB

const app = express();

app.get('/', (req,res)=> {
    res.send('API is running...');
});

app.use('/api/products',productRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(port,()=>{console.log(`server running on ${port}`)})