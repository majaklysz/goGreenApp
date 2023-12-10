import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./roomEdit.css";

export default function RoomEdit() {
  const params = useParams();
  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null;
  const [room, setRoom] = useState({});
  const [name, setName] = useState(room.room_name || "");
  const navigate = useNavigate();
  const url = `${
    import.meta.env.VITE_FIREBASE_DB_URL
  }users/${userId}/userRooms/${params.roomId}.json`;

  useEffect(() => {
    async function getRoom() {
      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.room_name) {
          setRoom({
            ...data,
            id: params.roomId,
          });

          setName(data.room_name);
        } else {
          console.error("Room data or room_name is null or undefined");
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    }

    getRoom();
  }, [params.roomId, url]);

  async function handleSubmit(e) {
    e.preventDefault();
    const roomToUpdate = {
      ...room,
      room_name: name,
      id: room.id,
    };

    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(roomToUpdate),
    });

    if (response.ok) {
      navigate(`/${room.id}`);
    } else {
      console.log("Something went wrong");
    }
  }

  async function handleDelete() {
    const wantToDelete = confirm("Are you sure you want to delete?");

    if (wantToDelete) {
      const response = await fetch(url, {
        method: "DELETE",
      });

      if (response.ok) {
        navigate("/");
      } else {
        console.log("Something went wrong");
      }
    }
  }
  return (
    <section className="roomSettings">
      <form onSubmit={handleSubmit} className="editForm">
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

          <h2>Room Setting</h2>
        </div>
        <label className="inputRoomEdit">
          <p> Room Name:</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <button className="cta">Save</button>
      </form>
      <button onClick={handleDelete} className="deleteButton">
        Delete
      </button>
    </section>
  );
}
