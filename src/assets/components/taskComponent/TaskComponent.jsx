/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import "../taskComponent/taskCard.css";
import { getAuth } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

export default function TaskComponent({ task }) {
  const navigate = useNavigate();
  const [isDone, setIsDone] = useState(false);
  const { dueDate, frequencyType, frequencyNumber } = task || {};
  const params = useParams();
  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  const calculateNewDueDate = (type, number) => {
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    const dueDateTime = new Date(dueDate);
    dueDateTime.setUTCHours(0, 0, 0, 0);

    let timeDifference =
      number *
      MILLISECONDS_IN_DAY *
      {
        daily: 1,
        weekly: 7,
        monthly: 30,
      }[type];

    const newDueDate = new Date(currentDate.getTime() + timeDifference);
    return newDueDate;
  };

  const calculateDaysUntilDue = useCallback(() => {
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    const dueDateTime = new Date(dueDate);
    dueDateTime.setUTCHours(0, 0, 0, 0);

    let timeDifference =
      isDone && frequencyType
        ? frequencyNumber *
          MILLISECONDS_IN_DAY *
          {
            daily: 1,
            weekly: 7,
            monthly: 30,
          }[frequencyType]
        : dueDateTime.getTime() - currentDate.getTime();

    return Math.ceil(timeDifference / MILLISECONDS_IN_DAY);
  }, [isDone, dueDate, frequencyType, frequencyNumber]);

  const [dueInDays, setDueInDays] = useState(calculateDaysUntilDue());

  const handleDoneButtonClick = async () => {
    setIsDone(true);

    // Calculate the new dueDate based on frequency
    const newDueDate = calculateNewDueDate(frequencyType, frequencyNumber);

    // Assuming you have an API endpoint to update the task status
    try {
      const url = `${
        import.meta.env.VITE_FIREBASE_DB_URL
      }users/${userId}/userTasks/${task.id}.json`;

      // Get the existing task data
      const existingTaskResponse = await fetch(url);
      const existingTaskData = await existingTaskResponse.json();

      // Update dueDate and isDone properties
      const updatedTaskData = {
        ...existingTaskData,
        dueDate: newDueDate.toISOString(),
      };

      // Send a PUT request with the updated task data
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTaskData),
      });

      // Update user points
      const userUrl = `${
        import.meta.env.VITE_FIREBASE_DB_URL
      }users/${userId}.json`;
      const userResponse = await fetch(userUrl);
      const userData = await userResponse.json();

      // Increment points by 10
      const updatedPoints = (userData.points || 0) + 5;

      // Send a PUT request to update user points
      await fetch(userUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData, points: updatedPoints }),
      });

      // Handle success, e.g., show a success message or update state
      console.log("Task status updated successfully");
    } catch (error) {
      console.error("Error updating task status:", error);
      // Handle error, e.g., show an error message
    }
  };

  useEffect(() => {
    setDueInDays(calculateDaysUntilDue());
  }, [task, calculateDaysUntilDue, isDone, frequencyType, frequencyNumber]);

  const taskClasses = [
    "notDoneTask",
    dueInDays === 0 ? "dueTodayTask" : "",
  ].join(" ");

  return (
    <div className={taskClasses} id="taskCard">
      <div className="taskInfo">
        <div
          className="editTask"
          onClick={() =>
            navigate(`/editTask/${task.id}`, {
              state: { roomId: params.roomId },
            })
          }
        >
          <p>.</p>
          <p>.</p>
          <p>.</p>
        </div>
        <div>
          <h3>{task?.name}</h3>
          {dueInDays === 0 ? (
            <p>Due today</p>
          ) : (
            <p>
              Due in {dueInDays} {dueInDays === 1 ? "day" : "days"}
            </p>
          )}
        </div>
      </div>
      <button onClick={handleDoneButtonClick}></button>
    </div>
  );
}
