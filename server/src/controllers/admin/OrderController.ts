import e, { Request, Response } from "express";
import CartService from "../../services/CartService";

class OrderController{
    async getAllOrders(req: Request, res: Response) {
        try {
            const orders = await CartService.getOrders();
            res.status(200).json({success: true, message: "Get Orders susscessfully", data: orders });
        } catch (error) {
            console.error('Error in getAllOrders:', error);
            res.status(500).json({ 
                message: error instanceof Error ? error.message : 'Internal server error' 
            });
        }
    }

    async setStatusOrder(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!["pending", "shipping", "completed", "cancelled", "returned"].includes(status)) {
                res.status(400).json({ success: false, message: "Invalid status" });
                return ;
            }
            const result = await CartService.setStatusOrder(id, status as "pending" | "shipping" | "completed" | "cancelled" | "returned");
    
            if (!result.success) {
                res.status(400).json(result);
                return ;
            }
            res.status(200).json({ success: true, message: "Update Order successfully", data: result.order });
            return ;
        } catch (error) {
            console.error("Error in setStatusOrder:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    
}

export default new OrderController();