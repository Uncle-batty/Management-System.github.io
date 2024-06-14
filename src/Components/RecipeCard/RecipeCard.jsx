import React from 'react';
import './RecipeCard.css'; // Import CSS for styling

const RecipeCard = ({ recipe }) => {
    return (
        <div className="recipe-card">
            <img src={recipe.images.REGULAR.url} alt={recipe.label} className="recipe-image" />
            <div className="recipe-details">
                <h2>{recipe.label}</h2>
                <div className='details-list'>
                <p>Calories: {Math.round(recipe.calories)}</p>
                <p>Time: {recipe.totalTime}</p>
                <p>Servings: {recipe.yield}</p>
                </div>
                <p>Cuisine:</p>
                <ul className="ingredient-list">
                    {recipe.cuisineType.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                </ul>
                <a href={recipe.url} target="_blank" rel="noopener noreferrer">View Recipe</a>
            </div>
        </div>
    );
};

export default RecipeCard;
