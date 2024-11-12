import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext"; // Import AuthContext
import "./Home.css";
import { format } from "date-fns";

const Home = () => {
  const { authToken } = useContext(AuthContext); // Use authToken from context
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [errors, setErrors] = useState({ title: false, details: false });
  const [page, setPage] = useState(1);
  const limit = 20;
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const textareaRef = useRef(null);
  // const URL = "http://localhost:4000";
  const URL = "https://simplenotesbackend.onrender.com";

  

  // Redirect to sign-in if user is not authenticated
  useEffect(() => {
    if (!authToken) {
      navigate("/signin");
    }
  }, [authToken, navigate]);

  const handleAddNote = async (event) => {
    event.preventDefault();

    const titleError = !title.trim();
    const detailsError = !details.trim();
    setErrors({ title: titleError, details: detailsError });

    if (!titleError && !detailsError) {
      try {
        // Ensure you have access to the userId from your context
        

        const response = await fetch(URL+"/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // Add auth token for authentication
          },
          body: JSON.stringify({ title, details }), // Include userId in the request body
        });

        if (response.ok) {
          const newNote = await response.json();
          setNotes((prevNotes) => [newNote, ...prevNotes]);
          setTitle("");
          setDetails("");
          setIsInputVisible(false);
          setErrors({ title: false, details: false });
        } else {
          console.error("Failed to add note");
          //alert("Failed to add note");
        }
      } catch (error) {
        console.error("Error adding the note:", error);
        //alert("Failed to add note");
      }
    }
  };


  // Handle View Note Details
  const handleViewDetails = (noteId) => {
    if (noteId) {
      
      navigate(`/note/${noteId}`, {
        state: { note: notes.find((note) => note._id === noteId) },
      });
    } else {
      console.error("Note not found!");
    }
  };

  // Resize the Textarea dynamically based on content
  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Fetch Notes (with pagination)
  const fetchNotes = useCallback(
    async (currentPage) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          URL+`/api/notes?limit=${limit}&page=${currentPage}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // Include auth token
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.length < limit) setHasMore(false);
          setNotes((prevNotes) => [...prevNotes, ...data]);
        } else {
          console.error("Error fetching notes:", response.statusText);
          //alert("Failed to fetch notes");
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [authToken, limit]
  );

  useEffect(() => {
    if (authToken) {
      fetchNotes(page);
    }
  }, [page, authToken, fetchNotes]);

  useEffect(() => {
    resizeTextarea();
  }, [details]);

  const loadMoreNotes = () => {
    if (hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="main-content">
      <h1>Simple Notes</h1>

      <button
        className="toggle-input-btn"
        onClick={() => {
          setIsInputVisible(!isInputVisible);
          setTitle("");
          setDetails("");
          setErrors({ title: false, details: false });
        }}
      >
        {isInputVisible ? "Close Note Input" : "Add New Note"}
      </button>

      {isInputVisible && (
        <form className="note-input" onSubmit={handleAddNote}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={20}
            required
            className={errors.title ? "error" : ""}
          />
          <textarea
            ref={textareaRef}
            placeholder="Details"
            value={details}
            onChange={(e) => {
              setDetails(e.target.value);
              resizeTextarea();
            }}
            maxLength={1000}
            rows={1}
            required
            className={errors.details ? "error" : ""}
          />
          <button type="submit">Add Note</button>
        </form>
      )}
      <br/>
      <input
        className="toggle-search-input"
        type="text"
        placeholder="Search in title/details..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <ul className="notes-list">
        {filteredNotes.map((note) => (
          <li key={note._id} className="note-item">
            <button
              className="note-item-btn"
              onClick={() => handleViewDetails(note._id)}
            >
              <h3>{note.title}</h3>
              <p>
                {note.details.length > 100
                  ? note.details.substring(0, 30) + "..."
                  : note.details}
              </p>
              <p className="date-text">
                {format(note.updatedAt, "EEEE, MMMM dd 'at' hh:mm a")}
              </p>
            </button>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          className="loadMore-btn"
          onClick={loadMoreNotes}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Load More Notes"}
        </button>
      )}
    </div>
  );
};

export default Home;
