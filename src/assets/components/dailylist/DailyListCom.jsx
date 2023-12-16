/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import TaskComponent from "../taskComponent/TaskComponent";
import "./dailycomp.css";
import smilyFaceIcon from "../../icons/fi-rr-smile.svg";

export default function DailyListCom({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomNames, setRoomNames] = useState({});

  useEffect(() => {
    async function getTasks() {
      try {
        const userUrl = `${import.meta.env.VITE_FIREBASE_DB_URL}users/${
          user?.uid
        }.json`;

        // Fetch user data
        const userResponse = await fetch(userUrl);
        if (!userResponse.ok) {
          throw new Error(
            `Failed to fetch user data: ${userResponse.statusText}`
          );
        }
        const userData = await userResponse.json();

        // Fetch room names
        const roomNames = Object.keys(userData?.userRooms || {}).reduce(
          (acc, roomId) => {
            acc[roomId] = userData.userRooms[roomId].room_name;
            return acc;
          },
          {}
        );

        setRoomNames(roomNames);

        // Fetch tasks
        const tasksUrl = `${import.meta.env.VITE_FIREBASE_DB_URL}users/${
          user?.uid
        }/userTasks.json`;

        const tasksResponse = await fetch(tasksUrl);
        if (!tasksResponse.ok) {
          throw new Error(
            `Failed to fetch tasks data: ${tasksResponse.statusText}`
          );
        }

        const tasksData = await tasksResponse.json();

        const today = new Date().toISOString().split("T")[0];

        const tasksArray = Object.keys(tasksData || {}).map((key) => {
          const task = {
            id: key,
            ...tasksData[key],
          };
          console.log("Task:", task);
          return task;
        });

        // Filter tasks due today
        const tasksDueToday = tasksArray.filter(
          (task) => task.dueDate.split("T")[0] === today
        );

        setTasks(tasksDueToday);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      getTasks();
    }
  }, [user]);

  console.log(tasks);

  return (
    <div>
      {loading && (
        <div className="placeholderDaily">
          <img src={smilyFaceIcon} alt="smily face" />
          <p>Loading tasks...</p>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {tasks.length === 0 && !loading && (
        <div className="placeholderDaily">
          <img src={smilyFaceIcon} alt="smily face" />
          <p>
            No tasks due today. <br /> Sit down and relax
          </p>
        </div>
      )}

      {tasks.map((task) => (
        <div key={task.id} className="dailyCompCardBox">
          <p className="lilTag">{roomNames[task.roomId]}</p>
          <TaskComponent task={task} />
        </div>
      ))}
    </div>
  );
}
