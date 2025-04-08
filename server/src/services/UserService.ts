import User from '../models/User';
import Order from "../models/Order";

class UserService{


    async getAllUsers({ page, limit, sort }: { page: number; limit: number; sort: string }) {
        const sortQuery = this.getSortQuery(sort);
    
        const options = {
            page: parseInt(page as unknown as string, 10),
            limit: parseInt(limit as unknown as string, 10),
            sort: sortQuery,
            lean: true
        };

        
        return await User.paginate({}, options);
    }

    private getSortQuery(sort: string) {
        switch (sort) {
            case 'date_asc':
                return { createdAt: -1 }; 
            case 'date_desc':
                return { createdAt: 1 };
            case 'name_asc':
                return { name: 1 }; 
            case 'name_desc':
                return { name: -1 }; 
            case 'email_asc':
                return { email: 1 }; 
            case 'email_desc':
                return { email: -1 }; 
            default:
                return {}; 
        }
    }

    async addUser(user: any) {
        return await  User.create(user);
    }

    async getUserById(id: string) {
        return await User.findById(id).lean();
    }

    async getUserByEmail(email: string) {
        return await User.findOne({ email}).lean();
    }

    async updateUser(id: string, user: any) {
        return await User.findByIdAndUpdate (id, user, { new: true });
    }

    async toggleBlockUser(id: string) {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        user.blocked = !user.blocked;
        return await user.save();
    }

    async changePassword(id: string, password: string) {
        return await User.findByIdAndUpdate(id, { password }, { new: true });
    }
    
    async changeUserInfo(id: string, name?: string, phone?: string) {
        const updateData: { name?: string; phone?: string } = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
    
        return await User.findByIdAndUpdate(id, updateData, { new: true });
    }

    
}

export default new UserService();