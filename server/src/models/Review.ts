import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
    productId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
  }
  
  const ReviewSchema: Schema = new Schema(
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String },
    },
    { timestamps: true }
  );
  
  export default mongoose.model<IReview>('Review', ReviewSchema);
  