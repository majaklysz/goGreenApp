import { getAuth, signOut } from "@firebase/auth";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import defaultPicture from "../../assets/icons/fi-rr-user.svg";
import smallGreenArrow from "../../assets/icons/arrowsmallrightGreen.svg";
import placeholderIcon from "../../assets/icons/fi-rr-leaf.svg";
import "./profilestyle.css";

export default function ProfilePage() {
  const auth = getAuth();
  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  const [name, setName] = useState("");
  const [points, setPoints] = useState();
  const [level, setLevel] = useState("");
  const [serce, setSerce] = useState("");
  const userUrl = currentUser
    ? `${import.meta.env.VITE_FIREBASE_DB_URL}users/${currentUser.uid}.json`
    : "";

  useEffect(() => {
    async function getUser() {
      if (!currentUser) {
        return;
      }
      const response = await fetch(userUrl);
      const userData = await response.json();

      if (userData) {
        setName(userData.name);
        setPoints(userData.points);
      }
    }
    getUser();
  }, [currentUser, userUrl]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    async function getRecipes() {
      const url = `${import.meta.env.VITE_FIREBASE_DB_URL}recipes.json`;
      const response = await fetch(url);
      const data = await response.json();
      const recipesArray = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setRecipes(recipesArray);
    }
    getRecipes();
  }, []);

  useEffect(() => {
    const savedRecipesArray = recipes.filter(
      (recipe) => localStorage.getItem(`${recipe.id}`) === "true"
    );

    setSavedRecipes(savedRecipesArray);
  }, [recipes]);

  async function handleNameChange(e) {
    e.preventDefault();
    const newName = e.target.value;
    setName(newName);

    const nameToUpdate = {
      name: newName,
      points: points,
    };

    const response = await fetch(userUrl, {
      method: "PUT",
      body: JSON.stringify(nameToUpdate),
    });

    if (response.ok) {
      console.log("Name changed!");
    } else {
      console.log("Something went wrong");
    }
  }

  const [searchValue, setSearchValue] = useState("");

  let recipesToDisplay = [...savedRecipes];

  if (searchValue) {
    recipesToDisplay = recipesToDisplay.filter((recipe) =>
      recipe.name.toLowerCase().includes(searchValue)
    );
  }

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function settingPointHeart() {
      let pointsForNextLevel;

      if (0 <= points && points <= 100) {
        setSerce("💛");
        setLevel("Clutter Cadet");
        pointsForNextLevel = 100;
      } else if (100 < points && points <= 200) {
        setSerce("💚");
        setLevel("Mop Apprentice");
        pointsForNextLevel = 200;
      } else if (200 < points && points <= 300) {
        setSerce("💙");
        setLevel("Scrub Sergeant");
        pointsForNextLevel = 300;
      } else if (300 < points && points <= 400) {
        setSerce("💜");
        setLevel("Polish Pioneer");
        pointsForNextLevel = 400;
      } else if (400 < points && points <= 500) {
        setSerce("🧡");
        setLevel("Gleam Guardian");
        pointsForNextLevel = 500;
      } else {
        setSerce("💖");
        setLevel("Master Cleaner");
        pointsForNextLevel = 600;
      }

      const pointsInCurrentLevel = points - (pointsForNextLevel - 100);
      const progressPercentage = (pointsInCurrentLevel / 100) * 100;
      setProgress(progressPercentage);
    }

    settingPointHeart();
  }, [points]);

  console.log(serce);

  return (
    <section className="profile">
      <div className="userProfile">
        <div className="progress-container">
          <CircularProgressbar
            value={progress}
            text={
              <tspan>
                <tspan x="50%" dy="-4" textAnchor="middle" fontSize="10px">
                  {`${Math.round(progress)}%`}
                </tspan>
                <tspan x="50%" dy="15" textAnchor="middle" fontSize="8px">
                  {`${level}`}
                </tspan>
              </tspan>
            }
            strokeWidth={10}
            styles={{
              root: {},
              path: {
                stroke: "var(--green)",
              },
              text: {
                fill: "var(--green)",
                fontSize: "8px",
              },
              trail: {
                stroke: "rgb(194 220 111 / 14%)",
              },
            }}
          />
        </div>
        <div className="userDetails">
          <img src={defaultPicture} alt="" />
          <input
            className="userName"
            type="text"
            value={name}
            onChange={handleNameChange}
          />
        </div>
      </div>

      <div className="savedRecipes">
        <div className="searchHeadline">
          <h2>Saved Recipes</h2>
          <div className="searchBoxProfile">
            <input
              className="searchSaved"
              type="search"
              placeholder="🔍 Search"
              onChange={(e) => setSearchValue(e.target.value.toLowerCase())}
            />
          </div>
        </div>
        <div className="scrollProfile">
          {recipesToDisplay.length === 0 ? (
            <div
              className="placecholderSaved"
              onClick={() => navigate("/recipes")}
            >
              <img src={placeholderIcon} alt="" />
              <p>
                No saved recipes yet.
                <br /> Explore our EcoRecipes.
              </p>
            </div>
          ) : (
            recipesToDisplay.map((recipe) => (
              <div
                className="recipeCard"
                key={recipe.id}
                onClick={() => navigate(`/recipes/${recipe.id}`)}
              >
                <p>{recipe.name}</p>
                <img src={smallGreenArrow} alt="arrow" />
              </div>
            ))
          )}
        </div>
      </div>
      <div>
        <button className="cta logOut" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </section>
  );
}
