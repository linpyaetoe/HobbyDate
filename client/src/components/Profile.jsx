import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../security/fetchWithAuth";
import LocationInput from "./LocationInput";
import "../styles/global.css";

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

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // for editing toggles
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isEditingHobbies, setIsEditingHobbies] = useState(false);

  // form field variables
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const [hobbyInput, setHobbyInput] = useState("");
  const [hobbySuggestions, setHobbySuggestions] = useState([]);
  const [hobbies, setHobbies] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const suggestionsRef = useRef(null);

  // fetch user profile
  useEffect(() => {
    api.get("/users/profile")
      .then((res) => {
        const data = res.data;
        setUser(data);
        setLocation(data.location || "");
        setAbout(data.about || "");
        setHobbies(data.hobbies || []);
      })
      .catch(err => console.error("Fetch failed:", err));
  }, []);

  // close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setHobbySuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // save edited field
  const handleSaveField = async (field) => {
    if (!user) return;

    const updated = {
      name: user.username,
      location,
      about,
      hobbies
    };

    try {
      const res = await api.put("/users/profile", updated);
      const data = res.data;
      setUser(data);

      if (field === "location") setIsEditingLocation(false);
      if (field === "about") setIsEditingAbout(false);
      if (field === "hobbies") {
        setIsEditingHobbies(false);
        setHobbyInput("");
        setHobbySuggestions([]);
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // hobby search & filters
  const handleHobbyInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setHobbyInput(value);
    const filtered = HOBBIES.filter(
      (hobby) =>
        hobby.toLowerCase().includes(value) &&
        !hobbies.includes(hobby)
    );
    setHobbySuggestions(filtered.slice(0, 6));
  };

  // add hobby
  const addHobby = (hobby) => {
    setHobbies([...hobbies, hobby]);
    setHobbyInput("");
    setHobbySuggestions([]);
  };

  // remove hobby
  const removeHobby = (hobbyToRemove) => {
    setHobbies(hobbies.filter((hobby) => hobby !== hobbyToRemove));
  };

  useEffect(() => {
    api.get("/events/my-events")
      .then(res => {
        setPastEvents(res.data.past);
        setUpcomingEvents(res.data.upcoming);
      })
      .catch(err => console.error("Failed to load events:", err));
  }, []);

  return (
    <div className="page-wrapper">
      <div className="profile-grid">

        {/* name and location section */}
        <div className={`card ${isEditingLocation ? 'active' : ''}`}>
          <button className="edit-btn" onClick={() => {
            isEditingLocation ? handleSaveField("location") : setIsEditingLocation(true);
          }}>
            {isEditingLocation ? "💾" : "✏️"}
          </button>
          <p className="card-title">{user?.username || ""}</p>
          {isEditingLocation ? (
            <div className="location-wrapper" style={{ position: 'relative', zIndex: 9999 }}>
              <LocationInput
                value={location}
                onChange={setLocation}
                placeholder="Enter your location"
              />
            </div>
          ) : (
            <p className="card-content">
              {location ? "📍 " + location : "📍 Somewhere out there..."}
            </p>
          )}
        </div>

        {/* hobbies section */}
        <div className={`card ${isEditingHobbies ? 'active' : ''}`}>
          <button className="edit-btn" onClick={() => {
            isEditingHobbies ? handleSaveField("hobbies") : setIsEditingHobbies(true);
          }}>
            {isEditingHobbies ? "💾" : "✏️"}
          </button>
          <p className="card-title">Hobbies</p>

          {isEditingHobbies ? (
            <>
              <div className="hobby-input-wrapper" ref={suggestionsRef}>
                <input
                  className="card-input"
                  placeholder="Add a hobby"
                  value={hobbyInput}
                  onChange={handleHobbyInputChange}
                />
                {hobbySuggestions.length > 0 && (
                  <div className="hobby-suggestions">
                    {hobbySuggestions.map((hobby, idx) => (
                      <div key={idx} className="hobby-suggestion" onClick={() => addHobby(hobby)}>
                        {hobby}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* hobby chips */}
              <div className="chip-container">
                {hobbies.map((hobby, idx) => (
                  <span key={idx} className="chip" onClick={() => removeHobby(hobby)}>
                    {hobby} &times;
                  </span>
                ))}
              </div>
            </>
          ) : hobbies.length > 0 ? (
            <div className="chip-container">
              {hobbies.map((hobby, index) => (
                <span key={index} className="chip">{hobby}</span>
              ))}
            </div>
          ) : (
            <p className="card-content">💤 Taking a break from hobbies.</p>
          )}
        </div>

        {/* about me section */}
        <div className="card">
          <button className="edit-btn" onClick={() => {
            isEditingAbout ? handleSaveField("about") : setIsEditingAbout(true);
          }}>
            {isEditingAbout ? "💾" : "✏️"}
          </button>
          <p className="card-title">About Me</p>
          {isEditingAbout ? (
            <textarea
              className="card-textarea"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          ) : (
            <p className="card-content">{about || "✍🏻 Bio coming soon"}</p>
          )}
        </div>

        {/* past events */}
        <div className="card">
          <p className="card-title">Past Events</p>
          {pastEvents.length > 0 ? (
            <ul className="card-content">
              {pastEvents.map(event => (
                <li
                  key={event.id}
                  className="clickable-event"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  {event.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="card-content">You haven't attended any events yet.</p>
          )}
        </div>

        {/* upcoming events */}
        <div className="card">
        <p className="card-title">Upcoming Events</p>
        {upcomingEvents.length > 0 ? (
          <ul className="card-content">
            {upcomingEvents.map(event => (
              <li
                key={event.id}
                className="clickable-event"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                {event.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="card-content">You have no upcoming events.</p>
        )}
      </div>

      </div>
    </div>
  );
}
