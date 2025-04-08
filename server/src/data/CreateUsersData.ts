import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const MONGODB_URI = 'mongodb://localhost:27017/node-assignment';

function generateUserName(): string {
    const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Eve', 'Charlie', 'David', 'Emily', 'Frank', 'Grace'];
    const lastNames = ['Smith', 'Doe', 'Johnson', 'Brown', 'White', 'Black', 'Green', 'Jones', 'Taylor', 'Clark'];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return `${firstName} ${lastName}`;
}

function generateUserEmail(name: string): string {
    const emailProviders = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'aol.com', 'protonmail.com', 'zoho.com', 'mail.com', 'yandex.com'];

    const emailProvider = emailProviders[Math.floor(Math.random() * emailProviders.length)];

    return `${name.replace(' ', '.').toLowerCase()}@${emailProvider}`;
}

function generateDafaaultPassword(): string {
    return 'password123';
}

function generatePhoneNumber(): string {
    const phoneNumbers = ['0912334324', '0912334325', '0912334326', '0912334327', '0912334328', '0912334329', '0912334330', '0912334331', '0912334332', '0912334333'];
    return phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
}

function generateRole(): string {
    const roles = ['user', 'admin'];
    return roles[Math.floor(Math.random() * roles.length)];
}

async function createUsers(): Promise<any> {
    const users = [];
    for (let i = 0; i < 10; i++) {
        const name = generateUserName();
        const email = generateUserEmail(name);
        const password = generateDafaaultPassword();
        const phone = generatePhoneNumber();
        const avatar = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
        const role = generateRole();

        const user = new User({
            name,
            email,
            password,
            phone,
            avatar,
            role
        });

        // const user = new User({
    //     name: 'admin',
    //     email: 'admin@gmail.com',
    //     password: 'password123',
    //     phone: '0912334324',
    //     role: 'admin'
    // });
    
        users.push(user);
        await user.save();
    }

    return users;
}








mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    createUsers()
        .then(users => {
            console.log(`Created ${users?.length || 0} users`);
            console.log('Sample product names:');
            users?.slice(0, 5).forEach((user: typeof User) => { 
                console.log(`- ${user.name}`);
            });
        })
        .catch(err => {
            console.error('Failed to create users:', err);
            process.exit(1);
        });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });