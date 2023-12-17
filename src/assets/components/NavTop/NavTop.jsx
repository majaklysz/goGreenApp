import { useNavigate } from "react-router-dom";
import "./navtop.css";
import { useEffect, useState } from "react";
import { getAuth } from "@firebase/auth";
import Logo from "../../icons/logo.svg";
import User from "../../icons/fi-rr-user.svg";

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

  const [serce, setSerce] = useState("");

  useEffect(() => {
    function settingPointHeart() {
      if (0 <= points && points <= 100) {
        setSerce("💛");
      } else if (100 < points && points <= 200) {
        setSerce("💚");
      } else if (200 < points && points <= 300) {
        setSerce("💙");
      } else if (300 < points && points <= 400) {
        setSerce("💜");
      } else if (400 < points && points <= 500) {
        setSerce("🧡");
      } else {
        setSerce("💖");
      }
    }
    settingPointHeart();
  }, [points]);

  return (
    <nav className="navtop">
      <img
        onClick={() => navigate("/")}
        className="logo"
        src={Logo}
        alt="logo"
      />
      <div className="user" onClick={() => navigate("/profile")}>
        <div className="streak">
          {serce} {points} pt
        </div>
        <div>
          <img className="userPic" src={User} alt="user" />
        </div>
      </div>
    </nav>
  );
}
