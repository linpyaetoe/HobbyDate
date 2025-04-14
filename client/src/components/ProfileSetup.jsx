import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

// list of hobbies for dropdown
const HOBBIES = [
  "running", "rowing", "reading", "rock climbing", "photography", "traveling",
  "painting", "hiking", "swimming", "sketching", "drawing", "dancing",
  "singing", "guitar", "piano", "drums", "yoga", "pilates", "baking",
  "cooking", "writing", "journaling", "blogging", "vlogging", "podcasting",
  "video editing", "graphic design", "video games", "board games", "card games",
  "cosplaying", "thrifting", "shopping", "skincare", "fashion", "interior design",
  "DIY crafts", "scrapbooking", "sewing", "knitting", "crocheting", "3D printing",
  "coding", "photobook making", "filmmaking", "movies", "anime", "learning languages",
  "calligraphy", "origami", "ceramics", "pottery", "sculpting", "martial arts",
  "kickboxing", "boxing", "weightlifting", "calisthenics", "ice skating", "roller skating",
  "skateboarding", "surfing", "snowboarding", "skiing", "camping", "fishing",
  "bird watching", "star gazing", "gardening", "volunteering", "dog walking",
  "coffee making", "wine tasting", "beer tasting", "watches", "coin collecting",
  "stamp collecting", "vinyl collecting", "woodworking", "metalworking", "LEGOs",
  "solving puzzles", "sudoku", "crossword puzzles", "speedcubing", "magic tricks",
  "acting", "band", "orchestra", "DJing", "songwriting", "beatboxing", "reading manga",
  "collecting comic books", "graphic novels", "digital art", "NFTs", "crypto trading",
  "budgeting", "investing", "cycling", "Zumba", "HIIT workouts", "trail running",
  "laser tag", "paintball", "escape rooms", "karaoke", "concerts", "music festivals",
  "bullet journaling"
];

export default function ProfileSetup() {
  //@linpyaetoe all variables created for this page
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);

  const [hobbyInput, setHobbyInput] = useState("");
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

  // dismiss dropdown when clicked outside for hobbies
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // handles hobby input & update suggestions
  const handleHobbyChange = (e) => {
    const value = e.target.value.toLowerCase();
    setHobbyInput(value);
    const filtered = HOBBIES.filter(
      (hobby) =>
        hobby.toLowerCase().includes(value) &&
        !selectedHobbies.includes(hobby)
    );
    setSuggestions(filtered.slice(0, 8));
  };

  const addHobby = (hobby) => {
    setSelectedHobbies([...selectedHobbies, hobby]);
    setHobbyInput("");
    setSuggestions([]);
  };

  const removeHobby = (hobbyToRemove) => {
    setSelectedHobbies(
      selectedHobbies.filter((hobby) => hobby !== hobbyToRemove)
    );
  };

  // handles profile pic upload & preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // handle form submission
  // @linpyaetoe hook this up to backend to save user profile, pls & ty
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, location, about, selectedHobbies, profilePic });
    navigate("/events");
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <h1 className="profile-title">Set up your profile</h1>
        <h2 className="profile-subtitle">give future buddies something to vibe with</h2>

        <form onSubmit={handleSubmit} className="profile-form">
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="profile-input"
          />

          <div className="profile-upload-wrapper">
            <label className="profile-upload-label" htmlFor="profile-pic">
              Upload profile picture
            </label>

            <input
              type="file"
              id="profile-pic"
              accept="image/*"
              onChange={handleFileChange}
              className="profile-upload-input"
            />

            <label htmlFor="profile-pic" className="custom-upload-button">
              Choose file
            </label>

            {profilePic && <p className="file-name">{profilePic.name}</p>}
          </div>

          {preview && (
            <img
              src={preview}
              alt="profile preview"
              className="profile-preview"
            />
          )}

          <input
            type="text"
            placeholder="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="profile-input"
          />

          <div className="hobby-container" ref={suggestionsRef}>
            <input
              type="text"
              placeholder="hobbies"
              value={hobbyInput}
              onChange={handleHobbyChange}
              className="profile-input"
            />
            {suggestions.length > 0 && (
              <div className="hobby-suggestions">
                {suggestions.map((hobby, idx) => (
                  <div
                    key={idx}
                    className="hobby-suggestion"
                    onClick={() => addHobby(hobby)}
                  >
                    {hobby}
                  </div>
                ))}
              </div>
            )}
            <div className="chip-container">
              {selectedHobbies.map((hobby, idx) => (
                <span
                  key={idx}
                  className="chip"
                  onClick={() => removeHobby(hobby)}
                >
                  {hobby} &times;
                </span>
              ))}
            </div>
          </div>

          <textarea
            placeholder={
              "drop some fun facts about yourself\n" +
              "your future BFFs are lurking"
            }
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="profile-textarea"
          />

          <div className="bottom-button-group">
            <button type="submit" className="save-button">Save profile</button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/login")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}