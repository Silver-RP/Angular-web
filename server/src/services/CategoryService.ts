import Category from "../models/Category";

class CategoryService {
    async getAllCategories() {
        try {
            return await Category.find().lean();
        } catch (error) {
            console.error('Error in CategoryService.getAllCategories:', error);
        }
    }

    async createCategory(category: any) {
        try {
            return await Category.create(category); 
        } catch (error) {
            console.error('Error in CategoryService.createCategory:', error);
            throw new Error('Failed to create category');
        }
    }

    async getCategoryById(id: string) {
        try {
            return await Category.findById(id).lean();
        } catch (error) {
            console.error('Error in CategoryService.getCategoryById:', error);
        }
    }

    async updateCategory(id: string, category: any) {
        try {
            return await Category.findByIdAndUpdate(id, category, { new: true });
        } catch (error) {
            console.error('Error in CategoryService.updateCategory:', error);
            throw new Error('Failed to update category');
        }
    }

    async deleteCategory(id: string) {
        try {
            return await Category.findByIdAndDelete(id);
        } catch (error) {
            console.error('Error in CategoryService.deleteCategory:', error);
            throw new Error('Failed to delete category');
        }
    }
    
}


export default new CategoryService();