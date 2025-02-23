import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    
    const getData = async () => {
      try {
        const usersRes = await axios.get("http://localhost:3808/api/users");
        const reviewsRes = await axios.get("http://localhost:3808/api/reviews");
        const gamesRes = await axios.get("http://localhost:3808/api/games");
        const categoriesRes = await axios.get("http://localhost:3808/api/categories");

        setUsers(usersRes.data);
        setReviews(reviewsRes.data);
        setGames(gamesRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error( error);
      } 
    };

    getData();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3808/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id)); 
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await axios.delete(`http://localhost:3808/api/reviews/${id}`);
      setReviews(reviews.filter((review) => review.id !== id)); 
    } catch (error) {
      console.error( error);
    }
  };

  const handleDeleteGame = async (id) => {
    try {
      await axios.delete(`http://localhost:3808/api/games/${id}`);
      setGames(games.filter((game) => game.id !== id)); 
    } catch (error) {
      console.error( error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:3808/api/categories/${id}`);
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error( error);
    }
  };



  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id} className="flex justify-between items-center">
              <Link to={`/users/${user.id}`} className="text-blue-500 underline">
                {user.name}
              </Link>
              <button
                className="bg-red-500 text-white p-1 rounded"
                onClick={() => handleDeleteUser(user.id)}
              >
                Delete User
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Reviews</h2>
        <ul>
          {reviews.map((review) => (
            <li key={review.id} className="flex justify-between items-center">
              <span>{review.content}</span>
              <button
                className="bg-red-500 text-white p-1 rounded"
                onClick={() => handleDeleteReview(review.id)}
              >
                Delete Review
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Games</h2>
        <ul>
          {games.map((game) => (
            <li key={game.id} className="flex justify-between items-center">
              <Link to={`/games/${game.id}`} className="text-blue-500 underline">
                {game.title}
              </Link>
              <button
                className="bg-red-500 text-white p-1 rounded"
                onClick={() => handleDeleteGame(game.id)}
              >
                Delete Game
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Categories</h2>
        <ul>
          {categories.map((category) => (
            <li key={category.id} className="flex justify-between items-center">
              <span>{category.name}</span>
              <button
                className="bg-red-500 text-white p-1 rounded"
                onClick={() => handleDeleteCategory(category.id)}
              >
                Delete Category
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;
