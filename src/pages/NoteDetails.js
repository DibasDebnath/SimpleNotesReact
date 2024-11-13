import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./NoteDetails.css";
import { AuthContext } from "../contexts/AuthContext";

const NoteDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authToken, URL } = useContext(AuthContext);

  const { note } = location.state || {};
  const [title, setTitle] = useState(note?.title || "");
  const [details, setDetails] = useState(note?.details || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [updateDone, setUpdateDone] = useState(false);
  const [updateStatus, setUpdateStatus] = useState("");
  const [isNoteAvailable, setIsNoteAvailable] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for delete confirmation popup

  const textareaRef = useRef(null);
  // const URL = "http://localhost:4000";
  //const URL = "https://simplenotesbackend.onrender.com";

  useEffect(() => {
    if (!authToken) {
      navigate("/signin");
    }
  }, [authToken, navigate]);

  useEffect(() => {
    if (!note) {
      setIsNoteAvailable(false);
    }
  }, [note]);

  useEffect(() => {
    if (!isNoteAvailable) {
      navigate("/");
    }
  }, [isNoteAvailable, navigate]);

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
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting the note:", error);
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
          Authorization: `Bearer ${authToken}`,
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

  const confirmDelete = () => {
    setShowDeleteConfirm(true); // Show the delete confirmation popup
  };

  const closePopup = () => {
    setShowDeleteConfirm(false); // Close the popup without deleting
  };

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
            <button
              type="button"
              onClick={confirmDelete}
              className="delete-btn"
            >
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

      {/* Delete confirmation popup */}
      {showDeleteConfirm && (
        <div className="delete-popup">
          <div className="popup-content">
            <p>Are you sure you want to delete?</p>
            <div className="popup-buttons">
              <button className="button" onClick={handleDelete}>
                Yes
              </button>
              <button className="button" onClick={closePopup}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteDetails;
