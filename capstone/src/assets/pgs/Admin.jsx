import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const navigate = useNavigate();

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");  // Or get token from your app's state
        const [dashboardRes, usersRes, gamesRes, reviewsRes, categoriesRes] = await Promise.all([
          axios.get("/api/admin/dashboard", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("/api/admin/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("/api/admin/games", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("/api/admin/reviews", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("/api/categories", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        
        // Log responses to check data
        console.log("Dashboard Data:", dashboardRes.data);
        console.log("Users Data:", usersRes.data);
  
        // Set data in state
        setDashboardData(dashboardRes.data);
        setUsers(usersRes.data);
        setGames(gamesRes.data);
        setReviews(reviewsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchDashboard();
  }, []);
  // Delete a user
  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/api/admin/${userId}`);
        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  // Delete a game
  const deleteGame = async (gameId) => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      try {
        await axios.delete(`/api/admin/games/${gameId}`);
        setGames(games.filter((game) => game.id !== gameId));
      } catch (error) {
        console.error("Failed to delete game:", error);
      }
    }
  };

  // Delete a review
  const deleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await axios.delete(`/api/admin/review/${reviewId}`);
        setReviews(reviews.filter((review) => review.id !== reviewId));
      } catch (error) {
        console.error("Failed to delete review:", error);
      }
    }
  };

  // Create a new category
  const createCategory = async () => {
    if (newCategory.trim()) {
      try {
        const res = await axios.post("/api/admin/categories", { name: newCategory });
        setCategories([...categories, res.data]);
        setNewCategory("");
      } catch (error) {
        console.error("Failed to create category:", error);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <div className="mb-6">
        <h2 className="text-xl">Stats</h2>
        <p>Total Users: {dashboardData.totalUsers}</p>
        <p>Total Games: {dashboardData.totalGames}</p>
        <p>Total Reviews: {dashboardData.totalReviews}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl">Users</h2>
        <ul>
  {Array.isArray(users) && users.length > 0 ? (
    users.map((user) => (
      <li key={user.id}>
        {user.name} ({user.email})
        <button onClick={() => deleteUser(user.id)} className="ml-2 text-red-500">
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
  {Array.isArray(games) && games.length > 0 ? (
    games.map((game) => (
      <li key={game.id}>
        {game.title}
        <button onClick={() => deleteGame(game.id)} className="ml-2 text-red-500">
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
  {Array.isArray(reviews) && reviews.length > 0 ? (
    reviews.map((review) => (
      <li key={review.id}>
        {review.content}
        <button onClick={() => deleteReview(review.id)} className="ml-2 text-red-500">
          Delete
        </button>
      </li>
    ))
  ) : (
    <li>No reviews found</li>
  )}
</ul>
      </div>

      <div className="mb-6">
        <h2 className="text-xl">Categories</h2>
        <input
          type="text"
          placeholder="New category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border p-1 mr-2"
        />
        <button onClick={createCategory} className="bg-blue-500 text-white px-2">Add</button>
        <ul>
  {Array.isArray(categories) && categories.length > 0 ? (
    categories.map((category) => (
      <li key={category.id}>{category.name}</li>
    ))
  ) : (
    <li>No categories found</li>
  )}
</ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
