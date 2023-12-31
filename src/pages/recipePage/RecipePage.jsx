import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NotSaved from "../../assets/icons/fi-rr-bookmark.svg";
import Saved from "../../assets/icons/bookMark.svg";
import "./recipe.css";
import arrowBack from "../../assets/icons/fi-rr-angle-small-left.svg";

export default function RecipePage() {
  const navigate = useNavigate();
  const { recipeId } = useParams(); // Use useParams to get the recipeId

  const [recipe, setRecipe] = useState({
    id: "",
    name: "",
    benefits: "",
    ingredients: [],
    instructions: [],
    note: "",
  });

  const url = `${import.meta.env.VITE_FIREBASE_DB_URL}recipes/${recipeId}.json`;

  const localStorageKey = `${recipeId}`;

  useEffect(() => {
    async function getRecipe() {
      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data) {
          setRecipe(data);

          localStorage.setItem(
            localStorageKey,
            localStorage.getItem(localStorageKey) || "false"
          );
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    }
    getRecipe();
  }, [url, recipeId, localStorageKey]);

  const [isSaved, setIsSaved] = useState(
    localStorage.getItem(localStorageKey) === "true"
  );

  const toggleSaved = () => {
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    localStorage.setItem(localStorageKey, newSavedState.toString());
  };

  useEffect(() => {
    // This effect runs when the component mounts.
    // It retrieves the liked state from localStorage and sets the initial state.
    setIsSaved(localStorage.getItem(localStorageKey) === "true");
  }, [localStorageKey]);

  const bookMark = isSaved ? Saved : NotSaved;

  return (
    <div key={recipe.id}>
      <div className="headlineRecipe">
        <div className="arrowBackRecipes" onClick={() => navigate(-1)}>
          <img className="arrowBack" src={arrowBack} alt="go back arrow" />
          <h1>{recipe.name}</h1>
        </div>
        <img src={bookMark} alt="bookmark" onClick={toggleSaved} />
      </div>
      <div className="recipeContent">
        <div className="benefits">
          <h2>Benefits</h2>
          <p>{recipe.benefits}</p>
        </div>
        <div className="ingredients">
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                <span className="greenH">{ingredient.name}</span> -{" "}
                {ingredient.purpose}
                {ingredient.optional && " (Optional)"}
              </li>
            ))}
          </ul>
        </div>
        <div className="instructions">
          <h2>Step-by-Step Instructions</h2>
          <ol>
            {recipe.instructions.map((instruction, index) => (
              <li key={index}>
                <h3>{instruction.step}:</h3> <p>{instruction.description}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="note">
          <h2>Note</h2>
          <p>{recipe.note}</p>
        </div>
      </div>
    </div>
  );
}
