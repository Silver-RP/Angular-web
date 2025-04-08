import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
const MONGODB_URI = 'mongodb://localhost:27017/node-assignment';

async function updateUserAvatars() {
  try {
    const defaultAvatar = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
    
    const updatedUsers = await User.updateMany(
      { avatar: { $exists: false } },  
      { $set: { avatar: defaultAvatar } }  
    );
    
    console.log(`Updated users with avatars.`);
  } catch (error) {
    console.error('Error updating avatars:', error);
  }
}

// Call the function
updateUserAvatars();


mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    updateUserAvatars()
        .then(users => {
            console.log('Sample product names:');
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