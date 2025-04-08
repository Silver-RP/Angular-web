import mongoose, { Schema, Document, model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  image?: string;
}

const CategorySchema: Schema = new Schema(
    {
        name: { type: String, required: true , unique: true},
        slug: { type: String, required: true, unique: true },
        image: { type: String, required: true },
    },
    {
        timestamps: true
    }
)

export default mongoose.model<ICategory>("Category", CategorySchema);