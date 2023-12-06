import { useNavigate } from "react-router-dom";
import "./home.css";
export default function Home() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/addRoom");
  };
  return (
    <section>
      <div className="heading">
        <h1>Rooms</h1>
        <img
          onClick={handleNavigate}
          src="src/assets/icons/fi-rr-plus.svg"
          alt="Add plus"
        />
      </div>
      <div className="roomsContent">
        <div onClick={handleNavigate} className="placeholderRooms">
          <p>Add Your First Room</p>
          <img src="src/assets/icons/plusGreen.svg" alt="placeholder" />
        </div>
      </div>
    </section>
  );
}
