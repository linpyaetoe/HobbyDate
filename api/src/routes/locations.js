import express from 'express';
import { getLocationSuggestions } from '../services/location.js';

const router = express.Router();

// Endpoint to search for locations
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim().length < 3) {
      return res.status(400).json({ 
        error: 'Search query must be at least 3 characters' 
      });
    }
    
    console.log(`Location search request received for: ${query}`);
    
    const suggestions = await getLocationSuggestions(query);
    return res.json(suggestions);
  } catch (error) {
    console.error('Location search error:', error);
    return res.status(500).json({ 
      error: 'Failed to search for locations' 
    });
  }
});

export default router; 