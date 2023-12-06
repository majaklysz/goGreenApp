import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function RoomPage() {
  const [room, setRoom] = useState({});
  const [name, setName] = useState("");
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
        <div className="nameArrow">
          <img src="" alt="" />
          <h2>{name}</h2>
        </div>
        <img className="settingsIcon" src="" alt="" />
      </div>
      <div className="tasksRoom">
        <div className="headlineTasksRoom">
          <h3>Tasks</h3>
          <img src="" alt="" />
        </div>
        <div className="tasksContent"></div>
      </div>
    </section>
  );
}
