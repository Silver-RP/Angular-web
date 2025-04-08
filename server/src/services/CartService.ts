import CartModel from '../models/Cart';
import OrderModel from '../models/Order'
import ProductModel  from '../models/Product';
import WishlistModel from '../models/Wishlist';
import mongoose from 'mongoose';

type CartSuccessResponse = {
    success: true;
    cart: any[];
}

type CartErrorResponse = {
    success: false;
    message: string;
}

type OrderStatus =
  | "pending"
  | "shipping"
  | "completed"
  | "cancelled"
  | "returned";

const STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
    pending: ["shipping", "cancelled"],
    shipping: ["completed", "returned"],
    completed: [],
    cancelled: [],
    returned: [],
  };

type CartResponse = CartSuccessResponse | CartErrorResponse;

class CartService {

    static async addToCart(userId: string, productId: string, quantity: number = 1) {
        try {
            if (!userId) {
                return { success: false, message: 'User ID is required' };
            }
            let cart = await CartModel.findOne({ userId });

            if (!cart) {
                cart = new CartModel({ userId, products: [{ productId, quantity }] });
            } else {
                const index = cart.products.findIndex(p => p.productId.toString() === productId);
                if (index > -1) {
                    cart.products[index].quantity += quantity;
                } else {
                    cart.products.push({ productId: new mongoose.Types.ObjectId(productId), quantity });
                }
            }

            await cart.save();
            return {
                success: true,
                cart,
            };
        } catch (error) {
            console.error('Error in addToCart:', error);
            return { success: false, message: 'Failed to add to cart', error };
        }
    }

    static async getCart(userId: string): Promise<CartResponse> {
        try {
            if (!userId) {
                return { success: false, message: 'User ID is required' };
            }
            const cart = await CartModel.findOne({ userId })
                .populate({
                    path: 'products.productId',
                }).lean();
            if (!cart) {
                return { success: true, cart: [] };
            }
            return { success: true, cart: cart.products ?? [] };
        } catch (error) {
            console.error('Error in getCart:', error);
            return { success: false, message: 'Failed to get cart' };
        }
    }

    static async updateCart(userId: string, productId: string, quantity: number) {
        try {
            if (!userId) {
                return { success: false, message: 'User ID is required' };
            }
    
            let cart = await CartModel.findOne({ userId });
            if (!cart) {
                return { success: false, message: 'Cart not found' };
            }
    
            const index = cart.products.findIndex(p => p.productId.toString() === productId);
            if (index === -1) {
                return { success: false, message: 'Product not found in cart' };
            }
            if (quantity <= 0) {
                cart.products.splice(index, 1); // Remove product if quantity is 0
            } else {
                cart.products[index].quantity = quantity; // Update quantity
            }
            await cart.save();
    
            return {
                success: true,
                cart,
            };
        } catch (error) {
            console.error('Error in updateCart:', error);
            return { success: false, message: 'Failed to update cart', error };
        }
    }

    static async removeFromCart(userId: string, productId: string) {
        try {
            const cartItem = await CartModel.findOne({
                userId,
                products: { $elemMatch: { productId } }
            });
    
            if (!cartItem) {
                return { success: false, message: "Item not found in cart" };
            }
    
            const updatedCart = await CartModel.findOneAndUpdate(
                { userId },
                { $pull: { products: { productId } } },
                { new: true }
            );
    
            if (!updatedCart) {
                return { success: false, message: "Failed to remove item from cart" };
            }
    
            return { success: true, message: "Item removed from cart" };
        } catch (error) {
            console.error("❌ Error in removeFromCart:", error);
            return { success: false, message: "Failed to remove item", error };
        }
    }

    static async addPlaceOrder(
        userId: string,
        name: string,
        phone: string,
        city: string,
        address: string,
        addressDetails: string,
        paymentMethod: string,
        shippingMethod: string,
        shippingFee: number
    ) {
        try {
    
            const cart = await CartModel.findOne({ userId });
            if (!cart || cart.products.length === 0) {
                console.log("❌ Cart is empty or not found.");
                return { success: false, message: "Cart is empty." };
            }
    
            const orderItems = cart.products.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));
    
            const productIds = orderItems.map(item => item.productId);
            const products = await ProductModel.find({ _id: { $in: productIds } });
    
            const productMap = new Map(
                products.map(product => [product._id.toString(), product])
            );
    
            let totalAmount = 0;
            let totalOrderValue = 0;
    
            for (const item of orderItems) {
                const product = productMap.get(item.productId.toString());
    
                if (!product) {
                    console.log(`❌ Invalid product in cart: ${item.productId}`);
                    return { success: false, message: `Invalid product in cart: ${item.productId}` };
                }
    
                totalAmount += item.quantity;
                totalOrderValue += (product.salePrice) * item.quantity ;
            }
            
            totalOrderValue += shippingFee;
            const newOrder = await OrderModel.create({
                userId,
                items: orderItems,
                shippingInfo: { name, phone, city, address, addressDetails },
                paymentMethod,
                shippingMethod,
                shippingFee,
                totalAmount,
                totalOrderValue,
                status: "pending",
            });
    
            console.log("🎉 Order created successfully:", newOrder);
    
            await CartModel.findOneAndDelete({ userId });
    
            return { success: true, message: "Order placed successfully!", order: newOrder, orderId: newOrder._id  };
        } catch (error) {
            console.error("🚨 Error placing order:", error);
            throw new Error("Internal Server Error");
        }
    }

    static async getOrderById(orderId: string) {
        try {
            if (!orderId) {
                return { success: false, message: "Order ID not provided" };
            }
    

            const order = await OrderModel.findOne({ _id: orderId })
            .populate("items.productId")
            .lean();
    
            if (!order) {
                return { success: false, message: "Order not found" };
            }
    
            return { success: true, message: "Order retrieved successfully", order };
        } catch (error) {
            console.error("❌ Error while getting Order by ID:", error);
            return { success: false, message: "Error retrieving order" };
        }
    }

    static async getOrders() {
        try {
            const orders = await OrderModel.find()
            .populate("items.productId")
            .lean();
    
            if (!orders) {
                return { success: false, message: "Order not found" };
            }
    
            return { success: true, message: "Order retrieved successfully", orders };
        } catch (error) {
            console.error("❌ Error while getting Order by ID:", error);
            return { success: false, message: "Error retrieving order" };
        }
    }

    static async toggleWishlist(userId: string, productId: string) {
        try {
            let wishlist = await WishlistModel.findOne({ userId });
    
            if (!wishlist) {
                wishlist = new WishlistModel({ userId, productIds: [productId] });
                await wishlist.save();
                return { success: true, message: "Wishlist created and product added" };
            }
    
            if (wishlist.productIds.some(id => id.toString() === productId)) {
                await WishlistModel.findOneAndUpdate(
                    { userId },
                    { $pull: { productIds: productId } }, 
                    { new: true }
                );
    
                return { success: true, message: "Product removed from wishlist" };
            }
    
            await WishlistModel.findOneAndUpdate(
                { userId },
                { $addToSet: { productIds: productId } },
                { new: true }
            );
    
            return { success: true, message: "Product added to wishlist" };
        } catch (error) {
            console.error("❌ Error while toggling wishlist:", error);
            return { success: false, message: "Error updating wishlist" };
        }
    }

    static async getWishlist(userId: string) {
        try {
            const wishlist = await WishlistModel.findOne({ userId })
                .populate('productIds')
                .lean();
    
            if (!wishlist) {
                return { success: true, message: "Wishlist not found", wishlistProducts: [] };
            }
    
            return { success: true, message: "Wishlist retrieved successfully", wishlistProducts: wishlist.productIds };
        } catch (error) {
            console.error("❌ Error while getting wishlist:", error);
            return { success: false, message: "Error retrieving wishlist" };
        }
    }

    static async cancelOrder(orderId: string) {
        try {
            const order = await OrderModel.findOne({ _id: orderId });
    
            if (!order) {
                return { success: false, message: "Order not found" };
            }
    
            order.status = "cancelled";
            order.cancelledAt = new Date();
            await order.save();
    
            return { success: true, message: "Order cancelled successfully", order };
        } catch (error) {
            console.error("❌ Error while cancelling order:", error);
            return { success: false, message: "Error cancelling order" };
        }
    }

    static async setStatusOrder(orderId: string, status: "pending" | "shipping" | "completed" | "cancelled" | "returned") {
        try {
            const order = await OrderModel.findOne({ _id: orderId });
    
            if (!order) {
                return { success: false, message: "Order not found" };
            }
    
            const currentStatus = order.status as keyof typeof STATUS_FLOW;
    
            if (!STATUS_FLOW[currentStatus]?.includes(status)) {
                return { success: false, message: "Invalid status transition" };
            }
    
            order.status = status;
            await order.save();
    
            return { success: true, message: "Order status updated successfully", order };
        } catch (error) {
            console.error("❌ Error while updating order status:", error);
            return { success: false, message: "Error updating order status" };
        }
    }
    
    
    
    
    
    
    
    
    
    
    



}

export default CartService;
