import { Request, Response } from 'express';
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';
import bcrypt from 'bcrypt';
import 'express-session';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto, { verify } from "crypto";
import { IUser } from '../models/User';
import CartService from '../services/CartService';

declare module 'express-session' {
    interface Session {
        user?: {
            id: string;
            email: string;
            name: string;
            phone: string;
        };
    }
}

interface AuthRequest extends Request {
    user: {
        id: string;
    };
}


class AuthController {

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email and password are required' });
            }

            const user = await AuthService.getUserByEmail(email);
            const wishlist = await CartService.getWishlist(user?._id as string);

            if (!user) {
                return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ success: false, message: 'Invalid email or password' });
            }

            req.session.user = {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                phone: user.phone as string
            };

            const token = jwt.sign({ id: user._id, email: user.email, name: user.name, role: user.role }, process.env.JWT_SECRET || 'secret', {
                expiresIn: '10s'
            });

            const refreshToken = jwt.sign(
                { id: user._id, email: user.email, name: user.name, role: user.role },
                process.env.JWT_REFRESH_SECRET || 'refreshSecret',
                { expiresIn: '30m' }
            );

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                path: '/refresh-token',
                maxAge: 30 * 24 * 60 * 60 * 1000, 
            });

            res.status(200).json({
                success: true,
                message: 'User logged in successfully',
                user: req.session.user,
                token,
                wishlist
            });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again.' });
        }
    }

    async register(req: Request, res: Response) {
        const { name, email, password, password_confirmation, phone } = req.body;

        if (!name || !email || !password || !phone || !password_confirmation) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const userCheck = await AuthService.getUserByEmail(email);
        if (userCheck) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const phonePattern = /^\d{10}$/;
        if (!phonePattern.test(phone)) {
            return res.status(400).json({ success: false, message: 'Invalid phone number. It must be 10 digits.' });
        }

        if (password !== password_confirmation) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await AuthService.register(name, email, hashedPassword, phone);

            if (!user) {
                return res.status(400).json({ success: false, message: 'Failed to register user, please try again' });
            }

            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const verifyToken = crypto.randomBytes(32).toString("hex");
            await AuthService.saveVerifyToken(email, verifyToken);

            const verifyLink = `${process.env.CLIENT_ANGULAR_URL}/client/verify-email/${verifyToken}`;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Verify Your Email",
                text: `
                SILVER SHOP:
                You are receiving this email because you registered an account.
                Click the following link to verify your email: ${verifyLink}
                `,
            };

            await transporter.sendMail(mailOptions);

            return res.status(200).json({ success: true, message: 'User registered successfully. Verification email sent.' });

        } catch (error) {
            console.error('Error during registration:', error);
            return res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
        }
    }

    async verifyEmail(req: Request, res: Response) {
        try {
            const { token } = req.params;
            if (!token) {
                return res.status(400).json({ success: false, message: "Cannot find Verify Token" });
            }

            const user = await AuthService.getUserByVerifyToken(token) as IUser;
            if (!user) {
                return res.status(400).json({ success: false, message: "Invalid or expired token" });
            }
            await AuthService.verifyEmail(user.email);

            return res.status(200).json({ success: true, message: "Email verified successfully" });

        } catch (error) {
            console.error("Error verifying email:", error);
            return res.status(500).json({ success: false, message: "An error occurred while verifying email." });
        }
    }

    async logout(req: Request, res: Response) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error during logout:', err);
            }
            res.status(200).json({ success: true, message: 'User logged out successfully' });
        });
    }

    async forgotPassword(req: Request, res: Response) {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const user = await AuthService.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ success: false, message: "No user found with that email" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        await AuthService.saveResetToken(user.email, resetToken.toString());

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetLink = `${process.env.CLIENT_ANGULAR_URL}/client/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset",
            text: `
            SILVER SHOP:
            You are receiving this email because you requested a password reset.
            Click the following link to reset your password: ${resetLink}
            `,
        };

        try {
            await transporter.sendMail(mailOptions);
            return res.status(200).json({ success: true, message: "Password reset email sent successfully" });
        } catch (error) {
            console.error("Error sending reset password email:", error);
            return res.status(500).json({ success: false, message: "An unexpected error occurred. Please try again later." });
        }
    }

    async resetPassword(req: Request, res: Response) {
        const { token } = req.body;
        const { password, password_confirmation } = req.body;

        if (!token || !password || !password_confirmation) {
            return res.status(400).json({ success: false, message: "Password, and password confirmation are required" });
        }

        if (password !== password_confirmation) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
        }

        const user = await AuthService.getUserByResetToken(token) as IUser;
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        if (user.resetTokenExpires && new Date(user.resetTokenExpires) < new Date()) {
            return res.status(400).json({ success: false, message: "Token has expired" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await AuthService.resetPassword(user.email, hashedPassword);

        return res.status(200).json({ success: true, message: "Password updated successfully" });
    }

    async validateToken(req: Request, res: Response) {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ success: false, message: "Access denied" });
        }

        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            return res.status(200).json({
                success: true,
                message: "Token is valid",
                user: verified
            });
        } catch (error) {
            return res.status(400).json({ success: false, message: "Invalid token" });
        }
    }

    async changeUserInfo(req: AuthRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Access denied" });
            }

            const { name, phone, password, new_password, new_password_confirmation } = req.body;

            if (password || new_password || new_password_confirmation) {
                if (!password || !new_password || !new_password_confirmation) {
                    res.status(400).json({ success: false, message: "All password fields are required" });
                    return;
                }
                if (new_password !== new_password_confirmation) {
                    res.status(400).json({ success: false, message: "New passwords do not match" });
                    return;
                }
                if (new_password.length < 6) {
                    return res.status(400).json({ success: false, message: "New password must be at least 6 characters long" });
                }

                if (password === new_password) {
                    res.status(400).json({ success: false, message: "New password must be different from the old password" });
                    return;
                }
            }

            const user = await UserService.getUserById(userId);
            if (!user) {
                res.status(404).json({ success: false, message: "User not found" });
                return;
            }

            if (password && new_password) {
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    res.status(400).json({ success: false, message: "Invalid password" });
                    return;
                }
                const hashedPassword = await bcrypt.hash(new_password, 10);
                await UserService.changePassword(userId, hashedPassword);
            }

            if (name || phone) {
                await UserService.changeUserInfo(userId, name, phone);
            }

            return res.status(200).json({ success: true, message: "User information updated successfully" });

        } catch (error) {
            console.error("Controller - Error while changing user info:", error);
            return res.status(500).json({ success: false, message: "An unexpected error occurred. Please try again later." });
        }
    }

    async refreshToken(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies.refreshToken; 

            if (!refreshToken) {
                return res.status(400).json({ success: false, message: 'Refresh token is required' });
            }

            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refreshSecret', async (err: any, decoded: any) => {
                if (err) {
                    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
                }

                const token = jwt.sign(
                    { id: decoded.id, email: decoded.email, name: decoded.name, role: decoded.role },
                    process.env.JWT_SECRET || 'secret',
                    { expiresIn: '10s' }
                );

                res.status(200).json({ success: true, token }); 
            });
        } catch (error) {
            console.error('Error during refresh token:', error);
            res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again.' });
        }
    }


}

export default new AuthController();