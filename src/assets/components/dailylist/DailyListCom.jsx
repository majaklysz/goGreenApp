/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import TaskComponent from "../taskComponent/TaskComponent";
import "./dailycomp.css";
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
            }));

            acc.push(...tasksWithRoomName);
            return acc;
          },
          []
        );

        setTasks(allTasks);
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
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {tasks.length === 0 && !loading && <p>No tasks due today.</p>}

      {tasks.map((task) => (
        <div key={task.name} className="dailyCompCardBox">
          <p className="lilTag">{task.roomName}</p>
          <TaskComponent task={task} />
        </div>
      ))}
    </div>
  );
}
