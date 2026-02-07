import User from '../models/userModel.js';
import bcrypt from 'bcrypt';

// Register a new user
export const registerUser = async (username, email, password) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('Email already registered');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    const savedUser = await user.save();

    // Return user without password
    const { password: _, ...userData } = savedUser.toObject();
    return userData;
};

// Login a user
export const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Invalid password');

    // Return user without password
    const { password: _, ...userData } = user.toObject();
    return userData;
};
