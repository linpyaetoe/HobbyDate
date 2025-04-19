import axios from 'axios';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Free Nominatim geocoding API (OpenStreetMap)
// Note: This is a free service with usage limits. For production,
// you should respect their usage policy: https://operations.osmfoundation.org/policies/nominatim/
const BASE_URL = 'https://nominatim.openstreetmap.org/search';

/**
 * Get location suggestions based on user input
 * @param {string} query - User input for location search
 * @returns {Array} - List of location suggestions
 */
export const getLocationSuggestions = async (query) => {
  try {
    if (!query || query.trim().length < 3) {
      return [];
    }

    console.log(`Searching locations for: ${query}`);

    const response = await axios.get(BASE_URL, {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
        limit: 5
      },
      headers: {
        'User-Agent': 'HobbyDate App (educational project)'
      }
    });

    if (!response.data || !Array.isArray(response.data)) {
      return [];
    }

    // Format the results to provide simple location strings
    return response.data.map(item => {
      // Construct a simplified, readable location string
      return {
        id: item.place_id,
        display_name: item.display_name,
        // Simple format for user selection
        formatted_location: item.display_name
      };
    });
  } catch (error) {
    console.error('Location search error:', error);
    return [];
  }
}; 