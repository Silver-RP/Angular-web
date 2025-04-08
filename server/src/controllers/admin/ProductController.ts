import { Request, Response } from "express";
import ProductService from "../../services/ProductService";
import CategoryService from "../../services/CategoryService";
import { IProduct } from '../../models/Product';



interface PagesVisible {
    [key: number]: boolean;
}

interface QueryParams {
    page?: string | number;
    limit?: string | number;
    sort?: string;
}


class ProductController {

    async getAllProducts(req: Request<{}, {}, {}, QueryParams>, res: Response) {
        try {
            const { page = 1, limit = 12, sort = 'default' } = req.query;

            const products = await ProductService.getAllProducts({
                page: parseInt(page as string),
                limit: limit ? parseInt(limit as string) : undefined as unknown as number,
                sort
            });
            const categories = await CategoryService.getAllCategories();

            const currentPage = parseInt(page as string, 12);
            const totalPages = products.totalPages;
            const pagesVisible: Record<number, boolean> = {};

            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, startPage + 5);

            if (endPage - startPage < 5) {
                startPage = Math.max(1, endPage - 5);
            }

            for (let i = startPage; i <= endPage; i++) {
                pagesVisible[i] = true;
            }

            const productWithCateName = products.docs.map((product, index) => {
                const cate = categories?.find(cate => cate._id.toString() === product.cateId.toString()) ?? null;
                return { ...product, cateName: cate?.name, number: index + 1 };
            });

            const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

            res.render('admin/products', {
                layout: 'admin',
                title: 'Admin Products Page',
                products: productWithCateName,
                categories,
                pageNumbers,
                currentPage,
                pagesVisible,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                totalPages,
                currentSort: req.query.sort || 'default',
            });


        } catch (error) {
            console.error('Error in ProductController.getAllProducts:', error);
            res.status(500).json({ message: 'Error in ProductController.getAllProducts' });
        }
    }

    async createProduct(req: Request, res: Response) {
        try {
            const productData: IProduct = req.body;
            let images: string[] = [];

            if (req.files) {
                const uploadedFiles = req.files as Express.Multer.File[];

                uploadedFiles.forEach((file, index) => {
                    images.push(file.filename);
                });
            }

            productData.images = images;

            const product = await ProductService.addProduct(productData);
            res.status(201).json(product);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error in ProductController.createProduct' });
        }
    }

    async editProduct(req: Request, res: Response): Promise<void> {
        try {
            const productId = req.params.id;
            const productData: IProduct = req.body;

            // Fetch existing product
            const existingProduct = await ProductService.getProductById(productId);
            if (!existingProduct) {
                res.status(404).json({ message: "Product not found" });
                return;
            }

            let images: string[] = existingProduct.images || [];

            if (req.files && (req.files as Express.Multer.File[]).length > 0) {
                const uploadedFiles = req.files as Express.Multer.File[];
                images = uploadedFiles.map((file) => file.filename);
            } else if (req.body.oldImages) {
                images = Array.isArray(req.body.oldImages) ? req.body.oldImages : [req.body.oldImages];
            }

            productData.images = images;

            productData.oldImages = images;

            const updatedProduct = await ProductService.updateProduct(productId, productData);

            res.status(200).json({ success: true, message: "Upload OK.", updatedProduct });
        } catch (error) {
            console.error("Error updating product:", error);
            res.status(500).json({ message: "Error in ProductController.editProduct" });
        }
    }

    async deleteProduct(req: Request, res: Response) {
        try {
            const productId = req.params.id;

            const productInOrder = await ProductService.getOrderByProductId(productId) as { orders?: any[] };
            if (productInOrder?.orders && productInOrder.orders.length > 0) {
                res.status(400).json({ success: false, message: "Product is in an order and cannot be deleted." });
                return;
            }
            // Proceed with deletion
            const deletedProduct = await ProductService.deleteProduct(productId);
            if (!deletedProduct) {
                res.status(404).json({ success: false, message: "Product not found." });
                return;
            }

            res.json({ success: true, message: "Product deleted successfully." });
        } catch (error) {
            console.error("Error deleting product:", error);
            res.status(500).json({ success: false, message: "Error in ProductController.deleteProduct" });
        }
    }









    //   async updateProduct(req: Request, res: Response) {
    //     const product = await ProductService.updateProduct(req.params.id, req.body);
    //     res.json(product);
    //   }

    //   async deleteProduct(req: Request, res: Response) {
    //     const product = await ProductService.deleteProduct(req.params.id);
    //     res.json(product);
    //   }
}

export default new ProductController();