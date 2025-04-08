import { Request, Response, NextFunction } from "express";
import CartService from "../services/CartService";

interface AuthRequest extends Request {
    user: {
        id: string;
    };
}

class CartController {
    async addToCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {

            const userId = req.user?.id;
            const { productId, quantity = 1 } = req.body; 

            if (!productId) {
                res.status(400).json({
                    success: false,
                    message: 'Product ID is required'
                });
                return;
            }

            if (quantity <= 0) {
                res.status(400).json({
                    success: false,
                    message: 'Quantity must be greater than 0'
                });
                return;
            }

            const result = await CartService.addToCart(userId, productId, quantity);
            if(result.success === false) {
                res.status(500).json({
                    success: false,
                    message: 'An error occurred while adding to cart'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Product added to cart successfully',
                data: result
            });
            return;

        } catch (error: any) {
            if (error.message === 'Product not found') {
                res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
                return;
            }

            if (error.message === 'Insufficient stock') {
                res.status(400).json({
                    success: false,
                    message: 'Insufficient stock available'
                });
                return;
            }

            console.error('Error in addToCart controller:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while adding to cart'
            });
            return;
        }
    }

    async getCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const result = await CartService.getCart(userId);
    
            if (result.success === false) {
                res.status(500).json({
                    success: false,
                    message: result.message || 'An error occurred while fetching cart',
                });
                return;
            }
    
            res.status(200).json({
                success: true,
                message: 'Cart fetched successfully',
                cart: result.cart,
            });
        } catch (error: any) {
            console.error('Error in getCart controller:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while fetching cart',
            });
        }
    }

    async updateCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const { productId, quantity } = req.body;
    
            if (!productId) {
                res.status(400).json({
                    success: false,
                    message: 'Product ID is required'
                });
                return;
            }
    
            if (quantity <= 0) {
                res.status(400).json({
                    success: false,
                    message: 'Quantity must be greater than 0'
                });
                return;
            }
    
            const result = await CartService.updateCart(userId, productId, quantity);
    
            if (!result.success) {
                res.status(500).json({
                    success: false,
                    message: 'An error occurred while updating cart'
                });
                return;
            }
    
            res.status(200).json({
                success: true,
                message: 'Cart updated successfully',
                data: result
            });
            return;
    
        } catch (error: any) {
            if (error.message === 'Product not found') {
                res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
                return;
            }
    
            if (error.message === 'Insufficient stock') {
                res.status(400).json({
                    success: false,
                    message: 'Insufficient stock available'
                });
                return;
            }
    
            console.error('Error in updateCart controller:', error);
            res.status(500).json({
                success: false,
                message: 'An error occurred while updating cart'
            });
            return;
        }
    }

    async removeFromCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id; 
            const { id: productId } = req.params;
    
            if (!userId) {
                res.status(401).json({ success: false, message: "Unauthorized" });
                return;
            }
            if (!productId) {
                res.status(400).json({ success: false, message: "Product ID is required" });
                return;
            }
    
            const cartItem = await CartService.removeFromCart(userId, productId);
    
            if (!cartItem.success) {
                res.status(404).json({ success: false, message: cartItem.message });
                return;
            }
    
            res.status(200).json({ success: true, message: cartItem.message });
        } catch (error) {
            console.error("Error removing item from cart:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async addPlaceOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const { name, phone, city, address, addressDetails, paymentMethod, shippingMethod, shippingFee } = req.body;
            console.log("check: ",  name, phone, city, address, addressDetails, paymentMethod, shippingMethod, shippingFee );
    
            if (!userId || !name || !phone || !city || !address || !addressDetails || !paymentMethod || shippingFee === null || shippingFee === undefined) {
                res.status(400).json({ success: false, message: "All fields are required." });
                return;
            }
    
            try {
                const orderResult = await CartService.addPlaceOrder(userId, name, phone, city, address, addressDetails, paymentMethod, shippingMethod, shippingFee );
                if(orderResult.success === false){
                    res.status(500).json({ success: false, message: "Failed Place Order." })
                    return;
                }
                res.status(201).json(orderResult);
            } catch (error) {
                console.error("❌ Error in CartService.addPlaceOrder:", error);
            }
        } catch (error) {
            console.error("Error placing order:", error);
            res.status(500).json({ success: false, message: "Internal Server Error" });
            return;
        }
    }

    async getOrderById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const orderId = req.params.id; 
    
            if (!orderId) {
                console.log("❌ Cannot get Order ID.");
                res.status(404).json({ success: false, message: "Cannot get Order ID." });
                return;
            }
    
            const result = await CartService.getOrderById(orderId);
            
            if (!result.success) { 
                res.status(400).json({ success: false, message: "Failed to get Order by ID." });
                return;
            }
    
            res.status(200).json({ success: true, message: "Order retrieved successfully.", order: result.order });
            return;
        } catch (error) {
            console.log("❌ Error when getting Order by ID:", error);
            res.status(500).json({ success: false, message: "Internal Server Error" });
            return;
        }
    }

    async getOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await CartService.getOrders();
            
            if (!result.success === true) { 
                res.status(400).json({ success: false, message: "Failed to get Order by ID." });
                return;
            }
    
            res.status(200).json({ success: true, message: "Order retrieved successfully.", orders: result.orders });
            return;
        } catch (error) {
            console.log("❌ Error when getting Order by ID:", error);
            res.status(500).json({ success: false, message: "Internal Server Error" });
            return;
        }
    }
    
    async toggleWishlist(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const { productId } = req.body;
    
            if (!productId) {
                res.status(400).json({ success: false, message: "Product ID is required" });
                return;
            }
    
            const result = await CartService.toggleWishlist(userId, productId);
            res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            console.error("❌ Error toggling wishlist:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async getWishlist(req: AuthRequest, res: Response, next: NextFunction): Promise<void> { 
        try {
            const userId = req.user?.id;
            const result = await CartService.getWishlist(userId);
    
            if (!result.success) {
                res.status(500).json({ success: false, message: result.message || "An error occurred while fetching wishlist" });
                return;
            }
    
            res.status(200).json({ success: true, message: "Wishlist fetched successfully", wishlist: result.wishlistProducts });
        } catch (error) {
            console.error("❌ Error getting wishlist:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    }

    async cancelOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const orderId = req.params.orderId;

            if (!orderId) {
                res.status(400).json({ success: false, message: "Order ID is required" });
                return;
            }

            const result = await CartService.cancelOrder(orderId);
            if (!result.success) {
                res.status(500).json({ success: false, message: result.message || "Failed to cancel order" });
                return;
            }

            res.status(200).json({ success: true, message: "Order cancelled successfully" });
        } catch (error) {
            console.log("Error while cancelling order:", error);
            res.status(500).json({ success: false, message: "Internal Server Error" });
            return;
        }
    }
    
    
    
    
    
    
    
    

    
}

export default new CartController();