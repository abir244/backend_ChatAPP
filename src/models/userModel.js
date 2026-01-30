import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// NO PRE-SAVE MIDDLEWARE - We'll handle hashing in controller

// Compare password method (optional - can also do in controller)
userSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = await import('bcrypt');
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
