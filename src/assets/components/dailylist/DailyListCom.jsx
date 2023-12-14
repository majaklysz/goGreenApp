/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import TaskComponent from "../taskComponent/TaskComponent";
import "./dailycomp.css";
import smilyFaceIcon from "../../icons/fi-rr-smile.svg";

export default function DailyListCom({ user }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://gogreen-460d2-default-rtdb.firebaseio.com/users/${user?.uid}.json`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();

        const today = new Date().toISOString().split("T")[0];

        const allTasks = Object.values(data?.userRooms || {}).reduce(
          (acc, room) => {
            const roomTasks = Object.values(room?.userTasks || {}).filter(
              (task) => task.dueDate.split("T")[0] === today
            );

            // Add room name to each task
            const tasksWithRoomName = roomTasks.map((task) => ({
              ...task,
              roomName: room.room_name,
              roomId: room.id,
            }));

            acc.push(...tasksWithRoomName);
            return acc;
          },
          []
        );

        const tasksDueToday = allTasks.filter((task) => {
          return task.dueDate.split("T")[0] === today;
        });

        setTasks(tasksDueToday);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

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
            No task left for today. <br /> Sit down and relax
          </p>
        </div>
      )}

      {tasks.map((task) => (
        <div key={task.name} className="dailyCompCardBox">
          <p className="lilTag">{task.roomName}</p>
          <TaskComponent task={task} />
        </div>
      ))}
    </div>
  );
}
