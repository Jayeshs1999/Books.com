import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModule.js";
import fisherYatesShuffle from "../routes/suffleBooks.js";

//@desc Fetch all products
//@route GET /api/products
//@access Public
const getProducts =asyncHandler( async (req,res)=>{
    const pageSize = process.env.PAGINATION_LIMIT;
    const page = Number(req.query.pageNumber) || 1;

    const category = req.query.category;
    const user = req.query.userId;
    const  keyword = req.query.keyword ? {name: {$regex: req.query.keyword, $options: 'i'}} : {}
    const categoryFilter = category ? { category } : {};

    // Add userId filter if it is available in the request
    const userIdFilter = user ? { user } : {};
      // Combine all filters
    const filters = { ...keyword, ...categoryFilter, ...userIdFilter };

    const count = await Product.countDocuments(filters);
    if(user) {
        const products = await Product.find(filters)
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ updatedAt: -1 });

        res.json({products, page, pages: Math.ceil(count/pageSize)  });
    }else {
        const products = await Product.find(filters)
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .lean() // Convert documents to plain JavaScript objects

    // Randomize the order of products using Fisher-Yates shuffle
    const randomizedProducts = fisherYatesShuffle(products);

    res.json({products:randomizedProducts, page, pages: Math.ceil(count/pageSize)  });
    }
});


//@desc Fetch products by id
//@route GET /api/products/:id
//@access Public
const getProductsById =asyncHandler( async (req,res)=>{
    const product =await Product.findById(req.params.id)
    if(product){
       return res.json(product);
    }else {
        res.status(404);
        throw new Error('Resoure not found')
    }

})

//@desc Create a products
//@route POST /api/products
//@access Private/Admin
const createProduct =asyncHandler( async (req,res)=>{
    const  {
        name, 
        price, 
        description, 
        image, 
        brand,
        category,
        countInStock,
        address,
        phoneNumber,
        bookType
    } = req.body;
    
    const product = new Product({
        name: name,
        price: price,
        user: req.user._id,
        image: image? image : 'https://firebasestorage.googleapis.com/v0/b/bookbucket-5253e.appspot.com/o/images%2F26690.jpg?alt=media&token=91f701e4-4f9f-4552-9c40-fdc86f9e3f66&_gl=1*5qo2th*_ga*MzcyMzM2MzI5LjE2OTI0NTY4ODU.*_ga_CW55HF8NVT*MTY5NzYyOTIzMy4yNC4xLjE2OTc2MjkyNjguMjUuMC4w',
        brand: brand,
        category: category,
        countInStock: countInStock,
        numReviews: 0,
        description: description,
        address: address,
        phoneNumber: phoneNumber,
        bookType: bookType
    })

    const createProduct = await product.save();
    res.status(201).json(createProduct)

})

//@desc Update a products
//@route PUT /api/products/:id
//@access Private/admin
const updateProduct =asyncHandler( async (req,res)=>{
    const  {
        name, 
        price, 
        description, 
        image, brand,
        category,
        countInStock,
        address,
        phoneNumber,
        bookType
    } = req.body;

    const product = await Product.findById(req.params.id);
    if(product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;
        product.address = address,
        product.phoneNumber = phoneNumber
        product.bookType = bookType

        const updateProduct =await product.save();
        res.json(updateProduct);
    }else {
        res.status(404);
        throw new Error('Resoure not found')
    }
})

//@desc delete a product
//@route DELETE /api/products/:id
//@access Private/admin
const deleteProduct =asyncHandler( async (req,res)=>{

    const product = await Product.findById(req.params.id);

    if(product) {
        await Product.deleteOne({_id: product._id})
        res.status(200).json({message: "Product deleted"})
    }else {
        res.status(404);
        throw new Error('Resoure not found')
    }
})

//@desc create new review
//@route POST /api/products/:id/reviews
//@access Private/admin
const createProductReview =asyncHandler( async (req,res)=>{

    const {rating, comment} = req.body;

    const product = await Product.findById(req.params.id);

    if(product) {
        const alreadyReviewed = product.reviews.find(
            (review)=>review.user.toString()=== req.user._id.toString()
        );
        if(alreadyReviewed) {
            req.status(400);
            throw new Error('Product already reviewed')
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }   
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc,review)=> acc + review.rating,0)/product.reviews.length;

        await product.save();
        await res.status(201).json({message: 'Review added'})
    }else {
        res.status(404);
        throw new Error('Resoure not found')
    }
})

//@desc GET TOp rated products
//@route GET /api/products/top
//@access Public
const getTopProducts =asyncHandler( async (req,res)=>{
    const products =await Product.find({}).sort({rating: -1}).limit(3);
    res.status(200).json(products)

})


export {getProducts,
    getProductsById, 
    deleteProduct,
    updateProduct, 
    createProductReview,
    getTopProducts,
    createProduct};