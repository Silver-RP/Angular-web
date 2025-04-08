import { Router } from 'express';
import ProductController from '../../controllers/admin/ProductController';
import CategoryController from '../../controllers/admin/CategoryController';
import UserController from '../../controllers/admin/UserController';
import OrderController from '../../controllers/admin/OrderController';
import multer from "multer";
import path from "path";
import fs from "fs";


const uploadDir = path.resolve(__dirname, "../../public/app/assets/images/products");
const uploadDirCategory = path.resolve(__dirname, "../../public/app/assets/images/home/demo3");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(uploadDirCategory)) {
    fs.mkdirSync(uploadDirCategory, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `product_${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const storageCategory = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirCategory);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `category_${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });
const uploadCategory = multer({ storage: storageCategory });


const router = Router();

router.get('/', (req, res) => {
  res.render('admin/home', { layout: 'admin', title: 'Admin Home Page' });
});

router.get('/categories', CategoryController.getAllCategories);
router.get('/category/:id', CategoryController.getCategoryById);
router.post('/add-category', uploadCategory.array("image", 1), CategoryController.createCategory);
router.put('/edit-category/:id', uploadCategory.array("image", 1), CategoryController.editCategory);
router.delete('/category/:id', CategoryController.deleteCategory);

router.get('/products', ProductController.getAllProducts);

router.post("/add-product", upload.array("images", 4), ProductController.createProduct);
router.put("/edit-product/:id", upload.array("images", 4), ProductController.editProduct);
router.delete("/product/:id", ProductController.deleteProduct);

router.get('/users', UserController.getAllUsers);

router.post('/add-user', UserController.addUser);

router.get('/user/:id', UserController.getUserById);

router.put('/user/:id', UserController.updateUser);

router.patch('/user/:id', UserController.toggleBlockUser);

router.get('/orders', OrderController.getAllOrders);

router.put('/order/:id', OrderController.setStatusOrder);




export default router;