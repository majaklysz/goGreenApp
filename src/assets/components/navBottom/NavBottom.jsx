import { NavLink } from "react-router-dom";
import "./navbot.css";
import { useState } from "react";
import activeHome from "../../icons/fi-rr-homeActive.svg";
import Home from "../../icons/fi-rr-home.svg";
import activeDaily from "../../icons/fi-rr-list-checkActive.svg";
import Daily from "../../icons/fi-rr-list-check.svg";
import activeEco from "../../icons/fi-rr-leafActive.svg";
import Eco from "../../icons/fi-rr-leaf.svg";

export default function NavBottom() {
  const [activeStates, setActiveStates] = useState({
    home: true,
    daily: false,
    eco: false,
  });

  const handleNavLinkClick = (navLink) => {
    // Set the clicked NavLink to active and others to inactive
    setActiveStates({
      home: navLink === "home",
      daily: navLink === "daily",
      eco: navLink === "eco",
    });
  };

  return (
    <nav className="navBottom">
      <div className="navbox">
        <NavLink
          to="/"
          className={`home ${activeStates.home ? "active" : ""}`}
          onClick={() => handleNavLinkClick("home")}
        >
          <img src={activeStates.home ? activeHome : Home} alt="home" />
          <p>Rooms</p>
        </NavLink>
        <NavLink
          to="/dailyList"
          className={`daily ${activeStates.daily ? "active" : ""}`}
          onClick={() => handleNavLinkClick("daily")}
        >
          <img
            src={activeStates.daily ? activeDaily : Daily}
            alt="daily list"
          />
          <p>Daily List</p>
        </NavLink>
        <NavLink
          to="/eco"
          className={`eco ${activeStates.eco ? "active" : ""}`}
          onClick={() => handleNavLinkClick("eco")}
        >
          <img
            src={activeStates.eco ? activeEco : Eco}
            alt="eco recipes for cleaning detergents"
          />
          <p></p>
        </NavLink>
      </div>
    </nav>
  );
}
