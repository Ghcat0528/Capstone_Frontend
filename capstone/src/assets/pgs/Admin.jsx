import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [newGame, setNewGame] = useState({
    title: "",
    genre: "",
    picture: "",
    categories: [], 
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found!");
          navigate("/login");
          return;
        }

        const [dashboardRes, usersRes, gamesRes, reviewsRes] = await Promise.all([
          axios.get("https://capstone-backend-1-1cia.onrender.com/api/admin/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://capstone-backend-1-1cia.onrender.com/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://capstone-backend-1-1cia.onrender.com/api/admin/games", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://capstone-backend-1-1cia.onrender.com/api/admin/reviews", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          
        ]);


        setDashboardData(dashboardRes.data);
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);  
        setGames(Array.isArray(gamesRes.data) ? gamesRes.data : []);  
        setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const handleGameInputChange = (e) => {
    const { name, value } = e.target;
    setNewGame({
      ...newGame,
      [name]: value,
    });
  };


  

  const createGame = async () => {
    const token = localStorage.getItem("token");
    if (newGame.title.trim() && newGame.genre.trim()) {
      try {
        const res = await axios.post(
          "https://capstone-backend-1-1cia.onrender.com/api/admin/games",
          newGame,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setGames([...games, res.data]);
        setNewGame({ title: "", genre: "", picture: "", categories: [] }); // Reset form
        setConfirmationMessage("Game successfully added!");
      } catch (error) {
        console.error("Failed to create game:", error);
      }
    }
  };

  
  const deleteUser = async (userId) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/api/admin/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const deleteGame = async (gameId) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Are you sure you want to delete this game?")) {
      try {
        await axios.delete(`/api/admin/games/${gameId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGames(games.filter((game) => game.id !== gameId));
      } catch (error) {
        console.error("Failed to delete game:", error);
      }
    }
  };

  const deleteReview = async (reviewId) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await axios.delete(`/api/admin/review/${reviewId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(reviews.filter((review) => review.id !== reviewId));
      } catch (error) {
        console.error("Failed to delete review:", error);
      }
    }
  };

  

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>

      {/* Add New Game Form */}
      <div className="mb-6">
        <h2 className="text-xl">Add New Game</h2>
        <input
          type="text"
          name="title"
          placeholder="Game Title"
          value={newGame.title}
          onChange={handleGameInputChange}
          className="border p-2 mb-2"
        />
        <input
          type="text"
          name="genre"
          placeholder="Game Genre"
          value={newGame.genre}
          onChange={handleGameInputChange}
          className="border p-2 mb-2"
        />
        <input
          type="text"
          name="picture"
          placeholder="Game Picture URL"
          value={newGame.picture}
          onChange={handleGameInputChange}
          className="border p-2 mb-2"
        />
        
        

        <button
          onClick={createGame}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Add Game
        </button>
      </div>
      {confirmationMessage && (
        <div className="bg-green-200 p-2 my-2 text-green-800">
          {confirmationMessage}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl">Stats</h2>
        <p>Total Users: {dashboardData.totalUsers}</p>
        <p>Total Games: {dashboardData.totalGames}</p>
        <p>Total Reviews: {dashboardData.totalReviews}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl">Users</h2>
        <ul>
          {users.length > 0 ? (
            users.map((user) => (
              <li key={user.id}>
                {user.name} ({user.email})
                <button
                  onClick={() => deleteUser(user.id)}
                  className="ml-2 text-red-500"
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <li>No users found</li>
          )}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-xl">Games</h2>
        <ul>
          {games.length > 0 ? (
            games.map((game) => (
              <li key={game.id}>
                {game.title}
                <button
                  onClick={() => deleteGame(game.id)}
                  className="ml-2 text-red-500"
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <li>No games found</li>
          )}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-xl">Reviews</h2>
        <ul>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <li key={review.id}>
                {review.content}
                <button
                  onClick={() => deleteReview(review.id)}
                  className="ml-2 text-red-500"
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <li>No reviews found</li>
          )}
        </ul>
      </div>

      
    </div>
  );
};

export default AdminDashboard;
