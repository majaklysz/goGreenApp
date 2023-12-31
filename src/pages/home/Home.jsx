import { useNavigate } from "react-router-dom";
import "./home.css";
import { getAuth } from "@firebase/auth";
import { useEffect, useState } from "react";
import PlusIcon from "../../assets/icons/fi-rr-plus.svg";
import PlusGreen from "../../assets/icons/plusGreen.svg";

export default function Home() {
  const navigate = useNavigate();
  const auth = getAuth();
  const handleNavigate = () => {
    navigate("/addRoom");
  };

  const [userRooms, setUserRooms] = useState([]);

  useEffect(() => {
    async function getUserRooms() {
      // Check if auth.currentUser is not null before accessing its properties
      if (auth.currentUser) {
        const url = `${import.meta.env.VITE_FIREBASE_DB_URL}users/${
          auth.currentUser.uid
        }/userRooms.json`;
        const response = await fetch(url);
        const data = await response.json();
        const roomsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setUserRooms(roomsArray);
      }
    }

    getUserRooms();
  }, [auth.currentUser]);

  return (
    <section>
      <div className="heading">
        <h1>Rooms</h1>
        <img onClick={handleNavigate} src={PlusIcon} alt="Add plus" />
      </div>
      <div className="roomsContent contentScrollable">
        {userRooms.length > 0 ? (
          userRooms.map((room) => (
            <div
              key={room.id}
              className="roomItem"
              onClick={() => navigate(`/${room.id}`)}
            >
              <p>{room.room_name}</p>
            </div>
          ))
        ) : (
          <div onClick={handleNavigate} className="placeholderRooms">
            <p>Add Your First Room</p>
            <img src={PlusGreen} alt="placeholder" />
          </div>
        )}
      </div>
    </section>
  );
}
