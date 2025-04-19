import { useState, useEffect, useRef } from 'react';
import api from '../security/fetchWithAuth';
import '../styles/locationInput.css';

const LocationInput = ({ value, onChange, placeholder }) => {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current !== event.target
      ) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Fetch location suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }
      
      setLoading(true);
      try {
        const response = await api.get(`/locations/search?query=${encodeURIComponent(query)}`);
        setSuggestions(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce the API call
    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    // Also update the parent component's state
    onChange(value);
  };
  
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.formatted_location);
    onChange(suggestion.formatted_location);
    setShowSuggestions(false);
  };
  
  return (
    <div className="location-input-container">
      <input
        ref={inputRef}
        type="text"
        className="form-input"
        value={query}
        onChange={handleInputChange}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        placeholder={placeholder || "Enter a location"}
      />
      
      {loading && <div className="location-loading">Loading...</div>}
      
      {showSuggestions && suggestions.length > 0 && (
        <ul ref={suggestionsRef} className="location-suggestions">
          {suggestions.map(suggestion => (
            <li 
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="location-suggestion-item"
            >
              {suggestion.formatted_location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationInput; 