import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReviewPopup from './ReviewPopup';
import EditReviewPopup from './EditReviewPopup';  // Import the new component

const GameDetailsPage = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getGameData = async () => {
      try {
        const res = await axios.get(`http://localhost:3808/api/reviews/games/${gameId}`);
        setGame(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    const getLoggedInUser = async () => {
      try {
        const token = localStorage.getItem('token');  // Retrieve token from local storage
    
        const res = await axios.get('http://localhost:3808/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`  // Send token in request headers
          }
        });
        setLoggedInUserId(res.data.id);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    getGameData();
    getLoggedInUser();
  }, [gameId]);

  const handleEditClick = (review) => {
    setReviewToEdit(review);
    setShowEditPopup(true);
  };

  const refreshGameData = async () => {
    try {
      const res = await axios.get(`http://localhost:3808/api/reviews/games/${gameId}`);
      setGame(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!game) return <p>Game not found.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{game.title}</h1>
      
      <img
        src={game.picture|| '/default-game-image.jpg'}  // Display image or default
        alt={game.title}
        className="my-4 w-full h-64 object-cover rounded-lg shadow-md"
      />

      <p>Average Rating: {game.averageRating ? game.averageRating.toFixed(1) : 'N/A'} / 5</p>
      <button
        onClick={() => navigate('/games')}
        className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 mt-4"
      >
        Back to Games
      </button>
      <button
        onClick={() => setShowReviewPopup(true)}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4 ml-2"
      >
        Review Game
      </button>

      {showReviewPopup && (
        <ReviewPopup
          gameId={gameId}
          onClose={() => setShowReviewPopup(false)}
          onReviewSubmit={refreshGameData}
        />
      )}

      {showEditPopup && reviewToEdit && (
        <EditReviewPopup
          review={reviewToEdit}
          onClose={() => setShowEditPopup(false)}
          onEditSubmit={refreshGameData}
        />
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Reviews</h2>
        {game.reviews && game.reviews.length > 0 ? (
          <ul>
            {game.reviews.map((review) => (
              <li key={review.id} className="border p-2 my-2 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <Link to={`/users/${review.user.id}`} className="font-bold text-blue-500 hover:underline">
                    {review.user.name}
                  </Link>
                  {review.user.id === loggedInUserId && (
                    <button
                      onClick={() => handleEditClick(review)}
                      className="text-sm text-blue-500 underline"
                    >
                      Edit
                    </button>
                  )}
                </div>
                <p>{review.content} ({review.rating}/5)</p>
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
