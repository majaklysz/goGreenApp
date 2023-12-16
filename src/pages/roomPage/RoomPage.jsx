import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../roomPage/room.css";
import TaskComponent from "../../assets/components/taskComponent/TaskComponent";

export default function RoomPage() {
  const [room, setRoom] = useState({});
  const [name, setName] = useState("");
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();
  const params = useParams();
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  // Ensure that userId is available before constructing the URL
  const url = userId
    ? `${import.meta.env.VITE_FIREBASE_DB_URL}users/${userId}/userRooms/${
        params.roomId
      }.json`
    : null;

  useEffect(() => {
    async function getRoom() {
      if (!url) return;

      const response = await fetch(url);
      const data = await response.json();
      setRoom(data);

      if (data) {
        setName(data.room_name);
      }
    }
    getRoom();
  }, [url]);

  useEffect(() => {
    async function getTasks() {
      if (!userId) return;

      const url = `${
        import.meta.env.VITE_FIREBASE_DB_URL
      }users/${userId}/userRooms/${params.roomId}/userTasks.json`;
      const response = await fetch(url);
      const data = await response.json();
      const tasksArray = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setTasks(tasksArray);
    }

    getTasks();
  }, [userId, params.roomId]);

  console.log(room);

  return (
    <section>
      <div className="headlineRoom">
        <div className="nameArrow" onClick={() => navigate("/")}>
          <img
            className="arrowBack"
            src="src/assets/icons/fi-rr-angle-small-left.svg"
            alt="go back arrow"
          />
          <h2>{name}</h2>
        </div>
        <img
          onClick={() => navigate(`/editRoom/${params.roomId}`)}
          className="settingsIcon"
          src="src/assets/icons/fi-rr-settings.svg"
          alt="settings"
        />
      </div>
      <div className="tasksRoom">
        <div className="headlineTasksRoom">
          <h3>Tasks</h3>
          <img
            onClick={() => navigate(`/addTask/${params.roomId}`)}
            src="src/assets/icons/fi-rr-plus.svg"
            alt=""
          />
        </div>
        <div className="tasksContent">
          {tasks.length === 0 ? (
            <div
              className="placeholderTasks"
              onClick={() => navigate(`/addTask/${params.roomId}`)}
            >
              <p>Add your first task</p>
              <img src="src/assets/icons/plusGreen.svg" alt="plus" />
            </div>
          ) : (
            tasks.map((task) => <TaskComponent task={task} key={task.id} />)
          )}
        </div>
      </div>
    </section>
  );
}
