import React, { useState } from 'react';
import RecipeCard from '../RecipeCard/RecipeCard';// Import RecipeCard component
import './Recipe.css';

const Recipe = () => {
    const [term, setTerm] = useState(''); // State to store input value
    const [data, setData] = useState(null); // State to store API response data

    // Function to fetch recipes data from Edamam API
    const getRecipes = (event) => {
        event.preventDefault(); // Prevent default form submission
        fetch(`https://api.edamam.com/api/recipes/v2?type=public&q=${term}&app_id=db5b797f&app_key=fcb4583a5b460f67a87e041cb9ef788c`)
            .then(response => response.json())
            .then(json => setData(json))
            .catch(error => console.error(error));
    };

    return (
        <div>
            <h1>Search Recipes</h1>
            <form className='form' onSubmit={getRecipes}>
                <div className='input-box'>
                    <input
                        type='text'
                        className='input'
                        placeholder='Ingredients you have'
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                    />
                    <button type="submit" className="search-button">
                        <img src="path_to_your_icon_image" alt="Search Icon" />
                    </button>
                </div>
            </form>
            <h2>Recipes Found:</h2>
            {data ? (
                
                <div className="recipes-list">
                    
                    {data.hits.map((hit, index) => (
                        <RecipeCard key={index} recipe={hit.recipe} />
                    ))}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Recipe;
