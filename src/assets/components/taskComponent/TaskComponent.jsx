/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import "../taskComponent/taskCard.css";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";

const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

export default function TaskComponent({ task }) {
  const [isDone, setIsDone] = useState(false);
  const { dueDate, frequencyType, frequencyNumber } = task || {};
  const params = useParams();
  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null;

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
    const newDueDate = calculateNewDueDate();

    // Assuming you have an API endpoint to update the task status
    try {
      const url = `${
        import.meta.env.VITE_FIREBASE_DB_URL
      }users/${userId}/userRooms/${params.roomId}/userTasks/${task.id}.json`;

      // Get the existing task data
      const existingTaskResponse = await fetch(url);
      const existingTaskData = await existingTaskResponse.json();

      // Update dueDate and isDone properties
      const updatedTaskData = {
        ...existingTaskData,
        dueDate: newDueDate.toISOString(),
        isDone: true,
      };

      // Send a PUT request with the updated task data
      await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTaskData),
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
  }, [task, calculateDaysUntilDue, isDone]);

  const taskClasses = [
    "notDoneTask",
    dueInDays === 0 ? "dueTodayTask" : "",
  ].join(" ");

  // Function to calculate the new dueDate based on frequency
  const calculateNewDueDate = () => {
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);

    const dueDateTime = new Date(dueDate);
    dueDateTime.setUTCHours(0, 0, 0, 0);

    let timeDifference =
      frequencyNumber *
      MILLISECONDS_IN_DAY *
      {
        daily: 1,
        weekly: 7,
        monthly: 30,
      }[frequencyType];

    const newDueDate = new Date(currentDate.getTime() + timeDifference);
    return newDueDate;
  };

  return (
    <div className={taskClasses} id="taskCard">
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
      <button onClick={handleDoneButtonClick}>Done</button>
    </div>
  );
}
