import e, { Request, Response } from "express";

import ProductService from "../../services/ProductService";
import CategoryService from "../../services/CategoryService";
import UserService from "../../services/UserService";
import Product from "../../models/Product"; 
import { PaginateResult } from "mongoose";
import { IUser } from "../../models/User";
import crypto from 'crypto';

interface PagesVisible {
    [key: number]: boolean;
}

interface QueryParams {
    page?: string | number;
    limit?: string | number;
    sort?: string;
}


class UserController{
    async getAllUsers(req: Request<{}, {}, {}>, res: Response) {
        try {
            const { page = 1, limit = 12, sort = 'default' } = req.query;
    
            // Get all users with pagination
            const users = await UserService.getAllUsers({
                page: parseInt(page as string, 10),
                limit: limit ? parseInt(limit as string) : undefined as unknown as number, 
                sort: sort.toString()
            });
    
            const currentPage = parseInt(page as string, 10);
            const totalPages = users.totalPages;
            const pagesVisible: Record<number, boolean> = {};
    
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, startPage + 5);
    
            if (endPage - startPage < 5) {
                startPage = Math.max(1, endPage - 5);
            }
    
            for (let i = startPage; i <= endPage; i++) {
                pagesVisible[i] = true;
            }
    
            if (!users?.docs?.length) {
                throw new Error('No users found');
            }
    
            const numberIndex: number[] = users.docs.map((_, index) => index + 1);
    
            res.status(200).json({
                     users: users.docs.map((user, index) => ({
                    ...user,
                    number: numberIndex[index]
                })),
                pageNumbers: Array.from({ length: totalPages }, (_, i) => i + 1),
                currentPage,
                pagesVisible,
                hasPrevPage: users.hasPrevPage,
                hasNextPage: users.hasNextPage,
                prevPage: users.prevPage,
                nextPage: users.nextPage,
                totalPages,
                currentSort: req.query.sort || 'default'
            });
        } catch (error) {
            console.error('Error in getAllUsers:', error);
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            });
        }
    }

    async addUser(req: Request, res: Response) {
        try {
            const { name, email, phone, role = 'user' } = req.body;
    
            console.log(req.body);  
    
            if (!name || !email || !phone) {
                res.status(400).json({ success: false, message: 'Name, email, and phone are required' });
                return ;
            }
    
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                res.status(400).json({ success: false, message: 'Invalid email format' });
                return ;
            }
    
            const userCheck = await UserService.getUserByEmail(email);
            if (userCheck) {
                res.status(400).json({ success: false, message: 'Email already exists' });
                return ;
            }
    
            // Validate phone number
            const phonePattern = /^\d{10}$/;
            if (!phonePattern.test(phone)) {
                res.status(400).json({ success: false, message: 'Invalid phone number. It must be 10 digits.' });
                return ;
            }

            // Generate a random password if not provided
            const password = req.body.password || Math.random().toString(36).slice(-8);
            const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
            const userForSave = {
                name, 
                email,
                phone,
                password: hashedPassword,
                role
            }

            const user = await UserService.addUser(userForSave);
            if (!user) {
                res.status(500).json({ success: false, message: 'Failed to add user, please try again' });
                return ;
            }
    
            res.status(200).json({ success: true, message: 'User added successfully.' });
            return ;
    
        } catch (error) {
            console.error('Error during user addition:', error);
            res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
            return ;
        }
    }

    async getUserById(req: Request<{ id: string }, {}, {}>, res: Response) {
        try {
            const { id } = req.params;
    
            const user = await UserService.getUserById(id);
    
            if (!user) {
                throw new Error('User not found');
            }
    
            res.status(200).json(user);
        } catch (error) {
            console.error('Error in getUserById:', error);
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            });
        }
    }

    async updateUser(req: Request<{ id: string }, {}, IUser>, res: Response) {
        try {
            const { id } = req.params;
            const { name, email, phone,  role } = req.body;
    
            if (!name || !email || !phone || !role) {
                throw new Error('Name, email, password and role are required');
            }
    
            const user = await UserService.updateUser(id, {
                name,
                email,
                phone,
                role
            });
    
            res.status(200).json({
                message: 'User updated successfully',
                user
            });
        } catch (error) {
            console.error('Error in updateUser:', error);
            res.status(500).json({
                message: error instanceof Error ? error.message : 'Internal server error'
            });
        }
    }

    async toggleBlockUser(req: Request<{ id: string }, {}, {}>, res: Response) {
        try {
            const { id } = req.params;
            const updatedUser = await UserService.toggleBlockUser(id);
    
            res.status(200).json({
                message: updatedUser.blocked 
                    ? "User blocked successfully" 
                    : "User unblocked successfully",
                user: updatedUser
            });
        } catch (error) {
            console.error("Error in toggleBlockUser:", error);
            res.status(500).json({
                message: error instanceof Error ? error.message : "Internal server error"
            });
        }
    }
    
    
    
}

export default new UserController();