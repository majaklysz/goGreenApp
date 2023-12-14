import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function TaskEditPage() {
  const params = useParams();
  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  const [task, setTask] = useState(null);
  const [name, setName] = useState("");
  const [frequencyType, setFrequencyType] = useState("");
  const [frequencyNumber, setFrequencyNumber] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = location.state.roomId;
  const url = `${
    import.meta.env.VITE_FIREBASE_DB_URL
  }users/${userId}/userRooms/${roomId}/userTasks/${params.taskId}.json`;
  const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

  useEffect(() => {
    async function getTask() {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setTask(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching task:", error);
        setLoading(false);
      }
    }

    getTask();
  }, [params?.taskId, url]);

  useEffect(() => {
    if (task && Object.keys(task).length > 0) {
      setName(task?.name || "");
      setFrequencyType(task?.frequencyType || "");
      setFrequencyNumber(task?.frequencyNumber || 0);
    }
  }, [task]);

  const handleFrequencyChange = () => {
    // Calculate new due date when frequency changes
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    let timeDifference =
      frequencyNumber *
      MILLISECONDS_IN_DAY *
      {
        daily: 1,
        weekly: 7,
        monthly: 30,
      }[frequencyType];

    const newDueDate = new Date(currentDate.getTime() + timeDifference);

    // Update due date in the task state
    setTask((prevTask) => ({
      ...prevTask,
      dueDate: newDueDate.toISOString(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskToUpdate = {
      ...task,
      name: name,
      frequencyNumber: frequencyNumber,
      frequencyType: frequencyType,
      id: task.id,
    };

    try {
      const response = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(taskToUpdate),
      });

      if (response.ok) {
        navigate(-1);
      } else {
        console.log("Something went wrong");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async () => {
    const wantToDelete = window.confirm("Are you sure you want to delete?");

    if (wantToDelete) {
      try {
        const response = await fetch(url, {
          method: "DELETE",
        });

        if (response.ok) {
          navigate(-1);
        } else {
          console.log("Something went wrong");
        }
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  if (loading || !task || Object.keys(task).length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <div className="goBackArrowTasks" onClick={() => navigate(-1)}>
          <svg
            width="32"
            height="33"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.5999 13.21C10.5061 13.117 10.4317 13.0064 10.381 12.8846C10.3302 12.7627 10.3041 12.632 10.3041 12.5C10.3041 12.368 10.3302 12.2373 10.381 12.1154C10.4317 11.9936 10.5061 11.883 10.5999 11.79L15.1899 7.21C15.2836 7.11704 15.358 7.00644 15.4088 6.88458C15.4595 6.76272 15.4857 6.63201 15.4857 6.5C15.4857 6.36799 15.4595 6.23728 15.4088 6.11542C15.358 5.99356 15.2836 5.88296 15.1899 5.79C15.0025 5.60375 14.749 5.49921 14.4849 5.49921C14.2207 5.49921 13.9672 5.60375 13.7799 5.79L9.18986 10.38C8.62806 10.9425 8.3125 11.705 8.3125 12.5C8.3125 13.295 8.62806 14.0575 9.18986 14.62L13.7799 19.21C13.9661 19.3947 14.2175 19.4989 14.4799 19.5C14.6115 19.5008 14.7419 19.4755 14.8638 19.4258C14.9856 19.376 15.0964 19.3027 15.1899 19.21C15.2836 19.117 15.358 19.0064 15.4088 18.8846C15.4595 18.7627 15.4857 18.632 15.4857 18.5C15.4857 18.368 15.4595 18.2373 15.4088 18.1154C15.358 17.9936 15.2836 17.883 15.1899 17.79L10.5999 13.21Z"
              fill="white"
            />
          </svg>
          <h2>Edit Task</h2>
        </div>
        <label>
          <p>Task name:</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>Do every:</label>
        <div className="inputBoxTask">
          <label className="freqNumber">
            <input
              type="number"
              min="1"
              value={frequencyNumber}
              onChange={(e) => {
                setFrequencyNumber(e.target.value);
                handleFrequencyChange();
              }}
            />
          </label>
          <select
            className="freqType"
            value={frequencyType}
            onChange={(e) => {
              setFrequencyType(e.target.value);
              handleFrequencyChange();
            }}
          >
            <option value="daily">Day</option>
            <option value="weekly">Week</option>
            <option value="monthly">Month</option>
          </select>
        </div>
        <button className="cta">Save</button>
      </form>
      <button onClick={handleDelete} className="deleteButton">
        Delete
      </button>
    </section>
  );
}
