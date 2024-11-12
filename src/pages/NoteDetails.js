import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./NoteDetails.css";
import { AuthContext } from "../contexts/AuthContext";

const NoteDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext); // Use authToken from context

  // Check if note exists in the location state
  const { note } = location.state || {}; // Default to an empty object if note is undefined

  const [title, setTitle] = useState(note?.title || "");
  const [details, setDetails] = useState(note?.details || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [updateDone, setUpdateDone] = useState(false);
  const [updateStatus, setUpdateStatus] = useState("");
  const [isNoteAvailable, setIsNoteAvailable] = useState(true); // Track if note is available

  const textareaRef = useRef(null);
  const URL = "https://simplenotesbackend.onrender.com";

  useEffect(() => {
    if (!authToken) {
      console.log("missing");

      navigate("/signin");
    }
  }, [authToken, navigate]);

  // Handle the case when note is undefined
  useEffect(() => {
    if (!note) {
      setIsNoteAvailable(false); // Set note availability to false if note is not passed
    }
  }, [note]);

  // Redirect to home page if note is unavailable after initial check
  useEffect(() => {
    if (!isNoteAvailable) {
      
      navigate("/"); // Redirect to home if no note is available
    }
  }, [isNoteAvailable, navigate]);

  // Track changes to the title and details
  useEffect(() => {
    if (title !== note?.title || details !== note?.details) {
      setIsUpdated(true);
    } else {
      setIsUpdated(false);
    }
  }, [title, details, note?.title, note?.details]);

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resizeTextarea();
  }, [details]);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(URL + `/api/notes/${note._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the token from context
        },
      });

      if (response.ok) {
        navigate("/"); // Redirect after successful deletion
      } else {
        //alert("Failed to delete the note");
      }
    } catch (error) {
      console.error("Error deleting the note:", error);
      //alert("Failed to delete the note");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!authToken) {
      setUpdateStatus("User not authenticated");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(URL + `/api/notes/${note._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Include the token from context
        },
        body: JSON.stringify({ title, details }),
      });

      if (response.ok) {
        setUpdateDone(true);
        setIsUpdated(false);
        setUpdateStatus("Note Update Successful");
      } else {
        setUpdateStatus("Note Update Failed");
      }
    } catch (error) {
      setUpdateStatus("Note Update Failed");
    } finally {
      setIsLoading(false);
    }
  };

  // If note is not available, show a loading state or error message
  if (!isNoteAvailable) {
    return <p>Note not found. Redirecting...</p>;
  }

  return (
    <div className="note-details">
      <h2>Edit Note</h2>

      <form onSubmit={handleUpdate}>
        <h3>Title</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={20}
          required
        />
        <h3>Details</h3>
        <textarea
          ref={textareaRef}
          value={details}
          onChange={(e) => {
            setDetails(e.target.value);
            resizeTextarea();
          }}
          maxLength={1000}
          required
        />

        <button type="button" onClick={() => navigate(-1)}>
          Back
        </button>

        {isLoading ? (
          <p>Processing...</p>
        ) : (
          <>
            {!updateDone && isUpdated && (
              <button type="submit" className="update-btn">
                Update
              </button>
            )}
            <button type="button" onClick={handleDelete} className="delete-btn">
              Delete
            </button>
          </>
        )}

        {updateStatus && (
          <p
            style={{
              color:
                updateStatus === "Note Update Successful" ? "green" : "red",
              marginTop: "20px",
              fontWeight: "bold",
            }}
          >
            {updateStatus}
          </p>
        )}
      </form>
    </div>
  );
};

export default NoteDetails;
