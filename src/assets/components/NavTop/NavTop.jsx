import { useNavigate } from "react-router-dom";
import "./navtop.css";
import { useEffect, useState } from "react";
import { getAuth } from "@firebase/auth";

export default function NavTop() {
  const navigate = useNavigate();
  const [points, setPoints] = useState(0);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  // Check if currentUser is available before accessing its properties
  const url = currentUser
    ? `${import.meta.env.VITE_FIREBASE_DB_URL}users/${currentUser.uid}.json`
    : "";

  useEffect(() => {
    async function getUser() {
      if (!currentUser) {
        return;
      }

      const response = await fetch(url);
      const userData = await response.json();

      if (userData) {
        setPoints(userData.points);
      }
    }
    getUser();
  }, [url, currentUser]);

  return (
    <nav className="navtop">
      <img
        onClick={() => navigate("/")}
        className="logo"
        src="src/assets/icons/logo.svg"
        alt=""
      />
      <div className="user" onClick={() => navigate("/profile")}>
        <div className="streak"> {points} pt</div>
        <div>
          <img
            className="userPic"
            src="src/assets/icons/fi-rr-user.svg"
            alt=""
          />
        </div>
      </div>
    </nav>
  );
}
