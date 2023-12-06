import { useNavigate } from "react-router-dom";
import "./navtop.css";

export default function NavTop() {
  const navigate = useNavigate();
  return (
    <nav className="navtop">
      <img
        onClick={() => navigate("/")}
        className="logo"
        src="src/assets/icons/logo.svg"
        alt=""
      />
      <div className="user">
        <div className="streak"> 7 🔥 </div>
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
