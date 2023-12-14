import { getAuth, signOut } from "@firebase/auth";
import { useEffect, useState } from "react";
import defaultPicture from "../../assets/icons/fi-rr-user.svg";
import "./profilestyle.css";
import { useNavigate } from "react-router-dom";
import smallGreenArrow from "../../assets/icons/arrowsmallrightGreen.svg";

export default function ProfilePage() {
  const auth = getAuth();
  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  const [name, setName] = useState("");
  const [points, setPoints] = useState();
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
    // eslint-disable-next-line no-unused-vars
    recipesToDisplay = recipesToDisplay.filter((recipe) =>
      recipe.name.toLowerCase().includes(searchValue)
    );
  }

  return (
    <section className="profile">
      <div className="userProfile">
        <img src={defaultPicture} alt="" />
        <div className="userDetails">
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
          {recipesToDisplay.map((recipe) => (
            <div
              className="recipeCard"
              key={recipe.id}
              onClick={() => navigate(`/recipes/${recipe.id}`)}
            >
              <p>{recipe.name}</p>
              <img src={smallGreenArrow} alt="arrow" />
            </div>
          ))}
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