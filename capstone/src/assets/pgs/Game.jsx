import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const GamePage = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const getGamesData = async () => {
      try {
        const res = await axios.get('http://localhost:3808/api/reviews/games');
        setGames(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    getGamesData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Browse Games</h1>
      <ul>
        {games.map((game) => (
          <li key={game.id} className="my-4">
            <Link to={`/games/${game.id}`} className="text-blue-500 underline">
              {game.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GamePage;
