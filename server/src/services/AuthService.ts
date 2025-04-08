import User from '../models/User';

class AuthService {
    async login(email: string, password: string) {
        return await User.findOne({'email': email, 'password': password}).lean();
    }

    async register(name: string, email: string, password: string, phone: string) {
        const user = new User({
            name,
            email,
            password,
            phone
        });

        return await user.save();
    }

    async getUserByEmail(email: string) {
        return await User.findOne({'email': email}).lean();
    }

    async saveVerifyToken(email: string, token: string) {
        const result = await User.updateOne(
            { email },
            {
                $set: {
                    verifyEmail: false,
                    verifyToken: token,
                },
            }
        )
        if (result.modifiedCount === 0) {
            throw new Error("Failed to save verify token. User not found.");
        }
        return result;
    }

    async getUserByVerifyToken(token: string) {
        return await User.findOne({
            verifyToken: token,
            verifyEmail: false,
        }).lean();
    }

    async verifyEmail(email: string) {
        const result = await User.updateOne
        (
            { email },
            {
                $set: {
                    verifyEmail: true,
                    verifyToken: null,
                },
            }
        );
        if (result.modifiedCount === 0) {
            throw new Error("Failed to verify email. User not found.");
        }
        return result;
    }

    async saveResetToken(email: string, token: string) {
        const result = await User.updateOne(
            { email },
            {
                $set: {
                    resetToken: token,
                    resetTokenExpires: new Date(Date.now() + 15 * 60 * 1000), 
                },
            }
        );
    
        if (result.modifiedCount === 0) {
            throw new Error("Failed to save reset token. User not found.");
        }
        return result;
    }

    async getUserByResetToken(token: string) {
        return await User.findOne({
            resetToken: token,
            resetTokenExpires: { $gt: new Date() },
        }).lean();
    }

    async resetPassword(email: string, password: string) {
        const result = await User.updateOne(
            { email },
            {
                $set: {
                    password,
                    resetToken: null,
                    resetTokenExpires: null,
                },
            }
        );
    
        if (result.modifiedCount === 0) {
            throw new Error("Failed to reset password. User not found.");
        }
        return result;
    }
    
}

export default new AuthService();