import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get router - GET current user's profile (accessible at /users/profile)
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Profile retrieval - User ID:', userId);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        location: true,
        about: true,
        hobbies: true
        // Do not include password
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const parsedUser = {
      ...user,
      hobbies: user.hobbies ? JSON.parse(user.hobbies) : []
    };
    
    res.json(parsedUser);
  } catch (error) {
    console.error('Profile retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve profile: ' + error.message });
  }
});

// GET profile by user ID (accessible at /users/:id) - for public profiles
router.get('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // Handle invalid or missing ID
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        location: true,
        // Don't include email and password for privacy
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Sending public user profile:', user);
    res.json(user);
  } catch (error) {
    console.error('Public profile retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve profile: ' + error.message });
  }
});

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
        location: location,
        location,
        about,
        hobbies: Array.isArray(hobbies) ? JSON.stringify(hobbies) : hobbies
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