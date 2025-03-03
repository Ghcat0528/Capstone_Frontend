import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AddGame from './AddGame'; 

const GamesPage = () => {
  const [games, setGames] = useState([]);
  const [showAddGameForm, setShowAddGameForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoriesRes = await axios.get('http://localhost:3808/api/reviews/categories');
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    getCategories();
  }, []);

  useEffect(() => {
    const getGames = async () => {
        try {
            let gamesRes;
            if (activeFilters.length > 0) {
                gamesRes = await axios.get('http://localhost:3808/api/reviews/catgames', {
                    params: { categories: activeFilters.join(',') },
                });
            } else {
                gamesRes = await axios.get('http://localhost:3808/api/reviews/catgames');
            }
            setGames(gamesRes.data);
        } catch (error) {
            console.error(error);
        }
    };
    getGames();
}, [activeFilters]);


const handleCategoryFilter = (categoryId) => {
    setActiveFilters((prevFilters) =>
        prevFilters.includes(categoryId)
            ? prevFilters.filter((id) => id !== categoryId) // Remove category if already selected
            : [...prevFilters, categoryId] // Add category if not selected
    );
};

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Games</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Filter by Category:</h2>
        <div className="flex flex-wrap gap-2 mt-2">
        {categories.map((category) => (
    <button
        key={category.id}
        onClick={() => handleCategoryFilter(category.id)}
        style={{
            backgroundColor: activeFilters.includes(category.id) ? 'blue' : 'gray',
            color: 'white',
            margin: '5px',
            padding: '10px',
            borderRadius: '5px',
            cursor: 'pointer'
        }}
    >
        {category.name}
    </button>
))}
         
        </div>
      </div>

      <ul>
        {games.map((game) => (
          <li key={game.id} className="mb-4">
            <Link
              to={`/games/${game.id}`} // Fixed the template literal issue here
              className="text-blue-500 hover:underline"
            >
              <h3 className="text-xl font-semibold">{game.title}</h3>
              <p>{game.genre}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GamesPage;
