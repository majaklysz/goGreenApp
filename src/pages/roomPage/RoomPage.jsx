import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../roomPage/room.css";
export default function RoomPage() {
  const [room, setRoom] = useState({});
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const params = useParams();
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  const url = `${
    import.meta.env.VITE_FIREBASE_DB_URL
  }users/${userId}/userRooms/${params.roomId}.json`;

  useEffect(() => {
    async function getRoom() {
      const response = await fetch(url);
      const data = await response.json();
      setRoom(data);

      if (data) {
        setName(data.room_name);
      }
    }
    getRoom();
  }, [url]);
  console.log(room);

  return (
    <section>
      <div className="headlineRoom">
        <div className="nameArrow" onClick={() => navigate(-1)}>
          <img
            className="arrowBack"
            src="src/assets/icons/fi-rr-angle-small-left.svg"
            alt="go back arrow"
          />
          <h2>{name}</h2>
        </div>
        <img
          className="settingsIcon"
          src="src/assets/icons/fi-rr-settings.svg"
          alt="settings"
        />
      </div>
      <div className="tasksRoom">
        <div className="headlineTasksRoom">
          <h3>Tasks</h3>
          <img src="src/assets/icons/fi-rr-plus.svg" alt="" />
        </div>
        <div className="tasksContent">
          <div className="placeholderTasks">
            <p>Add your first task</p>
            <img src="src/assets/icons/plusGreen.svg" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}
