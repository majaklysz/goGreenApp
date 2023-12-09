/* eslint-disable react/prop-types */

import { useState, useEffect, useCallback } from "react";
import "../taskComponent/taskCard.css";

export default function TaskComponent({ task }) {
  const [isDone, setIsDone] = useState(false);
  const [key, setKey] = useState(0); // Introduce a key to remount the component

  const calculateDueInDays = useCallback(
    (dueDate, frequencyType, frequencyNumber) => {
      const currentDate = new Date();
      const dueDateTime = new Date(dueDate);

      // Set both dates to UTC to avoid timezone discrepancies
      currentDate.setUTCHours(0, 0, 0, 0);
      dueDateTime.setUTCHours(0, 0, 0, 0);

      let timeDifference;
      if (isDone && frequencyType) {
        // Adjust due date based on frequency when the task is marked as done
        switch (frequencyType) {
          case "daily":
            timeDifference = frequencyNumber * (1000 * 3600 * 24);
            break;
          case "weekly":
            timeDifference = frequencyNumber * 7 * (1000 * 3600 * 24);
            break;
          case "monthly":
            // Note: This is a simple calculation and may not cover all edge cases
            timeDifference = frequencyNumber * 30 * (1000 * 3600 * 24);
            break;
          default:
            break;
        }
      } else {
        timeDifference = dueDateTime.getTime() - currentDate.getTime();
      }

      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      return daysDifference;
    },
    [isDone]
  );

  const [dueInDays, setDueInDays] = useState(
    calculateDueInDays(task.dueDate, task.frequencyType, task.frequencyNumber)
  );

  useEffect(() => {
    setDueInDays(
      calculateDueInDays(task.dueDate, task.frequencyType, task.frequencyNumber)
    );
  }, [
    task.dueDate,
    task.frequencyType,
    task.frequencyNumber,
    calculateDueInDays,
    isDone,
  ]);

  const taskClasses = [
    "taskCard",
    isDone ? "taskDone" : "notDoneTask",
    dueInDays === 0 ? "dueTodayTask" : "",
  ].join(" ");

  const handleCheckboxChange = () => {
    setIsDone((prevIsDone) => !prevIsDone);
  };

  return (
    <div key={key} className={taskClasses} id="taskCard">
      <div>
        <h3>{task.name}</h3>
        {dueInDays === 0 ? (
          <p>Due today</p>
        ) : (
          <p>
            Due in {dueInDays} {dueInDays === 1 ? "day" : "days"}
          </p>
        )}
      </div>
      <input type="checkbox" checked={isDone} onChange={handleCheckboxChange} />
    </div>
  );
}
