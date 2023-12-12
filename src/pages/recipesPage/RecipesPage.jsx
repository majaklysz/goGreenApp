import { useEffect, useState } from "react";
import "./Recipes.css";
import { useNavigate } from "react-router-dom";
export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    async function getRecipes() {
      const url = `${import.meta.env.VITE_FIREBASE_DB_URL}recipes.json`; // Remove the extra ',json' in the URL
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
  return (
    <section>
      <h1 className="headingEco">Green Supplies</h1>
      <p className="paraEco">
        Discover easy, eco-friendly recipes for homemade cleaning supplies!
        Healthier approach to keeping your space clean!
      </p>
      <div className="scrollableBox">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="recipeCard"
            onClick={() => navigate(`/${recipe.id}`)}
          >
            <p>{recipe.name}</p>
            <img src="src/assets/icons/arrowsmallrightGreen.svg" alt="arrow" />
          </div>
        ))}
      </div>
    </section>
  );
}
