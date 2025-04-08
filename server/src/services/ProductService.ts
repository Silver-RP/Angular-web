import Product, {IProduct} from '../models/Product';
import Category from '../models/Category';
import Order from '../models/Order';
import { resolve } from 'path';

class ProductService {

    async getAllProducts({ page, limit, sort }: { page: number; limit: number; sort: string }) {
        const sortQuery = this.getSortQuery(sort);
    
        const options = {
            page: parseInt(page as unknown as string, 10),
            limit: parseInt(limit as unknown as string, 10),
            sort: sortQuery,
            lean: true
        };
    
        return await Product.paginate({}, options);
    }
    
    private getSortQuery(sort: string) {
        switch (sort) {
            case 'featured':
                return { featured: -1 }; 
            case 'name_asc':
                return { name: 1 }; 
            case 'name_desc':
                return { name: -1 }; 
            case 'price_asc':
                return { salePrice: 1 }; 
            case 'price_desc':
                return { salePrice: -1 }; 
            default:
                return {}; 
        }
    }
    
    async getProductById(id: string) {
        return await Product.findById(id).lean();
    }

    async getProductsHotDeals() {
        return await Product.find({hot: true}).limit(8).lean();
    }

    async getProductsByFeatured() {
        return await Product.find({featured: true}).lean();
    }

    async getProductsByCateId(cateId: string){
        return await Product.find({cateId}).lean();
    }

    async sortProducts(sort: string) {
        let sortQuery;
    
        switch (sort) {
            case '1': 
                sortQuery = { featured: -1 }; 
                break;
            case '2':
                sortQuery = { name: 1 };  
                break;
            case '3': 
                sortQuery = { name: -1 };  
                break;
            case '4':
                sortQuery = { price: 1 };  
                break;
            case '5': 
                sortQuery = { price: -1 }; 
                break;
            default:
                sortQuery = {}; 
                break;
        }
    
        return await Product.find({}).sort(sortQuery as string).lean();
    }

    static async countProductsByCategory(categoryId: string): Promise<number> {
        try {
            if (!categoryId) {
                throw new Error('Category ID is required');
            }
            const productCount = await Product.countDocuments({ cateId: categoryId });
            return productCount;
        } catch (error) {
            console.error('Error counting products for category:', categoryId, error);
            throw new Error('Error counting products');
        }
    }

    async addProduct(product: IProduct) {
        return await Product.create(product as any); 
    }

    async updateProduct(id: string, product: IProduct) {
        const updateData = {
            ...product,
            featured: product.featured === "1", 
            hot: product.hot === "1", 
        };
        const flattenedImages = Array.isArray(updateData.oldImages)
            ? updateData.oldImages.flat()
            : [];
            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                { 
                    $set: { 
                        ...updateData, 
                        images: flattenedImages 
                    } 
                }, 
                { new: true, runValidators: true }
            );
        return updatedProduct;
    }

    async getOrderByProductId(productId: string) {
        return await Product.findById(productId).populate('orders', '_id').lean();
    }

    async deleteProduct(id: string) {
        const product = await Product.findByIdAndDelete(id);
        return product ? { success: true, message: "Product deleted" } : null;
    }

    async getProductsBySearch(search: string) {
        if (!search) return [];
    
        const products = await Product.find({
            name: { $regex: search, $options: "i" } 
        }).lean();
    
        return products;
    }
    
    
    
    




}


export default new ProductService();