import { NavLink, useLocation } from "react-router-dom";
import "./navbot.css";

import activeHome from "../../icons/fi-rr-homeActive.svg";
import Home from "../../icons/fi-rr-home.svg";
import activeDaily from "../../icons/fi-rr-list-checkActive.svg";
import Daily from "../../icons/fi-rr-list-check.svg";
import activeEco from "../../icons/fi-rr-leafActive.svg";
import Eco from "../../icons/fi-rr-leaf.svg";

export default function NavBottom() {
  const location = useLocation();

  return (
    <nav className="navBottom">
      <div className="navbox">
        <NavLink to="/">
          <img
            src={location.pathname === "/" ? activeHome : Home}
            alt="Home Icon"
          />
          <p>Rooms</p>
        </NavLink>
        <NavLink to="/dailyList">
          <img
            src={location.pathname === "/dailyList" ? activeDaily : Daily}
            alt="Daily List"
          />
          <p>Daily List</p>
        </NavLink>
        <NavLink to="/recipes">
          <img
            src={location.pathname === "/recipes" ? activeEco : Eco}
            alt="Eco Recipes for Cleaning Detergents"
          />
          <p>EcoRecipes</p>
        </NavLink>
      </div>
    </nav>
  );
}
