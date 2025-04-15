import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Example token (replace with your actual token from browser cookies)
const token = "your-actual-token-here";

try {
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
  console.log('Trying to verify token...');
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('Token is valid!');
  console.log('Decoded token data:', decoded);
} catch (error) {
  console.error('Token verification failed:', error.message);
} 