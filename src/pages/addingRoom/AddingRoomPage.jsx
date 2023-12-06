import { useEffect, useState } from "react";
import { useAuth } from "./firebase-config.js";

export default function AddingRoomPage() {
  const auth = useAuth();

  const [rooms, setRooms] = useState([]);
  const [customRoomName, setCustomRoomName] = useState("");
  const [chosenRoomName, setChosenRoomName] = useState("");

  useEffect(() => {
    // Fetch room names when the component mounts
    fetchRoomNames();
  }, []);

  async function fetchRoomNames() {
    try {
      const url = `${import.meta.env.VITE_FIREBASE_DB_URL}rooms.json`;
      const response = await fetch(url);
      const data = await response.json();

      if (data) {
        setRooms(data);
      }
    } catch (error) {
      console.error("Error fetching room names:", error);
    }
  }

  async function addRoom() {
    try {
      let userRooms = { ...rooms };

      if (chosenRoomName === "Other" && customRoomName !== "") {
        // User selected "Other" and provided a custom room name
        const newRoomId = generateRoomId();

        userRooms[newRoomId] = {
          room_name: customRoomName,
          // Add other properties as needed
        };
      } else if (chosenRoomName !== "") {
        // User selected a room from the list
        const newRoomId = generateRoomId();

        userRooms[newRoomId] = {
          room_name: chosenRoomName,
          // Add other properties as needed
        };
      }

      // Save the updated userRooms to the database
      const saveUrl = `${import.meta.env.VITE_FIREBASE_DB_URL}${
        auth.currentUser.uid
      }/userRooms.json`;
      await fetch(saveUrl, {
        method: "PUT",
        body: JSON.stringify(userRooms),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Optionally, you can reset the form or perform other actions after adding a room
      setCustomRoomName("");
      setChosenRoomName("");
      fetchRoomNames(); // Refresh the room list
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
      <h2>Room Name:</h2>

      <label>Select or enter a room name:</label>
      <select
        value={chosenRoomName}
        onChange={(e) => setChosenRoomName(e.target.value)}
      >
        <option value="" disabled>
          Select a room name
        </option>
        {rooms.map((room) => (
          <option key={room.room_name} value={room.room_name}>
            {room.room_name}
          </option>
        ))}
        <option value="Other">Other</option>
      </select>

      {chosenRoomName === "Other" && (
        <div>
          <label>Custom Room Name:</label>
          <input
            type="text"
            value={customRoomName}
            onChange={(e) => setCustomRoomName(e.target.value)}
          />
        </div>
      )}

      <button onClick={addRoom}>Add Room</button>
    </section>
  );
}
