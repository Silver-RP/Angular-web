import mongoose, { Schema, Document } from "mongoose";

export interface IVoucher extends Document {
  code: string;
  discountValue: number;
  startDate: Date;
  endDate: Date;
  limit: number;
  description: string;
  minOrderValue: number;
  maxOrderValue: number; 
  type: string;
  amount: number;
}

const VoucherSchema: Schema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    discountValue: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    limit: { type: Number, default: 0 }, 
    description: { type: String, required: false },
    minOrderValue: { type: Number, default: 0 },
    maxOrderValue: { type: Number, default: Infinity },
    type: { type: String, enum: ["percentage", "fixed"], required: true }, 
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IVoucher>('Voucher', VoucherSchema);
