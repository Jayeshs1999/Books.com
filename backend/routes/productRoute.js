import express from "express";
const router = express.Router();
import { createProduct, createProductReview, deleteProduct, getProducts,getProductsById, getTopProducts, updateProduct } from "../controllers/productController.js";
import { protect,admin} from '../middleware/authMiddleware.js';
import checkObjectId from "../middleware/checkObjectId.js";

router.route('/').get(getProducts).post(protect, createProduct);
router.get('/top', getTopProducts)

router.route('/:id').get(checkObjectId,getProductsById).put(protect,checkObjectId,updateProduct).delete(protect,checkObjectId, deleteProduct);

router.route('/:id/reviews').post(protect,checkObjectId,createProductReview)


export default router;