import mongoose, { Schema, Document, Model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import Category from './Category';
import { ObjectId } from 'mongodb';

export interface IProduct extends Document {
    _id: ObjectId;
    name: string;
    cateId: Schema.Types.ObjectId;
    price: number;
    salePrice: number;
    quantity: number;
    saledQuantity: number;
    SKU: string;
    images: string[];
    oldImages: string[];
    shortDescription: string;
    description: string;
    featured: boolean | string;
    hot: boolean | string;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
    {
        name: { 
            type: String, 
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [100, 'Name cannot be more than 100 characters']
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be less than 0']
        },
        salePrice: {
            type: Number,
            min: [0, 'Sale price cannot be less than 0'],
            // validate: {
            //     validator: function(value: number) {
            //         return value <= (this as unknown as IProduct).price;
            //     },
            //     message: 'Sale price must be less than or equal to the original price'
            // }
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [0, 'Quantity cannot be less than 0']
        },
        saledQuantity: {
            type: Number,
            default: 0
        },
        SKU: {
            type: String,
            required: [true, 'SKU is required'],
            unique: true,
            maxlength: [6, 'SKU cannot be more than 6 characters']
        },
        images: { 
            type: [String], 
            validate: [(val: string[]) => val.length <= 4, 'Max 4 images allowed'] 
        },
        cateId: { 
            type: Schema.Types.ObjectId, 
            ref: 'Category', 
            required: [true, 'Category ID is required'],
            index: true
        },
        shortDescription: { 
            type: String,
            trim: true,
            maxlength: [200, 'Short description cannot be more than 200 characters']
        },
        description: { 
            type: String,
            trim: true
        },
        featured: { 
            type: Boolean, 
            default: false,
            index: true
        },
        hot: { 
            type: Boolean, 
            default: false,
            index: true
        },
        orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

ProductSchema.index({ name: 1 });
ProductSchema.index({ createdAt: -1 });

ProductSchema.virtual('category', {
    ref: 'Category',
    localField: 'cateId',
    foreignField: '_id',
    justOne: true
});

ProductSchema.methods.updateHotStatus = function(status: boolean): Promise<IProduct> {
    this.hot = status;
    return this.save();
};

ProductSchema.plugin(mongoosePaginate);
export type ProductDocument = mongoose.PaginateModel<IProduct>;

const Product = mongoose.model<IProduct, ProductDocument>('Product', ProductSchema);
export default Product;