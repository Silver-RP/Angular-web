import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlist extends Document {
    userId: mongoose.Types.ObjectId;
    productIds: mongoose.Types.ObjectId[];
  }
  
  const WishlistSchema: Schema = new Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      productIds: [{ type: Schema.Types.ObjectId, ref: 'Product', required: true }],
    },
    { timestamps: true }
  );
  
  export default mongoose.model<IWishlist>('Wishlist', WishlistSchema);
  