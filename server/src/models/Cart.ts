import mongoose, { Schema, Document } from 'mongoose';

    export interface ICart extends Document {
    userId: mongoose.Types.ObjectId;
    products: { productId: mongoose.Types.ObjectId; quantity: number }[];
  }
  
  const CartSchema: Schema = new Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      products: [
        {
          productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
          quantity: { type: Number, default: 1 },
        },
      ],
    },
    { timestamps: true }
  );
  
  export default mongoose.model<ICart>('Cart', CartSchema);
  