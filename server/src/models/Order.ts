import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
    userId: Schema.Types.ObjectId;
    items: { productId: Schema.Types.ObjectId; quantity: number }[];
    shippingInfo: {
        name: string;
        phone: string;
        city: string;
        address: string;
        addressDetails: string;
    };
    paymentMethod: "cash_on_delivery" | "paypal" | "credit_card";
    shippingMethod: "Free shipping" | "Flat rate" | "Local pickup";
    shippingFee: number;
    totalAmount: number;
    totalOrderValue: number;
    cancelledAt: Date;
    status: "pending" | "shipping" | "completed" | "cancelled" | "returned";
}

const OrderSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true },
            },
        ],
        shippingInfo: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            city: { type: String, required: true },
            address: { type: String, required: true },
            addressDetails: { type: String, required: true },
        },
        paymentMethod: { 
            type: String, 
            enum: ["cash_on_delivery", "paypal", "credit_card"], 
            required: true, 
            default: "cash_on_delivery" 
        },
        shippingMethod: { 
            type: String, 
            enum: ["Free shipping", "Flat rate", "Local pickup"], 
            required: true, 
            default: "free_shipping" 
        },
        shippingFee:{ type: Number, required: true },
        totalAmount: { type: Number, required: true },
        totalOrderValue: { type: Number, required: true },
        cancelledAt: { type: Date },
        status: { 
            type: String, 
            enum: ["pending", "shipping", "completed", "cancelled", "returned"], 
            default: "pending" 
        },
    },
    { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
