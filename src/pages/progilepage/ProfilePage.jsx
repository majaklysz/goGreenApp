import { getAuth, signOut } from "@firebase/auth";
import { useEffect, useState } from "react";
import defaultPicture from "../../assets/icons/fi-rr-user.svg";

export default function ProfilePage() {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [name, setName] = useState();
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
      (recipe) => localStorage.getItem(`saved_${recipe.id}`) === "true"
    );

    setSavedRecipes(savedRecipesArray);
  }, [recipes]);

  return (
    <section>
      <h1>Profile</h1>
      <div className="userProfile">
        <img src={defaultPicture} alt="" />
        <p>{name}</p>
        <p>{points}</p>
      </div>
      <div className="savedRecipes">
        <h2>Saved Recipes</h2>
        {savedRecipes.map((recipe) => (
          <div key={recipe.id}>
            <p>{recipe.name}</p>
          </div>
        ))}
      </div>
      <div>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    </section>
  );
}
