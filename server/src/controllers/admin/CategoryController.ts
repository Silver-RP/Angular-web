import e, { Request, Response } from "express";

import ProductService from "../../services/ProductService";
import CategoryService from "../../services/CategoryService";
import Product from "../../models/Product"; 
import Category from "../../models/Category";


interface Category {
    _id: string;
    name: string;
}

interface CategoryWithCount extends Category {
    number: number;
    productCount: number;
}

class CategoryController {
    async getAllCategories(req: Request, res: Response) {
        try {
            const categories = await CategoryService.getAllCategories() as unknown as Category[];

            if (!categories?.length) {
                throw new Error('No categories found');
            }
    
            const categoriesWithCount = await Promise.all(
                categories.map(async (category, index) => {
                    const productCount = await Product.countDocuments({ cateId: category._id });
                    
                    return { 
                        ...category, 
                        number: index + 1, 
                        productCount 
                    }; 
                })
            );
    
            // res.render('admin/categories', {
            //     layout: 'admin',
            //     title: 'Admin Categories Page',
            //     categories: categoriesWithCount,
            // });

            res.status(200).json({success: true, messgase: "Get Categories susscessfully", categories: categoriesWithCount });
        } catch (error) {
            console.error('Error in getAllCategories:', error);
            res.status(500).json({ 
                message: error instanceof Error ? error.message : 'Internal server error' 
            });
        }
    }

    async createCategory(req: Request, res: Response): Promise<void> {
        try {
            const { name, slug } = req.body;
    
            if (!name || !slug) {
                res.status(400).json({ message: 'Category name and slug are required.' });
                return; 
            }
    
            const existingCategory = await Category.findOne({ name });
            if (existingCategory) {
                res.status(400).json({ message: `Category with name "${name}" already exists.` });
                return; 
            }
    
            const existingSlugCategory = await Category.findOne({ slug });
            if (existingSlugCategory) {
                res.status(400).json({ message: `Category with slug "${slug}" already exists.` });
                return; 
            }
    
            const imageFile = (req.files as unknown as Express.Multer.File[])[0];
            if (!imageFile) {
                res.status(400).json({ message: 'Image file is required.' });
                return; 
            }
    
            const imageName = imageFile.filename;
            const category = {
                name,
                slug,
                image: imageName
            };
    
            const saveCate = await CategoryService.createCategory(category);
    
            res.status(200).json({
                success: true,
                message: "Category created successfully.",
                saveCate
            });
        } catch (error) {
            console.error('Error in createCategory:', error);
            if (error instanceof Error) {
                res.status(500).json({
                    message: error.message
                });
                return; 
            }
    
            res.status(500).json({
                message: 'Internal server error'
            });
        }
    }
    
    async getCategoryById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const category = await CategoryService.getCategoryById(id);
            if (!category) {
                throw new Error('Category not found');
            }

            res.status(200).json({ success: true, message: "Get Category by Id successfully", category });
        } catch (error) {
            console.error('Error in getCategoryById:', error);
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            });
        }
    }

    async editCategory(req: Request, res: Response) {
        try {
            const { id } = req.params; 
            const { name, slug } = req.body;
    
            if (!name || !slug) {
                throw new Error('Category name and slug are required');
            }
            const existingCategory = await Category.findOne({ name });
            if (existingCategory) {
                res.status(400).json({ message: `Category with name "${name}" already exists.` });
                return; 
            }
    
            const imageFile = (req.files as unknown as Express.Multer.File[])[0];
            const imageName = imageFile ? imageFile.filename : null;
    
            const category = {
                name,
                slug,
                ...(imageName && { image: imageName }) 
            };
    
            const saveCate = await CategoryService.updateCategory(id, category);
            
            res.status(200).json({
                success: true,
                message: "Update Category successfully",
                saveCate
            });
        } catch (error) {
            console.error('Error in editCategory:', error);
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            });
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

    async deleteCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            console.log("Deleting Category with ID:", id); 
    
            if (!id) {
               res.status(400).json({ message: "Category ID is required" });
               return ;
            }
    
            const category = await CategoryService.getCategoryById(id);
            console.log("Category found before delete:", category); 
    
            if (!category) {
                throw new Error("Category not found");
            }
    
            const checkCategory = await Product.findOne({ cateId: id });
            if (checkCategory) {
                throw new Error("Category has products, cannot delete");
            }
    
            await CategoryService.deleteCategory(id);
    
            res.status(200).json({ success: true, message: "Delete Category successfully" });
        } catch (error) {
            console.error("Error in deleteCategory:", error);
            res.status(500).json({
                message: error instanceof Error ? error.message : "Internal server error",
            });
        }
    }
    
    
    
}

export default new CategoryController();