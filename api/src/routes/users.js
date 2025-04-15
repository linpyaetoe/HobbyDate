import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Update user profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { name, location, about, hobbies } = req.body;
    const userId = req.user.id;

    // Update user profile with location only (since that's what's in our schema)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: name,
        location: location
        // We'll store about and hobbies elsewhere or add them to schema later
      }
    });

    // Store the additional profile information in the user session or a cookie
    // This is a workaround until we add these fields to the schema
    req.session = req.session || {};
    req.session.profileData = {
      about,
      hobbies: JSON.stringify(hobbies)
    };

    // Remove sensitive data before sending response
    const { password, ...userWithoutPassword } = updatedUser;
    res.json({
      ...userWithoutPassword,
      about,
      hobbies
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router; 