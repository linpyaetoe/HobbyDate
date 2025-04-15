import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Route at /profile (will be accessible at /users/profile when mounted with prefix)
router.put('/profile', requireAuth, async (req, res) => {
  try {
    console.log('Profile update - Request body:', req.body);
    console.log('Profile update - Auth user:', req.user);
    
    const { name, location, about, hobbies } = req.body;
    const userId = req.user.userId;

    console.log('Profile update - Extracted data:', { userId, name, location, about, hobbies: Array.isArray(hobbies) ? `Array with ${hobbies.length} items` : typeof hobbies });

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: name,
        location: location
      }
    });

    console.log('User updated successfully:', updatedUser);

    // Remove sensitive data before sending response
    const { password, ...userWithoutPassword } = updatedUser;
    
    // Return all the data including the non-stored fields
    const responseData = {
      ...userWithoutPassword,
      about,
      hobbies: Array.isArray(hobbies) ? hobbies : []
    };
    
    console.log('Sending response:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile: ' + error.message });
  }
});

// Add a test route
router.get('/test', (req, res) => {
  res.json({ message: 'Users router is working!' });
});

export default router; 