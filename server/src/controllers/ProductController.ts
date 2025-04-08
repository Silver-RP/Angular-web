import { Request, Response } from "express";
import ProductService from "../services/ProductService";
import CategoryService from "../services/CategoryService";

interface QueryParams {
    page?: string | number;
    limit?: string | number;
    sort?: string;
}

class ProductController {

    async getAllProducts(req: Request<{}, {}, {}, QueryParams>, res: Response) {
        try {
            const { page = 1, limit = 12, sort = 'default' } = req.query;

            // Fetch sorted and paginated products
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

            const productWithCateName = products.docs.map(product => {
                const cate = categories?.find(cate => cate._id.toString() === product.cateId.toString()) ?? null;
                return { ...product, cateName: cate?.name };
            });

            const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

            // res.render('app/shop', {
            //     layout: 'app',
            //     title: 'Shop Page',
            //     products: productWithCateName,
            //     categories,
            //     pageNumbers,
            //     currentPage,
            //     pagesVisible,
            //     hasPrevPage: products.hasPrevPage,
            //     hasNextPage: products.hasNextPage,
            //     prevPage: products.prevPage,
            //     nextPage: products.nextPage,
            //     totalPages,
            //     currentSort: req.query.sort || 'default',
            // });

            res.status(200).json({
                products: productWithCateName,
                currentPage,
                totalPages,
                categories,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                currentSort: req.query.sort || 'default',
            });
        } catch (error) {
            console.error('Error in ProductController.getAllProducts:', error);
            res.status(500).json({ message: 'Error in ProductController.getAllProducts' });
        }
    }

    async getHomeProducts(req: Request, res: Response) {
        try {
            const categories = await CategoryService.getAllCategories();
            const productsHot = await ProductService.getProductsHotDeals();
            const AllProductsFeatured = await ProductService.getProductsByFeatured();
            const productsFeatured = AllProductsFeatured.filter(product => product.featured === true).slice(0, 20);

            // res.render('app/home', {
            //     layout: 'app', title: 'Home Page',
            //     categories, productsHot, productsFeatured
            // });

            res.status(200).json({
                categories, productsHot, productsFeatured
            });

        } catch (error) {
            console.error('Error in ProductController.getAllProducts:', error);
        }

    }

    async getProductById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const product = await ProductService.getProductById(id);
            const categories = await CategoryService.getAllCategories();
            const productCate = product ? categories?.filter(cate => cate._id.toString() === product.cateId.toString()) : [];
            const relatedProducts = product ? await ProductService.getProductsByCateId(product.cateId.toString()) : [];

            // res.render('app/detail', {
            //     layout: 'app', title: 'Product Detail',
            //     product, productCate, relatedProducts
            // });

            res.status(200).json({
                product, productCate, relatedProducts
            });
        } catch (error) {
            console.error('Error in ProductController.getProductById:', error);
            res.status(500).json({ message: 'Error in ProductController.getProductById' });
        }
    }

    async getProductsByCateId(req: Request, res: Response) {
        const cateId = req.params.cateId;
        const categories = await CategoryService.getAllCategories();
        const productCate = categories?.find(cate => cate._id.toString() === cateId);
        const products = await ProductService.getProductsByCateId(cateId);

        // res.render('app/category-pro', {
        //     layout: 'app', title: 'Category Products',
        //     products, productCate, categories
        // });

        res.status(200).json({
            products, productCate, categories
        });
    }

    async searchProducts(req: Request, res: Response) {
        const search = req.query.search || req.query.keyword;

        if (!search || (typeof search === 'string' && search.trim() === '')) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const searchString = search.toString();
        console.log("Search keyword:", searchString);
        const products = await ProductService.getProductsBySearch(searchString);

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json({ products, search });
    }




}


export default new ProductController();