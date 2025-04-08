import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product';
import Category from '../models/Category';

dotenv.config();

const MONGODB_URI = 'mongodb://localhost:27017/node-assignment';


function generateProductName(): string {
    const styles = ['Casual', 'Elegant', 'Vintage', 'Modern', 'Classic', 'Designer', 'Trendy', 'Athletic', 'Bohemian', 'Chic'];
    const clothingTypes = [
        'T-Shirt', 'Jeans', 'Dress', 'Jacket', 'Sweater', 'Blouse', 
        'Skirt', 'Pants', 'Hoodie', 'Shirt', 'Coat', 'Blazer', 'Shorts'
    ];
    const materials = ['Cotton', 'Denim', 'Silk', 'Wool', 'Linen', 'Leather', 'Polyester', 'Cashmere', 'Satin', 'Velvet'];
    
    const style = styles[Math.floor(Math.random() * styles.length)];
    const type = clothingTypes[Math.floor(Math.random() * clothingTypes.length)];
    const material = materials[Math.floor(Math.random() * materials.length)];
    
    return `${style} ${material} ${type}-${Math.random().toString(36).substring(2, 5)}`;
}

function generateProductDescription(): string {
    const descriptions = [
        'This product is made from the finest materials and is designed to last for years to come.',
        'Our products are made with the highest quality materials and are designed to be comfortable and stylish.',
        'This product is perfect for any occasion and is sure to turn heads wherever you go.',
        'Our products are designed with you in mind, so you can look and feel your best every day.',
        'This product is made with care and attention to detail, so you can be sure you are getting the best quality.',
        'Our products are made to be durable and long-lasting, so you can enjoy them for years to come.',
        "This product is sure to be a favorite in your wardrobe, with its stylish design and comfortable fit.",
        "Our products are made with the finest materials and are designed to be comfortable and stylish.",
        "This product is perfect for any occasion and is sure to turn heads wherever you go.",
        "Our products are designed with you in mind, so you can look and feel your best every day.",
        "This product is made with care and attention to detail, so you can be sure you are getting the best quality.",
        "Our products are made to be durable and long-lasting, so you can enjoy them for years to come.",
    ];

    return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function generateProductShortDescription(): string {
    const descriptions = [
        'Stylish and comfortable',
        'Perfect for any occasion',
        'Made with the finest materials',
        'Designed with you in mind',
        'Durable and long-lasting',
        'Sure to turn heads',
        'A favorite in your wardrobe',
    ];

    return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function generateImageName(): string[] {
    const imageNames = [
        'product_0.jpg', 'product-0-2.jpg', 
        'product-1-1.jpg', 'product-1-2.jpg', 
        'product-2-1.jpg', 'product-2-2.jpg',
        'product-3-1.jpg', 'product-3-2.jpg', 
        'product-4.jpg', 
        'product-5.jpg', 
        'product-6.jpg', 
        'product-7.jpg',
        'product-8.jpg', 
        'product-9.jpg', 
        'product-10.jpg', 
        'product-11.jpg', 
        'product_0.jpg', 'product_0-1.jpg', 'product_0-2.jpg', 'product_0-3.jpg',
        'product_1.jpg', 'product_1-1.jpg', 
        'product_2.jpg', 'product_2-1.jpg', 
        'product_3.jpg', 'product_3-1.jpg',
        'product_4.jpg', 'product_4-1.jpg',
        'product_5.jpg', 'product_5-1.jpg',
        'product_6.jpg', 'product_6-1.jpg',
        'product_7.jpg', 'product_7-1.jpg',
        'product_8.jpg', 'product_8-1.jpg',
        'product_9.jpg', 'product_9-1.jpg',
        'product_10.jpg', 'product_10-1.jpg'
    ];

    const randomIndex = Math.floor(Math.random() * imageNames.length);
    return [imageNames[randomIndex]];

}

async function createProducts() {
    try {
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database not connected');
        }

        const categories = await Category.find({}).select('_id');

        if (!categories.length) {
            throw new Error('No categories found');
        }

        const products = categories.flatMap(category => 
            Array.from({ length: 5 }, () => ({
                name: generateProductName(),
                cateId: category._id,
                price: Math.floor(Math.random() * 10) + 50,
                salePrice: Math.floor(Math.random() * 8) + 30,
                quantity: Math.floor(Math.random() * 100) + 10,
                saledQuantity: Math.floor(Math.random() * 5),
                SKU: Math.random().toString(36).substring(2, 8),
                images: Array.from({ length: 4 }, generateImageName),
                shortDescription: generateProductShortDescription(),
                description: generateProductDescription(),
                featured: Math.random() > 0.4, 
                hot: Math.random() > 0.3, 
            }))
        );

        const result = await Product.insertMany(products, { 
            ordered: false,
            lean: true 
        });

        console.log(`Successfully created ${result.length} products`);
        return result;
    } catch (err) {
        console.error('Error creating products:', err);
        throw err;
    }
}

createProducts().catch(err => console.error(err));



mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    createProducts()
        .then(products => {
            console.log(`Created ${products?.length || 0} products`);
            console.log('Sample product names:');
            products?.slice(0, 5).forEach(product => {
                console.log(`- ${product.name}`);
            });
        })
        .catch(err => {
            console.error('Failed to create products:', err);
            process.exit(1);
        });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });