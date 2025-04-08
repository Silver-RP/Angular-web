import { Router } from 'express';
import express, { Request, Response } from 'express';
import ProductController from '../../controllers/ProductController';
import AuthController from '../../controllers/AuthController';
import CartController from '../../controllers/CartController';
import authMiddleware  from '../../middlewares/AuthMiddleware';
// import express, { Request, Response, NextFunction } from 'express';


const router = Router();


router.get('/', ProductController.getHomeProducts);
router.get('/about', (req, res) => {
  res.render('app/about', { layout: 'app', title: 'About Page' });
});
router.post("/add-to-cart", authMiddleware as express.RequestHandler, CartController.addToCart as express.RequestHandler,);
router.post('/add-to-wishlist',  authMiddleware as express.RequestHandler, CartController.toggleWishlist as express.RequestHandler);
router.get('/category-pro/:cateId', ProductController.getProductsByCateId);
router.get('/checkout', (req, res) => {
  res.render('app/checkout', { layout: 'app', title: 'Checkout Page' });
});
router.get('/cart',  authMiddleware as express.RequestHandler, CartController.getCart as express.RequestHandler);
router.put('/cart-update', authMiddleware as express.RequestHandler, CartController.updateCart as express.RequestHandler);
router.delete('/cart/remove/:id', authMiddleware as express.RequestHandler, CartController.removeFromCart as express.RequestHandler);
router.post('/cancel-order/:orderId', authMiddleware as express.RequestHandler, CartController.cancelOrder as express.RequestHandler);
router.post('/change-user-info', authMiddleware as express.RequestHandler, AuthController.changeUserInfo as unknown as express.RequestHandler);
router.get('/contact', (req, res) => {
  res.render('app/contact', { layout: 'app', title: 'Contact Page' });
});
router.get('/detail/:id', ProductController.getProductById);
router.post('/forgot-password', AuthController.forgotPassword as any);

router.get('/login', (req, res) => {
  res.render('app/login', { layout: 'app', title: 'Login Page' });
});
router.post('/login', AuthController.login as any);
router.get('/logout', AuthController.logout as any);
router.get('/order/:id', authMiddleware as express.RequestHandler, CartController.getOrderById as express.RequestHandler);
router.get('/orders', authMiddleware as express.RequestHandler, CartController.getOrders as express.RequestHandler);
router.post('/place-order', authMiddleware as express.RequestHandler, CartController.addPlaceOrder as express.RequestHandler);
router.get('/profile', (req, res) => {
  res.render('app/my-account', { layout: 'app', title: 'Profile Page' });
});
router.post('/refresh-token', AuthController.refreshToken as any);
router.get('/register', (req, res) =>{
  res.render('app/register', { layout: 'app', title: 'Register Page' });
})
router.post('/reset-password', AuthController.resetPassword as any);
router.post('/register', AuthController.register as any);
router.get('/search', ProductController.searchProducts as any);
router.get('/shop', ProductController.getAllProducts);
router.post('/verify-email/:token', AuthController.verifyEmail as any);
router.get('/wishlist',  authMiddleware as express.RequestHandler, CartController.getWishlist as express.RequestHandler);









export default router;