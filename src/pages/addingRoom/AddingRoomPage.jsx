import { useEffect, useState } from "react";
import { getAuth } from "@firebase/auth";
import { useNavigate } from "react-router-dom";
import "../addingRoom/adding.css";

export default function AddingRoomPage() {
  const auth = getAuth();
  const [rooms, setRooms] = useState([]);
  const [customRoomName, setCustomRoomName] = useState("");
  const [chosenRoomName, setChosenRoomName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch room name
    fetchRoomNames();
  }, []);

  async function fetchRoomNames() {
    try {
      const url = `${import.meta.env.VITE_FIREBASE_DB_URL}rooms.json`;
      const response = await fetch(url);
      const data = await response.json();

      console.log("Fetched room names:", data);

      if (Array.isArray(data)) {
        setRooms(data);
      } else {
        console.error("Invalid data format. Expected an array.");
      }
    } catch (error) {
      console.error("Error fetching room names:", error);
    }
  }

  async function addRoom() {
    try {
      // Fetch existing user data from the database
      const userUrl = `${import.meta.env.VITE_FIREBASE_DB_URL}users/${
        auth.currentUser.uid
      }.json`;
      const userResponse = await fetch(userUrl);
      const existingUserData = await userResponse.json();

      // Initialize or update userRooms
      let userRooms = { ...(existingUserData?.userRooms || {}) };

      if (chosenRoomName === "Other" && customRoomName !== "") {
        // User selected "Other" and provided a custom room name
        const newRoomId = generateRoomId();

        userRooms = {
          ...userRooms,
          [newRoomId]: {
            room_name: customRoomName,
          },
        };
      } else if (chosenRoomName !== "") {
        // User selected a room from the list
        const newRoomId = generateRoomId();

        userRooms = {
          ...userRooms,
          [newRoomId]: {
            room_name: chosenRoomName,
          },
        };
      }

      // Save the updated userRooms to the database
      const saveUserUrl = `${import.meta.env.VITE_FIREBASE_DB_URL}users/${
        auth.currentUser.uid
      }.json`;
      await fetch(saveUserUrl, {
        method: "PATCH", // Use PATCH to update existing data
        body: JSON.stringify({ userRooms }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Optionally, you can reset the form or perform other actions after adding a room
      setCustomRoomName("");
      setChosenRoomName("");
      fetchRoomNames(); // Refresh the room list

      navigate("/");
    } catch (error) {
      console.error("Error adding room:", error);
    }
  }

  function generateRoomId() {
    // Replace with your logic to generate a unique room ID
    return `room_id_${Date.now()}`;
  }

  return (
    <section>
      <div className="addingRoomcontent">
        <h2>Room Name:</h2>

        <select
          className="selectionRoom"
          value={chosenRoomName}
          onChange={(e) => setChosenRoomName(e.target.value)}
        >
          <option value="" disabled>
            Select a room name
          </option>
          {rooms.map((room) => (
            <option key={room.name} value={room.name}>
              {room.name}
            </option>
          ))}
          <option value="Other">Other</option>
        </select>
        {chosenRoomName === "Other" && (
          <div className="customRoomName">
            <label>Custom Room Name:</label>
            <input
              type="text"
              value={customRoomName}
              onChange={(e) => setCustomRoomName(e.target.value)}
            />
          </div>
        )}

        <button className="cta" onClick={addRoom}>
          <img src="src/assets/icons/fi-rr-plus-small.svg" alt="" />
          Add Room
        </button>
      </div>
    </section>
  );
}
