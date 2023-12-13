import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NotSaved from "../../assets/icons/fi-rr-bookmark.svg";
import Saved from "../../assets/icons/bookMark.svg";
import "./recipe.css";
import arrowBack from "../../assets/icons/fi-rr-angle-small-left.svg";
export default function RecipePage() {
  const [recipe, setRecipe] = useState({
    name: "",
    benefits: "",
    ingredients: [],
    instructions: [],
    note: "",
  });

  // State variables for bookmarking
  const [isSaved, setIsSaved] = useState(false);

  const [name, setName] = useState("");
  const [benefits, setBenefits] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [note, setNote] = useState("");

  const params = useParams();
  const navigate = useNavigate();
  const url = `${import.meta.env.VITE_FIREBASE_DB_URL}recipes/${
    params.recipeId
  }.json`;

  useEffect(() => {
    async function getRecipe() {
      const response = await fetch(url);
      const data = await response.json();
      setRecipe(data);

      if (data) {
        setName(data.name || "");
        setBenefits(data.benefits || "");
        setIngredients(data.ingredients || []);
        setInstructions(data.instructions || []);
        setNote(data.note || "");
      }
    }
    getRecipe();
  }, [url]);

  // Toggle save state and save in user's history
  const handleSaveClick = () => {
    setIsSaved(!isSaved);

    // Save information in user's history (you can use localStorage, sessionStorage, or any other storage solution)
    const savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
    const recipeId = params.recipeId;

    if (isSaved) {
      // Remove from saved recipes
      const updatedRecipes = savedRecipes.filter((id) => id !== recipeId);
      localStorage.setItem("savedRecipes", JSON.stringify(updatedRecipes));
    } else {
      // Add to saved recipes
      localStorage.setItem(
        "savedRecipes",
        JSON.stringify([...savedRecipes, recipeId])
      );
    }
  };

  return (
    <div key={recipe}>
      <div className="headlineRecipe">
        <div className="arrowBackRecipes" onClick={() => navigate("/recipes")}>
          <img className="arrowBack" src={arrowBack} alt="go back arrow" />
          <h1>{name}</h1>
        </div>
        <img
          src={isSaved ? Saved : NotSaved}
          alt=""
          onClick={handleSaveClick}
        />
      </div>
      <div className="recipeContent">
        <div className="benefits">
          <h2>Benefits</h2>
          <p>{benefits}</p>
        </div>
        <div className="ingredients">
          <h2>Ingredients</h2>
          <ul>
            {ingredients.map((ingredient, index) => (
              <li key={index}>
                <span className="greenH">{ingredient.name}</span> -{" "}
                {ingredient.purpose}
                {ingredient.optional && " (Optional)"}
              </li>
            ))}
          </ul>
        </div>
        <div className="instructions">
          <h2>Step-by-Step Instuctions</h2>
          <ol>
            {instructions.map((instruction, index) => (
              <li key={index}>
                <h3>{instruction.step}:</h3> <p> {instruction.description}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="note">
          <h2>Note</h2>
          <p>{note}</p>
        </div>
      </div>
    </div>
  );
}
