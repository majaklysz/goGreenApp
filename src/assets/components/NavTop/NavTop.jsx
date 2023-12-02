import "./navtop.css";

export default function NavTop() {
  return (
    <nav className="navtop">
      <img className="logo" src="src/assets/icons/logo.svg" alt="" />
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
