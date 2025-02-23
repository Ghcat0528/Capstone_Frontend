import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const GameDetailsPage = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);

  useEffect(() => {
    const getGameData = async () => {
      try {
        const res = await axios.get(`http://localhost:3808/api/reviews/games/${gameId}`);
        setGame(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    getGameData();
  }, [gameId]);

  if (!game) return <p>Game not found.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{game.title}</h1>
      <img
        src={game.image || '/default-game-image.jpg'}
        alt={game.title}
        className="my-4 w-full h-64 object-cover"
      />
      <p>Average Rating: {game.averageRating}/10</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Reviews</h2>
        {game.reviews.length > 0 ? (
          <ul>
            {game.reviews.map((review) => (
              <li key={review.id} className="border p-2 my-2">
                <div className="flex items-center space-x-4">
                  <img
                    src={review.user.profilePicture || '/default-pfp.png'}
                    alt={`${review.user.name}'s profile`}
                    className="w-10 h-10 rounded-full"
                  />
                  <Link to={`/users/${review.user.id}`} className="font-bold text-blue-500">
                    {review.user.name}
                  </Link>
                </div>
                <p>{review.content} ({review.rating}/10)</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default GameDetailsPage;
