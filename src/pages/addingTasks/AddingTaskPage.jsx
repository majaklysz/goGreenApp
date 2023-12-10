// AddingTaskPage.jsx
import { useState } from "react";
import { getAuth } from "@firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import "../addingTasks/addingTask.css";

export default function AddingTaskPage() {
  const auth = getAuth();
  const params = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState("");
  const [frequencyType, setFrequencyType] = useState("daily");
  const [frequencyNumber, setFrequencyNumber] = useState(1);

  const handleTaskChange = (event) => {
    setTask(event.target.value);
  };

  const handleFrequencyTypeChange = (event) => {
    setFrequencyType(event.target.value);
  };

  const handleFrequencyNumberChange = (event) => {
    setFrequencyNumber(parseInt(event.target.value, 10));
  };

  async function addTask() {
    const newTask = {
      name: task,
      frequencyType: frequencyType,
      frequencyNumber: frequencyNumber,
      // Calculate due date based on the current date
      dueDate: calculateDueDate(frequencyType, frequencyNumber),
    };

    const tasksUrl = `${import.meta.env.VITE_FIREBASE_DB_URL}users/${
      auth.currentUser.uid
    }/userRooms/${params.roomId}/userTasks.json`;

    const response = await fetch(tasksUrl, {
      method: "POST",
      body: JSON.stringify(newTask),
    });

    if (response.ok) {
      navigate(`/${params.roomId}`);
    } else {
      console.log("Something went wrong");
    }
  }

  // Function to calculate the due date based on frequencyType and frequencyNumber
  const calculateDueDate = (type, number) => {
    const currentDate = new Date();
    switch (type) {
      case "daily":
        currentDate.setDate(currentDate.getDate() + number);
        break;
      case "weekly":
        currentDate.setDate(currentDate.getDate() + number * 7);
        break;
      case "monthly":
        currentDate.setMonth(currentDate.getMonth() + number);
        break;
      default:
        break;
    }
    return currentDate.toISOString();
  };

  return (
    <div className="contentTaskAdd">
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

        <h2>Adding New Task</h2>
      </div>
      <div className="taskNameBox">
        <label>Task Name:</label>
        <input type="text" value={task} onChange={handleTaskChange} />
      </div>
      <div className="freqTaskBox">
        <label>Do every:</label>
        <div className="inputBoxTask">
          <label className="freqNumber">
            <input
              type="number"
              min="1"
              value={frequencyNumber}
              onChange={handleFrequencyNumberChange}
            />
          </label>
          <select
            className="freqType"
            value={frequencyType}
            onChange={handleFrequencyTypeChange}
          >
            <option value="daily">Day</option>
            <option value="weekly">Week</option>
            <option value="monthly">Month</option>
          </select>
        </div>
      </div>
      <button className="cta addButtonTasks" onClick={addTask}>
        <svg
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 11.5H13V7.5C13 7.23478 12.8946 6.98043 12.7071 6.79289C12.5196 6.60536 12.2652 6.5 12 6.5C11.7348 6.5 11.4804 6.60536 11.2929 6.79289C11.1054 6.98043 11 7.23478 11 7.5V11.5H7C6.73478 11.5 6.48043 11.6054 6.29289 11.7929C6.10536 11.9804 6 12.2348 6 12.5C6 12.7652 6.10536 13.0196 6.29289 13.2071C6.48043 13.3946 6.73478 13.5 7 13.5H11V17.5C11 17.7652 11.1054 18.0196 11.2929 18.2071C11.4804 18.3946 11.7348 18.5 12 18.5C12.2652 18.5 12.5196 18.3946 12.7071 18.2071C12.8946 18.0196 13 17.7652 13 17.5V13.5H17C17.2652 13.5 17.5196 13.3946 17.7071 13.2071C17.8946 13.0196 18 12.7652 18 12.5C18 12.2348 17.8946 11.9804 17.7071 11.7929C17.5196 11.6054 17.2652 11.5 17 11.5Z"
            fill="white"
          />
        </svg>
        Add Task
      </button>
    </div>
  );
}
