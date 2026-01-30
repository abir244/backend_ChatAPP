import User from '../models/userModel.js';
import bcrypt from 'bcrypt';

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt for:', email);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('✅ Login successful for:', user.username);

    // Return user without password
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    };

    res.json({ 
      message: 'Login successful',
      user: userResponse
    });
  } catch (err) {
    console.error('💥 Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// REGISTER - FIXED VERSION
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    console.log('📝 Registration attempt:', { username, email });
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    // Check if user exists (email OR username)
    const existingUser = await User.findOne({ 
      $or: [{ email: email.toLowerCase() }, { username }] 
    });
    
    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'email' : 'username';
      console.log(`❌ User already exists with this ${field}:`, email);
      return res.status(400).json({ 
        message: `User already exists with this ${field}` 
      });
    }

    // Hash password
    console.log('🔒 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user with hashed password
    console.log('👤 Creating user...');
    const newUser = new User({ 
      username, 
      email: email.toLowerCase(), 
      password: hashedPassword 
    });
    
    // Save user
    await newUser.save();
    
    console.log('✅ User created successfully:', newUser._id);

    // Return user without password
    const userResponse = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt
    };

    res.status(201).json({ 
      message: 'User registered successfully',
      user: userResponse
    });
  } catch (err) {
    console.error('💥 Registration error:', err);
    console.error('Error details:', err.message);
    
    // Handle duplicate key error (in case race condition)
    if (err.code === 11000) {
      const field = err.keyPattern.email ? 'email' : 'username';
      return res.status(400).json({ 
        message: `User already exists with this ${field}` 
      });
    }
    
    res.status(500).json({ 
      message: 'Server error during registration',
      error: err.message 
    });
  }
};
